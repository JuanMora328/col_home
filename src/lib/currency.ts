const colombianNumber = new Intl.NumberFormat("es-CO", { maximumFractionDigits: 0 });

export function formatCOP(value: number): string {
  return `$${colombianNumber.format(value)}`;
}

export function formatCOPDigits(value: string): string {
  const digits = value.replace(/\D/g, "");
  return digits ? colombianNumber.format(Number(digits)) : "";
}
