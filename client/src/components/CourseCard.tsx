import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, BookOpen, Star, Users } from 'lucide-react';
import { Card } from './ui/Card';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';

export interface CourseCardProps {
  course: {
    slug: string;
    title: string;
    description: string;
    shortDescription?: string;
    thumbnail: string;
    category: string;
    difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
    instructor: { name: string; avatar: string };
    rating?: number | { average: number; count: number };
    students: number;
    duration: string;
    lessonsCount?: number;
    modules?: any[];
    price: number;
  }
}

export const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  const difficultyColors = {
    Beginner: 'green',
    Intermediate: 'blue',
    Advanced: 'orange'
  };

  const ratingVal = typeof course.rating === 'number' 
    ? course.rating 
    : (course.rating?.average || 4.8);

  const lessonsCountVal = course.lessonsCount || 
    course.modules?.reduce((acc, m) => acc + (m.lessons?.length || 0), 0) || 
    0;

  return (
    <Card className="group flex flex-col p-0 overflow-hidden bg-dark-900 border-dark-800 h-full">
      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden shrink-0">
        <img 
          src={course.thumbnail} 
          alt={course.title} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-dark-950/20 to-transparent opacity-80"></div>
        
        <div className="absolute top-3 right-3">
          <Badge variant={difficultyColors[course.difficulty] as any} className="bg-dark-950/80 backdrop-blur-md font-semibold tracking-wide border-0 shadow-lg">
            {course.difficulty}
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-grow p-5">
        <div className="mb-2">
          <Badge variant="primary" className="text-[10px] uppercase tracking-wider">{course.category}</Badge>
        </div>
        
        <Link to={`/courses/${course.slug}`}>
          <h3 className="text-xl font-bold text-white mb-2 line-clamp-2 group-hover:text-primary-400 transition-colors">
            {course.title}
          </h3>
        </Link>
        
        <p className="text-gray-400 text-sm mb-4 line-clamp-2">
          {course.shortDescription || course.description}
        </p>

        {/* Meta Stats */}
        <div className="grid grid-cols-2 gap-y-3 mb-6 mt-auto text-sm text-gray-400">
          <div className="flex items-center gap-1.5">
            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
            <span className="text-gray-300 font-medium">{ratingVal.toFixed(1)}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Users className="w-4 h-4 text-blue-400" />
            <span>{course.students.toLocaleString()} students</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-emerald-400" />
            <span>{course.duration}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-purple-400" />
            <span>{lessonsCountVal} lessons</span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-dark-800">
          <div className="flex items-center gap-2">
            <img src={course.instructor.avatar} alt={course.instructor.name} className="w-8 h-8 rounded-full border border-dark-700" />
            <span className="text-sm font-medium text-gray-300">{course.instructor.name}</span>
          </div>
          <div className="text-right">
            {course.price === 0 ? (
              <span className="text-lg font-bold text-green-400">FREE</span>
            ) : (
              <span className="text-lg font-bold text-white">₹{course.price}</span>
            )}
          </div>
        </div>
        
        <Link to={`/courses/${course.slug}`} className="mt-4 block">
          <Button variant="primary" className="w-full">
            View Course
          </Button>
        </Link>
      </div>
    </Card>
  );
};
