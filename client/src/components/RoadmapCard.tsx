import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, ListChecks, ChevronRight } from 'lucide-react';
import { Card } from './ui/Card';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';

export interface RoadmapCardProps {
  roadmap: {
    _id?: string;
    id?: string;
    slug: string;
    title: string;
    description: string;
    category: string;
    difficulty: string;
    color?: string;
    estimatedDuration: string;
    stepCount?: number;
    steps?: any[];
  }
}

export const RoadmapCard: React.FC<RoadmapCardProps> = ({ roadmap }) => {
  const navigate = useNavigate();
  const stepsCount = roadmap.stepCount || roadmap.steps?.length || 0;
  const roadmapColor = roadmap.color || '#7c3aed';

  return (
    <Card 
      onClick={() => navigate(`/roadmaps/${roadmap.slug}`)}
      className="group flex flex-col p-6 bg-white dark:bg-dark-900 border-slate-200/90 dark:border-dark-800 shadow-sm hover:shadow-xl dark:shadow-none relative overflow-hidden h-full cursor-pointer transition-all duration-300"
    >
      {/* Decorative colored line */}
      <div 
        className="absolute left-0 top-0 bottom-0 w-1.5 transition-all duration-300 group-hover:w-2"
        style={{ backgroundColor: roadmapColor }}
      ></div>
      
      {/* Glow effect on hover */}
      <div 
        className="absolute -right-20 -top-20 w-40 h-40 rounded-full opacity-0 group-hover:opacity-10 blur-3xl transition-opacity duration-500 pointer-events-none"
        style={{ backgroundColor: roadmapColor }}
      ></div>

      <div className="flex justify-between items-start mb-4 relative z-10 pl-2">
        <Badge variant="outline" className="bg-slate-100 dark:bg-dark-950/50 text-slate-700 dark:text-slate-300 font-semibold border-slate-200 dark:border-white/10">
          {roadmap.category}
        </Badge>
        <Badge variant={roadmap.difficulty === 'Beginner' ? 'green' : roadmap.difficulty === 'Intermediate' ? 'blue' : 'orange'} className="bg-slate-100 dark:bg-dark-950/50 font-semibold">
          {roadmap.difficulty}
        </Badge>
      </div>

      <div className="pl-2 flex-grow flex flex-col">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-purple-600 dark:group-hover:text-white transition-colors">{roadmap.title}</h3>
        <p className="text-slate-600 dark:text-gray-400 text-sm mb-6 flex-grow line-clamp-2 leading-relaxed">{roadmap.description}</p>

        <div className="flex flex-col gap-3 mb-6 bg-slate-50 dark:bg-dark-950/50 p-4 rounded-xl border border-slate-200/70 dark:border-dark-800/50">
          <div className="flex items-center justify-between text-sm text-slate-700 dark:text-gray-300 font-medium">
            <span className="flex items-center gap-2"><ListChecks className="w-4 h-4 text-purple-600 dark:text-purple-400" /> Milestones</span>
            <span className="font-bold text-slate-900 dark:text-white">{stepsCount} Steps</span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-dark-800 rounded-full h-1.5">
            <div className="bg-purple-600 dark:bg-dark-600 h-1.5 rounded-full w-[10%]"></div>
          </div>
          <div className="flex items-center justify-between text-sm text-slate-700 dark:text-gray-300 font-medium mt-1">
            <span className="flex items-center gap-2"><Clock className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> Duration</span>
            <span className="font-bold text-slate-900 dark:text-white">{roadmap.estimatedDuration}</span>
          </div>
        </div>

        <div className="mt-auto">
          <Button 
            variant="ghost" 
            className="w-full justify-between bg-slate-100 hover:bg-purple-50 dark:bg-transparent dark:hover:bg-dark-800 text-slate-800 dark:text-gray-300 hover:text-purple-700 dark:hover:text-white border border-slate-200/80 dark:border-transparent group-hover:border-purple-300 dark:group-hover:border-dark-700 cursor-pointer font-semibold"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/roadmaps/${roadmap.slug}`);
            }}
          >
            Start Journey
            <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </Card>
  );
};
