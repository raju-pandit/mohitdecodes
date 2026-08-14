export interface User {
  _id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'user' | 'admin';
  googleId?: string;
  provider?: 'local' | 'google';
  profilePicture?: string;
  enrolledCourses: any[];
  savedBlogs: any[];
  learningStreak: number;
  completedLessons?: string[];
  roadmapProgress?: any[];
}

export interface Course {
  _id: string;
  title: string;
  slug: string;
  description: string;
  shortDescription: string;
  thumbnail: string;
  instructor: { name: string; avatar: string; bio: string };
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  price: number;
  isFree: boolean;
  duration: string;
  modules: any[];
  students: number;
  rating: { average: number; count: number };
  tags: string[];
  isPublished: boolean;
  featured: boolean;
  totalLessons: number;
}

export interface Blog {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  author: { name: string; avatar: string; bio: string };
  category: string;
  tags: string[];
  views: number;
  readingTime: number;
  published: boolean;
  createdAt: string;
}

export interface Tutorial {
  _id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  category: string;
  difficulty: string;
  readingTime: number;
  author: { name: string; avatar: string };
  tags: string[];
  views: number;
  published: boolean;
  createdAt: string;
}

export interface Resource {
  _id: string;
  title: string;
  description: string;
  category: string;
  fileUrl: string;
  fileType: string;
  fileSize: string;
  downloads: number;
}

export interface Project {
  _id: string;
  title: string;
  slug: string;
  description: string;
  image: string;
  technologies: string[];
  githubUrl: string;
  liveUrl: string;
  difficulty: string;
  category: string;
  featured: boolean;
}

export interface RoadmapStep {
  _id: string;
  title: string;
  description: string;
  order: number;
  resources: any[];
  isOptional: boolean;
}

export interface Roadmap {
  _id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  difficulty: string;
  estimatedDuration: string;
  steps: RoadmapStep[];
  color: string;
}

export interface Testimonial {
  _id: string;
  name: string;
  avatar: string;
  role: string;
  rating: number;
  message: string;
}

export interface Pagination {
  total: number;
  page: number;
  pages: number;
  limit: number;
}

export interface TopmateCard {
  _id: string;
  image?: string;
  category?: string;
  title: string;
  description: string;
  badge?: string;
  buttonText?: string;
  url: string;
  status: 'active' | 'inactive';
  displayOrder: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  pagination?: Pagination;
}
