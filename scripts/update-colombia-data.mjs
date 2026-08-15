import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const OFFICIAL_BASE_URL =
  "https://geoportal.dane.gov.co/laboratorio/serviciosjson/gdivipola/servicios";
const OUTPUT_PATH = resolve(
  dirname(fileURLToPath(import.meta.url)),
  "../src/data/colombia.json",
);

async function fetchResult(endpoint) {
  const response = await fetch(`${OFFICIAL_BASE_URL}/${endpoint}`);
  if (!response.ok) {
    throw new Error(
      `DANE respondió ${response.status} al consultar ${endpoint}`,
    );
  }

  const payload = await response.json();
  if (payload.estado !== true || !Array.isArray(payload.resultado)) {
    throw new Error(
      `La respuesta oficial de ${endpoint} no tiene el formato esperado`,
    );
  }

  return payload.resultado;
}

function officialName(value) {
  return value.trim().normalize("NFC");
}

const [departmentRows, cityRows] = await Promise.all([
  fetchResult("departamentos.php"),
  fetchResult("municipios.php"),
]);

const citiesByDepartment = new Map();
for (const row of cityRows) {
  if (["ANM", "ISLA"].includes(row.CODIGO_TIPO_MUNICIPIO)) continue;

  const city = {
    code: String(row.CODIGO_DPTO_MPIO),
    name: officialName(row.NOMBRE_MUNICIPIO),
  };
  const cities = citiesByDepartment.get(row.CODIGO_DEPARTAMENTO) ?? new Map();
  cities.set(city.code, city);
  citiesByDepartment.set(row.CODIGO_DEPARTAMENTO, cities);
}

const collator = new Intl.Collator("es-CO", { sensitivity: "base" });
const departments = departmentRows
  .map((row) => ({
    code: String(row.CODIGO_DEPARTAMENTO).padStart(2, "0"),
    name: officialName(row.NOMBRE_DEPARTAMENTO),
    cities: [
      ...(citiesByDepartment.get(row.CODIGO_DEPARTAMENTO)?.values() ?? []),
    ].sort((left, right) => collator.compare(left.name, right.name)),
  }))
  .sort((left, right) => collator.compare(left.name, right.name));

if (
  departments.length === 0 ||
  departments.some(({ cities }) => cities.length === 0)
) {
  throw new Error(
    "El dataset oficial resultó vacío o contiene departamentos sin municipios",
  );
}

await mkdir(dirname(OUTPUT_PATH), { recursive: true });
await writeFile(OUTPUT_PATH, `${JSON.stringify(departments, null, 2)}\n`);
console.log(
  `DIVIPOLA: ${departments.length} departamentos y ${departments.reduce((total, item) => total + item.cities.length, 0)} municipios/distritos.`,
);
