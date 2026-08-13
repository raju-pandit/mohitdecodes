import React from 'react';
import { ExternalLink, Github, Layers } from 'lucide-react';
import { Card } from './ui/Card';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';

export interface ProjectCardProps {
  project: {
    _id?: string;
    id?: string;
    title: string;
    description: string;
    image: string;
    difficulty: string;
    techStack?: string[];
    technologies?: string[];
    githubUrl?: string;
    liveUrl?: string;
    category?: string;
  }
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const difficultyColors = {
    Beginner: 'green',
    Intermediate: 'blue',
    Advanced: 'orange'
  };

  const difficultyVal = project.difficulty || 'Beginner';
  const badgeColor = (difficultyColors as any)[difficultyVal] || 'outline';
  
  const techStackVal = project.technologies || project.techStack || [];

  return (
    <Card className="group flex flex-col p-0 overflow-hidden bg-white dark:bg-dark-900 border-slate-200/90 dark:border-dark-800 shadow-sm hover:shadow-xl dark:shadow-none h-full transition-all duration-300">
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100 dark:bg-dark-950 p-6 flex items-center justify-center shrink-0 border-b border-slate-100 dark:border-dark-800">
        <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/5 dark:from-primary-900/20 to-transparent z-0"></div>
        {project.image && (
          <img 
            src={project.image} 
            alt={project.title} 
            className="relative z-10 w-full h-full object-contain filter drop-shadow-md dark:drop-shadow-2xl transition-transform duration-500 group-hover:scale-105 group-hover:-translate-y-2"
          />
        )}
        <div className="absolute top-4 left-4 z-20">
          <Badge variant={badgeColor} className="bg-white/90 dark:bg-dark-950/95 backdrop-blur-sm border border-slate-200/50 dark:border-0 font-semibold shadow-sm">
            {difficultyVal}
          </Badge>
        </div>
      </div>

      <div className="flex flex-col flex-grow p-6">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">{project.title}</h3>
        <p className="text-slate-600 dark:text-gray-400 text-sm mb-6 line-clamp-2 flex-grow leading-relaxed">{project.description}</p>
        
        {techStackVal.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3 text-xs font-bold text-slate-500 uppercase tracking-wider">
              <Layers className="w-3 h-3 text-purple-600 dark:text-purple-400" /> Tech Stack
            </div>
            <div className="flex flex-wrap gap-2">
              {techStackVal.slice(0, 4).map(tech => (
                <span key={tech} className="px-2.5 py-1 text-xs font-semibold bg-slate-100 dark:bg-dark-800 text-slate-700 dark:text-gray-300 rounded-md border border-slate-200/80 dark:border-dark-700">
                  {tech}
                </span>
              ))}
              {techStackVal.length > 4 && (
                <span className="px-2.5 py-1 text-xs font-semibold bg-slate-100 dark:bg-dark-800 text-slate-500 dark:text-gray-400 rounded-md border border-slate-200/80 dark:border-dark-700">
                  +{techStackVal.length - 4}
                </span>
              )}
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3 mt-auto">
          {project.githubUrl && (
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full gap-2 text-slate-700 dark:text-gray-300 hover:text-purple-600 cursor-pointer font-semibold"
              onClick={() => window.open(project.githubUrl, '_blank', 'noopener,noreferrer')}
            >
              <Github className="w-4 h-4" /> Code
            </Button>
          )}
          {project.liveUrl && (
            <Button 
              variant="primary" 
              size="sm" 
              className="w-full gap-2 cursor-pointer font-semibold"
              onClick={() => window.open(project.liveUrl, '_blank', 'noopener,noreferrer')}
            >
              <ExternalLink className="w-4 h-4" /> Demo
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};
