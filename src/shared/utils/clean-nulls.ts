export function cleanNulls(obj: any): any {
  if (typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) {
    return obj.map((item) => cleanNulls(item));
  }
  const result: any = {};
  for (const key in obj) {
    if (obj[key] === null || obj[key] === undefined || obj[key] === '')
      continue;
    result[key] = cleanNulls(obj[key]);
  }
  return result;
}
