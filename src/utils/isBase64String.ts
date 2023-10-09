export function isBase64String(value: string): boolean {
  // Регулярное выражение для проверки строки base64 (с или без префикса)
  const base64Regex = /^(data:image\/[a-z]+;base64,)?[A-Za-z0-9+/=]+$/;
  return base64Regex.test(value);
}