export function saveResult(key: string, value: any) {
  if (typeof window !== "undefined") {
    localStorage.setItem(key, JSON.stringify(value));
  }
}

export function getResult<T = any>(key: string): T | null {
  if (typeof window !== "undefined") {
    const val = localStorage.getItem(key);
    return val ? JSON.parse(val) : null;
  }
  return null;
}
