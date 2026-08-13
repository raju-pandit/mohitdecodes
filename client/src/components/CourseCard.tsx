import React from 'react';
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();
  const difficultyColors = {
    Beginner: 'green',
    Intermediate: 'blue',
    Advanced: 'orange'
  };

  const lessonsCountVal = course.lessonsCount || 
    course.modules?.reduce((acc, m) => acc + (m.lessons?.length || 0), 0) || 
    0;

  return (
    <Card 
      onClick={() => navigate(`/courses/${course.slug}`)}
      className="group flex flex-col p-0 overflow-hidden bg-dark-900 border-dark-800 h-full cursor-pointer"
    >
      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden shrink-0">
        <img 
          src={course.thumbnail} 
          alt={course.title} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-3 left-3">
          <Badge variant={(difficultyColors as any)[course.difficulty] || 'purple'}>
            {course.difficulty}
          </Badge>
        </div>
        <div className="absolute top-3 right-3">
          <Badge variant="purple" className="bg-dark-950/80 backdrop-blur-md">
            {course.category}
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-grow p-5 sm:p-6">
        <h3 className="text-lg sm:text-xl font-bold text-white mb-2 line-clamp-1 group-hover:text-purple-400 transition-colors">
          {course.title}
        </h3>
        
        <p className="text-gray-400 text-sm mb-4 line-clamp-2 flex-grow">
          {course.shortDescription || course.description}
        </p>

        {/* Course Meta */}
        <div className="grid grid-cols-2 gap-2 text-xs text-gray-400 mb-4 py-3 border-y border-dark-800">
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-purple-400" />
            <span>{course.duration}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-purple-400" />
            <span>{lessonsCountVal} lessons</span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2">
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
        
        <div className="mt-4">
          <Button 
            variant="primary" 
            className="w-full cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/courses/${course.slug}`);
            }}
          >
            View Course
          </Button>
        </div>
      </div>
    </Card>
  );
};
