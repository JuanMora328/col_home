import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import {
  AVAILABILITY_TYPES,
  PROPERTY_TYPES,
  type AvailabilityType,
  type PropertyType,
} from "@/types/data";
import {
  getCityName,
  getDepartmentName,
  isCityInDepartment,
} from "@/lib/colombia";

export const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;
export const MAX_IMAGE_SIZE = 6 * 1024 * 1024;
type ImageMetadata = { type: string; size: number };
export type PublicationInput = {
  propertyType: PropertyType;
  availabilityType: AvailabilityType;
  department: string;
  city: string;
  neighborhood: string;
  monthlyPrice: number;
  bedrooms: number;
  bathrooms: number;
  description: string;
  contactName: string;
  contactPhone: string;
  images: ImageMetadata[];
  honeypot: string;
  startedAt: number;
};

const clean = (value: unknown, max: number) =>
  typeof value === "string" && value.trim().length <= max ? value.trim() : "";
const int = (value: unknown) =>
  typeof value === "number" && Number.isSafeInteger(value) && value >= 0
    ? value
    : NaN;

export function normalizeColombianPhone(value: string) {
  const digits = value.replace(/\D/g, "");
  const local =
    digits.startsWith("57") && digits.length === 12 ? digits.slice(2) : digits;
  return /^3\d{9}$/.test(local) ? `57${local}` : undefined;
}

export function validatePublication(
  body: unknown,
):
  | {
      ok: true;
      value: PublicationInput & { departmentName: string; cityName: string };
    }
  | { ok: false; message: string } {
  if (!body || typeof body !== "object")
    return { ok: false, message: "Solicitud inválida." };
  const b = body as Record<string, unknown>;
  const propertyType = b.propertyType;
  const availabilityType = b.availabilityType;
  const department = clean(b.department, 2),
    city = clean(b.city, 5),
    neighborhood = clean(b.neighborhood, 80),
    description = clean(b.description, 1500),
    contactName = clean(b.contactName, 80),
    phoneInput = clean(b.contactPhone, 40);
  const monthlyPrice = int(b.monthlyPrice),
    bedrooms = int(b.bedrooms),
    bathrooms = int(b.bathrooms);
  const images = Array.isArray(b.images) ? b.images : [];
  if (clean(b.honeypot, 200))
    return { ok: false, message: "No fue posible enviar el formulario." };
  if (
    !Number.isFinite(b.startedAt) ||
    Date.now() - Number(b.startedAt) < 2500 ||
    Date.now() - Number(b.startedAt) > 24 * 60 * 60 * 1000
  )
    return { ok: false, message: "Espera un momento y vuelve a intentarlo." };
  if (
    !PROPERTY_TYPES.includes(propertyType as PropertyType) ||
    !AVAILABILITY_TYPES.includes(availabilityType as AvailabilityType)
  )
    return {
      ok: false,
      message: "Revisa el tipo de vivienda y disponibilidad.",
    };
  if (!getDepartmentName(department) || !isCityInDepartment(department, city))
    return {
      ok: false,
      message: "Selecciona un departamento y municipio válidos.",
    };
  if (
    !neighborhood ||
    !description ||
    !contactName ||
    !Number.isInteger(monthlyPrice) ||
    !Number.isInteger(bedrooms) ||
    !Number.isInteger(bathrooms) ||
    bathrooms < 1 ||
    bedrooms > 100 ||
    bathrooms > 100 ||
    monthlyPrice > 2_000_000_000
  )
    return {
      ok: false,
      message: "Revisa los campos obligatorios y sus valores.",
    };
  const contactPhone = normalizeColombianPhone(phoneInput);
  if (!contactPhone)
    return {
      ok: false,
      message: "Ingresa un número de WhatsApp colombiano válido.",
    };
  if (
    images.length < 1 ||
    images.length > 5 ||
    images.some(
      (image) =>
        !image ||
        typeof image !== "object" ||
        !IMAGE_TYPES.includes((image as ImageMetadata).type as never) ||
        !Number.isInteger((image as ImageMetadata).size) ||
        (image as ImageMetadata).size < 1 ||
        (image as ImageMetadata).size > MAX_IMAGE_SIZE,
    )
  )
    return {
      ok: false,
      message: "Selecciona entre 1 y 5 fotos JPG, PNG o WebP de máximo 6 MiB.",
    };
  return {
    ok: true,
    value: {
      propertyType: propertyType as PropertyType,
      availabilityType: availabilityType as AvailabilityType,
      department,
      city,
      departmentName: getDepartmentName(department)!,
      cityName: getCityName(department, city)!,
      neighborhood,
      monthlyPrice: availabilityType === "FREE_TEMPORARY" ? 0 : monthlyPrice,
      bedrooms,
      bathrooms,
      description,
      contactName,
      contactPhone,
      images: images as ImageMetadata[],
      honeypot: "",
      startedAt: Number(b.startedAt),
    },
  };
}

function secret() {
  const value = process.env.SUPABASE_SECRET_KEY;
  if (!value) throw new Error("Missing server configuration");
  return value;
}
export function signFlow(payload: string) {
  return `${payload}.${createHmac("sha256", secret()).update(payload).digest("base64url")}`;
}
export function verifyFlow(token: unknown) {
  if (typeof token !== "string") return undefined;
  const split = token.lastIndexOf(".");
  if (split < 1) return undefined;
  const payload = token.slice(0, split),
    signature = token.slice(split + 1),
    expected = createHmac("sha256", secret())
      .update(payload)
      .digest("base64url");
  if (
    signature.length !== expected.length ||
    !timingSafeEqual(Buffer.from(signature), Buffer.from(expected))
  )
    return undefined;
  const [id, expiry] = payload.split(":");
  return Number(expiry) >= Date.now() ? id : undefined;
}
