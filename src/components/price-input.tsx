"use client";

import { formatCOPDigits } from "@/lib/currency";
import { useState } from "react";

export function PriceInput({
  value,
  onChange,
  name,
  disabled = false,
  placeholder = "$500.000",
}: {
  value: string;
  onChange?: (digits: string) => void;
  name?: string;
  disabled?: boolean;
  placeholder?: string;
}) {
  const [internalValue, setInternalValue] = useState(value);
  const digits = (onChange ? value : internalValue).replace(/\D/g, "");
  return (
    <div className="price-wrap">
      <span aria-hidden="true">$</span>
      <input
        aria-label="Valor en pesos colombianos"
        value={formatCOPDigits(digits)}
        onChange={(event) => {
          const next = event.target.value.replace(/\D/g, "");
          setInternalValue(next);
          onChange?.(next);
        }}
        disabled={disabled}
        type="text"
        inputMode="numeric"
        placeholder={placeholder.replace(/^\$/, "")}
      />
      {name && <input type="hidden" name={name} value={digits} />}
    </div>
  );
}
