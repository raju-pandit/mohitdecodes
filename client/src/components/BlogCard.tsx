import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, Calendar, ArrowRight } from 'lucide-react';
import { Card } from './ui/Card';
import { Badge } from './ui/Badge';
import { formatDate } from '../utils/formatters';

export interface BlogCardProps {
  blog: {
    slug: string;
    title: string;
    excerpt: string;
    coverImage: string;
    category: string;
    author: { name: string; avatar: string };
    publishedAt?: string;
    createdAt?: string;
    readTime?: string;
    readingTime?: string | number;
    tags?: string[];
  }
}

export const BlogCard: React.FC<BlogCardProps> = ({ blog }) => {
  const navigate = useNavigate();
  const dateVal = blog.publishedAt || blog.createdAt || new Date().toISOString();
  const readTimeVal = blog.readTime || 
    (typeof blog.readingTime === 'number' ? `${blog.readingTime} min` : blog.readingTime) || 
    '5 min';
  const tagsVal = blog.tags || [];

  return (
    <Card 
      onClick={() => navigate(`/blogs/${blog.slug}`)}
      className="group flex flex-col p-0 overflow-hidden bg-white dark:bg-dark-900 border-slate-200/90 dark:border-dark-800 shadow-sm hover:shadow-xl dark:shadow-none h-full cursor-pointer transition-all duration-300"
    >
      <div className="block relative aspect-[16/9] overflow-hidden shrink-0">
        <img 
          src={blog.coverImage} 
          alt={blog.title} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute top-4 left-4">
          <Badge variant="blue" className="bg-white/90 dark:bg-dark-950/80 text-blue-700 dark:text-blue-300 backdrop-blur-md shadow-sm border border-slate-200/50 dark:border-0 font-medium">
            {blog.category}
          </Badge>
        </div>
      </div>

      <div className="flex flex-col flex-grow p-6">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 line-clamp-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
          {blog.title}
        </h3>
        
        <p className="text-slate-600 dark:text-gray-400 text-sm mb-5 line-clamp-2 flex-grow leading-relaxed">
          {blog.excerpt}
        </p>
        
        {tagsVal.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {tagsVal.slice(0, 3).map(tag => (
              <span key={tag} className="text-xs text-slate-600 dark:text-gray-400 bg-slate-100 dark:bg-dark-800 px-2.5 py-1 rounded-md border border-slate-200/60 dark:border-transparent font-medium">
                #{tag}
              </span>
            ))}
          </div>
        )}

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-5 border-t border-slate-100 dark:border-dark-800 mt-auto">
          <div className="flex items-center gap-3">
            <img src={blog.author?.avatar} alt={blog.author?.name} className="w-10 h-10 rounded-full border border-slate-200 dark:border-dark-700 object-cover" />
            <div>
              <p className="text-sm font-semibold text-slate-800 dark:text-gray-200">{blog.author?.name}</p>
              <div className="flex items-center gap-3 text-xs text-slate-500 mt-0.5 font-medium">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {formatDate(dateVal)}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {readTimeVal}
                </span>
              </div>
            </div>
          </div>
          
          <div className="hidden sm:flex items-center justify-center w-10 h-10 rounded-full bg-slate-100 dark:bg-dark-800 text-slate-600 dark:text-gray-400 group-hover:bg-purple-600 group-hover:text-white transition-all shadow-xs">
            <ArrowRight className="w-5 h-5 -rotate-45 group-hover:rotate-0 transition-transform duration-300" />
          </div>
        </div>
      </div>
    </Card>
  );
};
