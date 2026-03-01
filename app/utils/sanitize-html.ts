/**
 * Sanitize HTML to prevent XSS attacks while preserving safe formatting.
 * Allows only: b, strong, i, em, u, span, mark
 */

const ALLOWED_TAGS = ['b', 'strong', 'i', 'em', 'u', 'span', 'mark'];
const ALLOWED_ATTRIBUTES: Record<string, string[]> = {
  span: ['class', 'style'],
  mark: ['class'],
};

// Regex patterns for validation
const DANGEROUS_PATTERNS = [
  /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
  /javascript:/gi,
  /on\w+\s*=/gi,
  /data:/gi,
  /vbscript:/gi,
];

export function sanitizeHtml(html: string | null | undefined): string {
  if (!html) return '';

  let sanitized = html;

  // Remove dangerous patterns
  for (const pattern of DANGEROUS_PATTERNS) {
    sanitized = sanitized.replace(pattern, '');
  }

  // Create a temporary element to parse HTML
  if (typeof document !== 'undefined') {
    const temp = document.createElement('div');
    temp.innerHTML = sanitized;

    // Remove disallowed tags
    const allElements = temp.querySelectorAll('*');
    allElements.forEach((el) => {
      const tagName = el.tagName.toLowerCase();

      if (!ALLOWED_TAGS.includes(tagName)) {
        // Replace with text content
        const text = document.createTextNode(el.textContent || '');
        el.parentNode?.replaceChild(text, el);
      } else {
        // Remove disallowed attributes
        const allowed = ALLOWED_ATTRIBUTES[tagName] || [];
        Array.from(el.attributes).forEach((attr) => {
          if (!allowed.includes(attr.name)) {
            el.removeAttribute(attr.name);
          }
        });
      }
    });

    return temp.innerHTML;
  }

  // Server-side: simple tag stripping (only allow safe tags)
  return sanitized.replace(/<(\/?)(\w+)[^>]*>/g, (_match, closing, tagName) => {
    if (ALLOWED_TAGS.includes(tagName.toLowerCase())) {
      return `<${closing}${tagName.toLowerCase()}>`;
    }
    return '';
  });
}

/**
 * Check if HTML contains potentially dangerous content
 */
export function containsDangerousHtml(html: string): boolean {
  return DANGEROUS_PATTERNS.some((pattern) => pattern.test(html));
}
