export function generateSlug(params: {
  title?: string;
  location?: string;
  experience?: string;
}): string {
  const { title, location, experience } = params;

  // Sanitize inputs
  const sanitize = (str?: string) =>
    str?.toLowerCase()
       .replace(/[^a-z0-9]+/g, '-')
       .replace(/^-|-$/g, '') ?? '';

  const sanitizedTitle = sanitize(title);
  const sanitizedLocation = sanitize(location);
  const sanitizedExperience = sanitize(experience);

  // Generate appropriate URL based on available params
  if (sanitizedExperience && sanitizedTitle) {
    return `/${sanitizedExperience}-remote-${sanitizedTitle}-jobs`;
  }

  if (sanitizedTitle && sanitizedLocation) {
    return `/remote-${sanitizedTitle}-jobs-in-${sanitizedLocation}`;
  }

  if (sanitizedTitle) {
    return `/remote-${sanitizedTitle}-jobs`;
  }

  if (sanitizedLocation) {
    return `/remote-jobs-in-${sanitizedLocation}`;
  }

  return '/';
}