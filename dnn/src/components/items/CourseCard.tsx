import React from 'react';
import { Clock, BookOpen, Star, LucideIcon } from 'lucide-react';

export interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  price: number;
  originalPrice?: number;
  rating: number;
  studentsEnrolled: number;
  lessons: number;
  duration: string;
  level: string;
  category: string;
  icon: LucideIcon;
}

interface CourseCardProps {
  course: Course;
  onClick: () => void;
}

const CourseCard: React.FC<CourseCardProps> = ({ course, onClick }) => {
  const Icon = course.icon;
  return (
    <div className="group bg-[#1a1d29] border border-[#2d2f36] rounded-xl p-6 flex flex-col hover:border-white transition-all duration-300 hover:-translate-y-1 shadow-lg">
      <div className="flex justify-between items-start mb-6">
        <div className="w-14 h-14 rounded-xl bg-[#2d2f36] flex items-center justify-center group-hover:bg-blue-600 transition-colors duration-300">
          <Icon className="w-7 h-7 text-blue-400 group-hover:text-white" />
        </div>
        <span className="text-[10px] font-bold uppercase tracking-wider bg-[#2d2f36] px-2 py-1 rounded text-gray-400">{course.category}</span>
      </div>
      <h3 className="text-xl font-bold mb-2 line-clamp-1 group-hover:text-blue-400">{course.title}</h3>
      <p className="text-sm text-gray-400 mb-4 line-clamp-2">{course.description}</p>
      <div className="mt-auto flex items-end justify-between">
        <span className="text-2xl font-bold text-white">R{course.price}</span>
        <button onClick={onClick} className="bg-white text-black hover:bg-gray-200 px-4 py-2 rounded text-xs font-bold uppercase tracking-widest transition-colors">Details</button>
      </div>
    </div>
  );
};
export default CourseCard;