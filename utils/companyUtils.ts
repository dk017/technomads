export const normalizeCompanyName = (name: string): string => {
  return name
    .toLowerCase()
    // Remove special characters and extra spaces
    .replace(/[^\w\s-]/g, '')
    // Replace multiple spaces with single space
    .replace(/\s+/g, ' ')
    // Trim spaces
    .trim();
};

export const createCompanySlug = (name: string): string => {
  return name
    .toLowerCase()
    // Remove special characters and replace with space
    .replace(/[^\w\s-]/g, ' ')
    // Replace multiple spaces with single space
    .replace(/\s+/g, ' ')
    // Trim spaces
    .trim()
    // Replace spaces with hyphens
    .replace(/\s/g, '-')
    // Remove any remaining unwanted characters
    .replace(/[^a-z0-9-]/g, '');
};