export function shortenNumber(num: number) {
  if (num >= 1e9) return (num / 1e9).toFixed(1).replace(/\.0$/, '') + 'B';
  if (num >= 1e6) return (num / 1e6).toFixed(1).replace(/\.0$/, '') + 'M';
  if (num >= 1e3) return (num / 1e3).toFixed(1).replace(/\.0$/, '') + 'K';
  return num.toString();
}

export function shortenName(name: string, maxLen = 10) {
  return name.length > maxLen ? name.slice(0, maxLen) + '…' : name;
}