interface SlugParams {
    title?: string;
    location?: string;
    experience?: string;
    keywords?: string;
}

export function generateSlug(params: SlugParams): string {
    const { title, location, experience, keywords } = params;
    let segments: string[] = [];

    // Add experience level if present
    if (experience && experience !== 'any') {
        segments.push(experience);
    }

    // Add "remote"
    segments.push('remote');

    // Add title if present
    if (title) {
        segments.push(title);
    }

    // Add "jobs" segment
    segments.push('jobs');

    // Add location if present
    if (location) {
        segments.push('in');
        segments.push(location);
    }

    // Create the base path
    let path = '/' + segments.join('-');

    // Add keywords as query parameter if present
    if (keywords && keywords.trim()) {
        path += `?q=${encodeURIComponent(keywords.trim())}`;
    }

    return path;
}