export const createTitleSearchPattern = (searchTerm: string): string => {
  // Split search terms and remove empty strings
  const terms = searchTerm
    .toLowerCase()
    .split(/\s+/)
    .filter(term => term.length > 0)
    // Escape special characters that might be in the search term
    .map(term => term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));

  // Create individual patterns for each term
  return terms.map(term => `(title.ilike.%${term}%)`).join(',');
};