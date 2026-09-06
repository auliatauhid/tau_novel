const numberWords: Record<string, number> = {
  satu: 1,
  dua: 2,
  tiga: 3,
  empat: 4,
  lima: 5,
  enam: 6,
  tujuh: 7,
  delapan: 8,
  sembilan: 9,
  sepuluh: 10,
  sebelas: 11,
  'dua belas': 12,
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
  ten: 10,
  eleven: 11,
  twelve: 12,
  twenty: 20,
};

const romanNumerals: Record<string, number> = {
  i: 1,
  ii: 2,
  iii: 3,
  iv: 4,
  v: 5,
  vi: 6,
  vii: 7,
  viii: 8,
  ix: 9,
  x: 10,
  xi: 11,
  xii: 12,
  xiii: 13,
  xiv: 14,
  xv: 15,
  xvi: 16,
  xvii: 17,
  xviii: 18,
  xix: 19,
  xx: 20,
};

export function parseNumberString(str: string): number | null {
  const trimmed = str.trim().toLowerCase();
  
  // Try integer directly
  const intVal = parseInt(trimmed, 10);
  if (!isNaN(intVal)) {
    return intVal;
  }

  // Try words
  if (numberWords[trimmed]) {
    return numberWords[trimmed];
  }

  // Try Roman numerals
  if (romanNumerals[trimmed]) {
    return romanNumerals[trimmed];
  }

  return null;
}

export function cleanText(str: string): string {
  return str.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
}
