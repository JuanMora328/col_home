"use client";

import { useState } from "react";
import type { ColombiaDepartment } from "@/types/data";

export function LocationFields({ departments, initialDepartment = "", initialCity = "", compact = false }: { departments: readonly ColombiaDepartment[]; initialDepartment?: string; initialCity?: string; compact?: boolean }) {
  const [department, setDepartment] = useState(initialDepartment);
  const cities = departments.find((item) => item.code === department)?.cities ?? [];
  const control = "control";
  return <>
    <label className={compact ? "field" : "field"}><span>Departamento</span><select name="department" required={!compact} value={department} onChange={(event) => setDepartment(event.target.value)} className={control}><option value="">Selecciona departamento</option>{departments.map((item) => <option key={item.code} value={item.code}>{item.name}</option>)}</select></label>
    <label className="field"><span>Ciudad{compact ? "" : "/Municipio"}</span><select name="city" required={!compact} defaultValue={cities.some((c) => c.code === initialCity) ? initialCity : ""} key={department} disabled={!department} className={control}><option value="">Selecciona ciudad</option>{cities.map((item) => <option key={item.code} value={item.code}>{item.name}</option>)}</select></label>
  </>;
}
