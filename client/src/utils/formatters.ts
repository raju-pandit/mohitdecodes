export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
};

export const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M+';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K+';
  }
  return num.toString();
};

export const getDifficultyColor = (difficulty: string): string => {
  switch (difficulty.toLowerCase()) {
    case 'beginner':
      return 'badge-green';
    case 'intermediate':
      return 'badge-blue';
    case 'advanced':
      return 'badge-red';
    default:
      return 'badge-primary';
  }
};

export const getCategoryColor = (category: string): string => {
  switch (category.toLowerCase()) {
    case 'frontend':
      return 'badge-blue';
    case 'backend':
      return 'badge-green';
    case 'fullstack':
      return 'badge-primary';
    case 'devops':
      return 'badge-orange';
    default:
      return 'badge-primary';
  }
};

export const truncateText = (text: string, maxLength: number): string => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

export const getInitials = (name: string): string => {
  if (!name) return '';
  const names = name.trim().split(/\s+/);
  let initials = names[0].charAt(0).toUpperCase();
  if (names.length > 1) {
    initials += names[names.length - 1].charAt(0).toUpperCase();
  }
  return initials;
};

export const hasCustomAvatar = (avatarUrl: string | undefined | null): boolean => {
  if (!avatarUrl) return false;
  return !avatarUrl.includes('ui-avatars.com');
};
