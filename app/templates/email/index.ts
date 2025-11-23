type EmailRecipients = {
  to: string;
  bcc?: string;
};

export const createMailtoLink = <T extends Record<string, string>>(
  lang: keyof T,
  {
    recipients,
    template: _template,
    subject,
  }: {
    recipients: EmailRecipients;
    template: T;
    subject: string;
  }
) => {
  const template =
    _template[lang] ??
    // Common fallback for Serbian locale variants
    (_template["sr-Latn" as keyof T] as string | undefined) ??
    // Last resort: first available template string
    Object.values(_template)[0];

  return `mailto:${recipients.to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(
    template
  )}${recipients.bcc ? `&bcc=${recipients.bcc}` : ""}`;
};
