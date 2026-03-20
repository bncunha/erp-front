export function generateSkuId(prefix: string = '', length: number = 8): string {
  const charset = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let value = '';

  for (let i = 0; i < length; i++) {
    value += charset[Math.floor(Math.random() * charset.length)];
  }

  return prefix ? `${prefix}-${value}` : value;
}
