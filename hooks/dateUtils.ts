export function getTimeAgo(timestamp: string | Date | null): string {
  if (!timestamp) return 'Recently';

  try {
    const now = new Date();
    // Handle both Date objects and ISO strings
    const past = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;

    // Check if date is valid
    if (isNaN(past.getTime())) {
      return 'Recently';
    }

    const msPerMinute = 60 * 1000;
    const msPerHour = msPerMinute * 60;
    const msPerDay = msPerHour * 24;
    const msPerMonth = msPerDay * 30;
    const msPerYear = msPerDay * 365;

    const elapsed = now.getTime() - past.getTime();

    if (elapsed < msPerMinute) {
      return 'Just now';
    } else if (elapsed < msPerHour) {
      const minutes = Math.floor(elapsed/msPerMinute);
      return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
    } else if (elapsed < msPerDay ) {
      const hours = Math.floor(elapsed/msPerHour);
      return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
    } else if (elapsed < msPerMonth) {
      const days = Math.floor(elapsed/msPerDay);
      return `${days} ${days === 1 ? 'day' : 'days'} ago`;
    } else if (elapsed < msPerYear) {
      const months = Math.floor(elapsed/msPerMonth);
      return `${months} ${months === 1 ? 'month' : 'months'} ago`;
    } else {
      const years = Math.floor(elapsed/msPerYear);
      return `${years} ${years === 1 ? 'year' : 'years'} ago`;
    }
  } catch (error) {
    console.error('Error parsing date:', error);
    return 'Recently';
  }
}