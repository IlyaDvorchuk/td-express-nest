export function isBase64String(value: string): boolean {
  // Регулярное выражение для проверки строки base64
  const base64Regex = /^data:image\/[a-z]+;base64,/;
  return base64Regex.test(value);
}