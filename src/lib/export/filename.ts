/**
 * Transliterate Cyrillic Serbian to Latin characters
 * and create safe filenames
 */

// Serbian Cyrillic to Latin transliteration map
const CYRILLIC_TO_LATIN: Record<string, string> = {
  // Basic Cyrillic letters
  а: 'a',
  б: 'b',
  в: 'v',
  г: 'g',
  д: 'd',
  ђ: 'dj',
  е: 'e',
  ж: 'zh',
  з: 'z',
  и: 'i',
  ј: 'j',
  к: 'k',
  л: 'l',
  љ: 'lj',
  м: 'm',
  н: 'n',
  њ: 'nj',
  о: 'o',
  п: 'p',
  р: 'r',
  с: 's',
  т: 't',
  ћ: 'c',
  у: 'u',
  ф: 'f',
  х: 'h',
  ц: 'c',
  ч: 'ch',
  џ: 'dz',
  ш: 'sh',
  // Uppercase
  А: 'A',
  Б: 'B',
  В: 'V',
  Г: 'G',
  Д: 'D',
  Ђ: 'Dj',
  Е: 'E',
  Ж: 'Zh',
  З: 'Z',
  И: 'I',
  Ј: 'J',
  К: 'K',
  Л: 'L',
  Љ: 'Lj',
  М: 'M',
  Н: 'N',
  Њ: 'Nj',
  О: 'O',
  П: 'P',
  Р: 'R',
  С: 'S',
  Т: 'T',
  Ћ: 'C',
  У: 'U',
  Ф: 'F',
  Х: 'H',
  Ц: 'C',
  Ч: 'Ch',
  Џ: 'Dz',
  Ш: 'Sh',
};

/**
 * Transliterate Serbian Cyrillic text to Latin script
 */
export function transliterateToLatin(text: string): string {
  let result = '';
  for (let i = 0; i < text.length; i++) {
    const char = text.charAt(i);
    result += CYRILLIC_TO_LATIN[char] || char;
  }
  return result;
}

/**
 * Create a safe filename by:
 * 1. Transliterating Cyrillic to Latin
 * 2. Replacing spaces and special chars with hyphens
 * 3. Removing invalid filename characters
 * 4. Limiting length
 */
export function createSafeFilename(
  title: string,
  extension: string,
  maxLength = 200
): string {
  // Transliterate
  let safe = transliterateToLatin(title);

  // Replace spaces with hyphens
  safe = safe.replace(/\s+/g, '-');

  // Remove invalid filename characters (keep alphanumeric, hyphens, underscores)
  safe = safe.replace(/[^a-zA-Z0-9\-_]/g, '');

  // Collapse multiple hyphens
  safe = safe.replace(/-+/g, '-');

  // Remove leading/trailing hyphens
  safe = safe.replace(/^-+|-+$/g, '');

  // Limit length (reserve space for date and extension)
  const date = new Date().toISOString().split('T')[0] ?? '';
  const reservedLength = date.length + extension.length + 2; // +2 for hyphens
  const maxTitleLength = maxLength - reservedLength;

  if (safe.length > maxTitleLength) {
    safe = safe.substring(0, maxTitleLength);
    // Remove trailing partial word
    safe = safe.replace(/-[^-]*$/, '');
  }

  // Build final filename: title-date.extension
  return `${safe}-${date}.${extension}`;
}

/**
 * Format date for filename
 */
export function getDateForFilename(): string {
  return new Date().toISOString().split('T')[0] ?? '';
}
