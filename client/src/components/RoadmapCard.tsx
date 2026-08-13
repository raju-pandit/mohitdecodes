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
      className="group flex flex-col p-6 bg-dark-900 border-dark-800 relative overflow-hidden h-full cursor-pointer"
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
        <Badge variant="outline" className="bg-dark-950/50">
          {roadmap.category}
        </Badge>
        <Badge variant={roadmap.difficulty === 'Beginner' ? 'green' : roadmap.difficulty === 'Intermediate' ? 'blue' : 'orange'} className="bg-dark-950/50">
          {roadmap.difficulty}
        </Badge>
      </div>

      <div className="pl-2 flex-grow flex flex-col">
        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-white transition-colors">{roadmap.title}</h3>
        <p className="text-gray-400 text-sm mb-6 flex-grow line-clamp-2">{roadmap.description}</p>

        <div className="flex flex-col gap-3 mb-6 bg-dark-950/50 p-4 rounded-xl border border-dark-800/50">
          <div className="flex items-center justify-between text-sm text-gray-300">
            <span className="flex items-center gap-2"><ListChecks className="w-4 h-4 text-purple-400" /> Milestones</span>
            <span className="font-semibold">{stepsCount} Steps</span>
          </div>
          <div className="w-full bg-dark-800 rounded-full h-1.5">
            <div className="bg-dark-600 h-1.5 rounded-full w-[10%]"></div>
          </div>
          <div className="flex items-center justify-between text-sm text-gray-300 mt-1">
            <span className="flex items-center gap-2"><Clock className="w-4 h-4 text-emerald-400" /> Duration</span>
            <span className="font-semibold">{roadmap.estimatedDuration}</span>
          </div>
        </div>

        <div className="mt-auto">
          <Button 
            variant="ghost" 
            className="w-full justify-between hover:bg-dark-800 text-gray-300 group-hover:text-white border border-transparent group-hover:border-dark-700 cursor-pointer"
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
