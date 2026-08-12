import React from 'react';
import { Star, Quote } from 'lucide-react';
import { Card } from './ui/Card';

export interface TestimonialCardProps {
  testimonial: {
    _id?: string;
    id?: string;
    name: string;
    role: string;
    company?: string;
    avatar: string;
    content?: string;
    message?: string;
    rating: number;
  }
}

export const TestimonialCard: React.FC<TestimonialCardProps> = ({ testimonial }) => {
  const contentVal = testimonial.message || testimonial.content || '';
  const companyVal = testimonial.company || 'MohitDecodes';
  const ratingVal = testimonial.rating || 5;

  return (
    <Card className="h-full flex flex-col relative bg-dark-900/40 backdrop-blur-md border-dark-800/60 p-8">
      <Quote className="absolute top-6 right-6 w-10 h-10 text-primary-500/10 rotate-180" />
      
      <div className="flex gap-1 mb-6">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i} 
            className={`w-4 h-4 ${i < ratingVal ? 'text-yellow-500 fill-yellow-500' : 'text-dark-700'}`} 
          />
        ))}
      </div>
      
      <p className="text-slate-300 text-base leading-relaxed mb-8 flex-grow relative z-10 italic">
        "{contentVal}"
      </p>
      
      <div className="flex items-center gap-4 mt-auto">
        <img 
          src={testimonial.avatar || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(testimonial.name)} 
          alt={testimonial.name} 
          className="w-12 h-12 rounded-full border-2 border-dark-700"
        />
        <div>
          <h4 className="text-white font-semibold text-sm">{testimonial.name}</h4>
          <p className="text-slate-500 text-xs mt-0.5">{testimonial.role} {companyVal && `at ${companyVal}`}</p>
        </div>
      </div>
    </Card>
  );
};
