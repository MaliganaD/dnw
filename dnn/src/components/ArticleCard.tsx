import React from 'react';
import { Calendar, User, ChevronRight } from 'lucide-react';

export interface Article {
  id: number;
  title: string;
  author: string;
  date: string;
  category: string;
  excerpt: string;
  content: string;
  image: string;
}

interface ArticleCardProps {
  article: Article;
  onClick: () => void;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article, onClick }) => (
  <div onClick={onClick} className="group bg-[#1a1d29] border border-[#2d2f36] rounded-xl overflow-hidden cursor-pointer shadow-lg hover:border-white transition-all duration-300">
    <div className="aspect-video overflow-hidden relative">
      <img src={article.image} alt={article.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#1a1d29] to-transparent opacity-80"></div>
      <div className="absolute bottom-4 left-4">
         <span className="bg-blue-600 text-white text-[10px] font-bold uppercase px-2 py-1 rounded">{article.category}</span>
      </div>
    </div>
    <div className="p-6">
      <h3 className="text-xl font-bold mb-3 line-clamp-2 group-hover:text-blue-400">{article.title}</h3>
      <p className="text-sm text-gray-400 mb-4 line-clamp-2">{article.excerpt}</p>
      <div className="flex items-center justify-between border-t border-[#2d2f36] pt-4 mt-auto">
        <div className="flex items-center gap-2 text-xs font-medium text-gray-300">
          <User className="w-3 h-3 text-blue-400" />
          <span>{article.author}</span>
        </div>
        <div className="flex items-center gap-1 text-xs font-bold text-blue-400 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
          Read <ChevronRight className="w-3 h-3" />
        </div>
      </div>
    </div>
  </div>
);

export default ArticleCard;