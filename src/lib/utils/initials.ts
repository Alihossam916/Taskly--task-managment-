export function getInitials(name: string | undefined | null): string | null {
  if (!name) return null;
  return name
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}
