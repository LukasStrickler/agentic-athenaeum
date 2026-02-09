export type MaterialRequest = {
  sourceText: string;
};

export const normalizeInputText = (value: string): string => {
  const cleaned = value.trim();
  return cleaned.length > 0 ? cleaned : "No source content provided.";
};

export const toMarkdownHeader = (title: string): string => `# ${title}`;
