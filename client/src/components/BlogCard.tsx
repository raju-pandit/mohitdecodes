import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Calendar, ArrowRight } from 'lucide-react';
import { Card } from './ui/Card';
import { Badge } from './ui/Badge';

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
  const dateVal = blog.publishedAt || blog.createdAt || new Date().toISOString();
  const readTimeVal = blog.readTime || 
    (typeof blog.readingTime === 'number' ? `${blog.readingTime} min` : blog.readingTime) || 
    '5 min';
  const tagsVal = blog.tags || [];

  return (
    <Card className="group flex flex-col p-0 overflow-hidden bg-dark-900 border-dark-800 h-full">
      <Link to={`/blogs/${blog.slug}`} className="block relative aspect-[16/9] overflow-hidden shrink-0">
        <img 
          src={blog.coverImage} 
          alt={blog.title} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute top-4 left-4">
          <Badge variant="blue" className="bg-dark-950/80 backdrop-blur-md shadow-lg border-0 font-medium">
            {blog.category}
          </Badge>
        </div>
      </Link>

      <div className="flex flex-col flex-grow p-6">
        <Link to={`/blogs/${blog.slug}`}>
          <h3 className="text-xl font-bold text-white mb-3 line-clamp-2 group-hover:text-primary-400 transition-colors">
            {blog.title}
          </h3>
        </Link>
        
        <p className="text-gray-400 text-sm mb-5 line-clamp-2 flex-grow">
          {blog.excerpt}
        </p>
        
        {tagsVal.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {tagsVal.slice(0, 3).map(tag => (
              <span key={tag} className="text-xs text-gray-400 bg-dark-800 px-2 py-1 rounded-md">
                #{tag}
              </span>
            ))}
          </div>
        )}

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-5 border-t border-dark-800 mt-auto">
          <div className="flex items-center gap-3">
            <img src={blog.author?.avatar} alt={blog.author?.name} className="w-10 h-10 rounded-full border border-dark-700" />
            <div>
              <p className="text-sm font-medium text-gray-200">{blog.author?.name}</p>
              <div className="flex items-center gap-3 text-xs text-gray-500 mt-0.5">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {new Date(dateVal).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {readTimeVal}
                </span>
              </div>
            </div>
          </div>
          
          <Link to={`/blogs/${blog.slug}`} className="hidden sm:flex items-center justify-center w-10 h-10 rounded-full bg-dark-800 text-gray-400 group-hover:bg-primary-600 group-hover:text-white transition-all">
            <ArrowRight className="w-5 h-5 -rotate-45 group-hover:rotate-0 transition-transform duration-300" />
          </Link>
        </div>
      </div>
    </Card>
  );
};
