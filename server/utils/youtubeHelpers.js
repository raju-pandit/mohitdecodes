import https from 'https';

/**
 * Parses an ISO 8601 duration string (e.g., 'PT1H8M24S', 'PT8M24S', 'PT45S')
 * and returns standard HH:MM:SS or MM:SS format.
 * @param {string} isoDuration
 * @returns {string} e.g. "8:24", "1:12:30", "0:45"
 */
export const formatYouTubeDuration = (isoDuration) => {
  if (!isoDuration || typeof isoDuration !== 'string') return '0:00';

  const match = isoDuration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return '0:00';

  const hours = parseInt(match[1] || '0', 10);
  const minutes = parseInt(match[2] || '0', 10);
  const seconds = parseInt(match[3] || '0', 10);

  const formattedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;

  if (hours > 0) {
    const formattedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
    return `${hours}:${formattedMinutes}:${formattedSeconds}`;
  }

  return `${minutes}:${formattedSeconds}`;
};

/**
 * Formats numbers into compact representations like 15.4K, 2.45M.
 * @param {number|string} num
 * @returns {string}
 */
export const formatNumber = (num) => {
  const n = typeof num === 'string' ? parseFloat(num) : num;
  if (isNaN(n) || n === null || n === undefined) return '0';

  if (n >= 1_000_000_000) {
    return `${(n / 1_000_000_000).toFixed(1).replace(/\.0$/, '')}B`;
  }
  if (n >= 1_000_000) {
    return `${(n / 1_000_000).toFixed(2).replace(/\.00$/, '').replace(/(\.\d)0$/, '$1')}M`;
  }
  if (n >= 1_000) {
    return `${(n / 1_000).toFixed(1).replace(/\.0$/, '')}K`;
  }

  return n.toLocaleString();
};

/**
 * Formats an ISO date string into a relative human-readable timestamp.
 * e.g., "2 hours ago", "3 days ago", "2 weeks ago", "1 month ago"
 * @param {string|Date} dateInput
 * @returns {string}
 */
export const formatRelativeTime = (dateInput) => {
  if (!dateInput) return 'Recently';

  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return 'Recently';

  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return 'Just now';
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} ${diffInMinutes === 1 ? 'minute' : 'minutes'} ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} ${diffInHours === 1 ? 'hour' : 'hours'} ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays} ${diffInDays === 1 ? 'day' : 'days'} ago`;
  }

  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) {
    return `${diffInWeeks} ${diffInWeeks === 1 ? 'week' : 'weeks'} ago`;
  }

  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `${diffInMonths} ${diffInMonths === 1 ? 'month' : 'months'} ago`;
  }

  const diffInYears = Math.floor(diffInDays / 365);
  return `${diffInYears} ${diffInYears === 1 ? 'year' : 'years'} ago`;
};

/**
 * Safe JSON fetch utility supporting global fetch with HTTPS fallback.
 * @param {string} url
 * @param {object} [options]
 * @returns {Promise<any>}
 */
export const fetchJson = async (url, options = {}) => {
  if (typeof globalThis.fetch === 'function') {
    const response = await globalThis.fetch(url, {
      ...options,
      headers: {
        Accept: 'application/json',
        ...(options.headers || {})
      }
    });

    if (!response.ok) {
      const errorBody = await response.text();
      let errorJson;
      try {
        errorJson = JSON.parse(errorBody);
      } catch {
        errorJson = { message: errorBody };
      }
      const err = new Error(errorJson?.error?.message || `HTTP ${response.status}: ${response.statusText}`);
      err.status = response.status;
      err.details = errorJson;
      throw err;
    }

    return await response.json();
  }

  // Fallback to node https module
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        if (res.statusCode < 200 || res.statusCode >= 300) {
          return reject(new Error(`HTTP error ${res.statusCode}: ${data}`));
        }
        try {
          resolve(JSON.parse(data));
        } catch (err) {
          reject(err);
        }
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
};
