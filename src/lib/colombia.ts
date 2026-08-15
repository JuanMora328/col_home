import colombiaData from "@/data/colombia.json";
import type { ColombiaCity, ColombiaDepartment } from "@/types/data";

const departments = colombiaData as ColombiaDepartment[];
const departmentsByCode = new Map(
  departments.map((department) => [department.code, department]),
);

export function getDepartments(): readonly ColombiaDepartment[] {
  return departments;
}

export function getCitiesByDepartment(
  departmentCode: string,
): readonly ColombiaCity[] {
  return departmentsByCode.get(departmentCode)?.cities ?? [];
}

export function isCityInDepartment(
  departmentCode: string,
  cityCode: string,
): boolean {
  return getCitiesByDepartment(departmentCode).some(
    (city) => city.code === cityCode,
  );
}

export function getDepartmentName(departmentCode: string): string | undefined {
  return departmentsByCode.get(departmentCode)?.name;
}

export function getCityName(
  departmentCode: string,
  cityCode: string,
): string | undefined {
  return getCitiesByDepartment(departmentCode).find(
    (city) => city.code === cityCode,
  )?.name;
}
