import { getDepartments } from "@/lib/colombia";
import { LocationFields } from "@/components/location-fields";
import { PriceInput } from "@/components/price-input";

export function SearchForm() {
  return (
    <form
      action="/buscar"
      className="grid w-full gap-5 rounded-card bg-white p-6 shadow-soft md:grid-cols-[1fr_1fr_1fr_auto] md:items-end md:p-10"
    >
      <LocationFields departments={getDepartments()} compact />
      <label className="field">
        <span>Presupuesto máximo</span>
        <PriceInput name="maxPrice" value="" />
      </label>
      <button className="button-primary min-h-13 px-7" type="submit">
        ⌕&nbsp; Buscar vivienda
      </button>
    </form>
  );
}
