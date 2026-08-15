export function getCityDisplayName(
  cityCode: string,
  officialName: string,
): string {
  return cityCode === "76001" ? "CALI" : officialName;
}
