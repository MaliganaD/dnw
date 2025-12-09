import React, { useState, useEffect } from 'react';
import { Calendar, User, ArrowRight, Loader2, Newspaper, X } from 'lucide-react';
import { API_ENDPOINTS } from "../config/api";

interface Article {
  id: string;
  title: string;
  author: string;
  category: string;
  date: string;
  excerpt: string;
  content: string; // Added content field
  image?: string;
}

const Blog: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null); // State for modal

  useEffect(() => {
    fetch(API_ENDPOINTS.PUBLIC.ARTICLES)
      .then(res => res.json())
      .then(data => {
        setArticles(data.articles || []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <section id="blog" className="py-20 bg-[#090b13] text-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Latest News & Articles</h2>
            <p className="text-gray-400">Insights from the Dunu Nation community.</p>
        </div>

        {loading ? (
            <div className="flex justify-center p-10"><Loader2 className="w-8 h-8 animate-spin text-blue-500" /></div>
        ) : articles.length === 0 ? (
            <div className="text-center text-gray-500 p-10 bg-[#1a1d29] rounded-xl border border-[#2d2f36]">
                <Newspaper className="w-12 h-12 mx-auto mb-4 opacity-50"/>
                <p>No articles published yet.</p>
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {articles.map((article) => (
                <div key={article.id} className="group bg-[#1a1d29] border border-[#2d2f36] rounded-xl overflow-hidden hover:border-white transition-all duration-300 flex flex-col h-full">
                    {/* Image Area */}
                    <div className="aspect-video relative bg-[#222] overflow-hidden">
                        {article.image ? (
                            <img src={article.image} alt={article.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#1a1d29] to-blue-900/20">
                                <Newspaper className="w-10 h-10 text-gray-600" />
                            </div>
                        )}
                        <div className="absolute top-4 left-4 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                            {article.category || 'News'}
                        </div>
                    </div>

                    <div className="p-6 flex-1 flex flex-col">
                        <div className="flex gap-4 text-xs text-gray-400 mb-3">
                            <span className="flex items-center gap-1"><Calendar className="w-3 h-3"/> {new Date(article.date).toLocaleDateString()}</span>
                            <span className="flex items-center gap-1"><User className="w-3 h-3"/> {article.author}</span>
                        </div>
                        
                        <h3 className="text-xl font-bold mb-3 group-hover:text-blue-400 transition-colors line-clamp-2">{article.title}</h3>
                        <p className="text-sm text-gray-400 mb-6 line-clamp-3 flex-1">{article.excerpt}</p>
                        
                        <button 
                            onClick={() => setSelectedArticle(article)} // FIX: This opens the modal
                            className="text-blue-400 text-sm font-bold uppercase tracking-wider flex items-center gap-2 group/btn"
                        >
                            Read Article <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </div>
            ))}
            </div>
        )}
      </div>

      {/* --- ARTICLE READING MODAL --- */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setSelectedArticle(null)}>
            <div 
                className="bg-[#1a1d29] w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl border border-[#2d2f36] shadow-2xl relative" 
                onClick={e => e.stopPropagation()}
            >
                {/* Close Button */}
                <button 
                    onClick={() => setSelectedArticle(null)}
                    className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-red-600 rounded-full text-white transition-colors z-10"
                >
                    <X className="w-5 h-5" />
                </button>

                {/* Article Image (Header) */}
                {selectedArticle.image && (
                    <div className="w-full h-64 relative">
                        <img src={selectedArticle.image} alt={selectedArticle.title} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#1a1d29] to-transparent"></div>
                    </div>
                )}

                <div className="p-8">
                    {/* Metadata */}
                    <div className="flex gap-4 text-sm text-blue-400 mb-4 font-bold uppercase tracking-wider">
                        <span>{selectedArticle.category}</span>
                        <span className="text-gray-600">•</span>
                        <span>{new Date(selectedArticle.date).toLocaleDateString()}</span>
                    </div>

                    <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white leading-tight">
                        {selectedArticle.title}
                    </h2>

                    <div className="flex items-center gap-3 mb-8 pb-8 border-b border-[#2d2f36]">
                        <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-bold text-white">
                            {selectedArticle.author.charAt(0)}
                        </div>
                        <div>
                            <p className="text-white font-bold text-sm">By {selectedArticle.author}</p>
                            <p className="text-gray-500 text-xs">Author</p>
                        </div>
                    </div>

                    {/* Article Content */}
                    <div className="prose prose-invert max-w-none text-gray-300 leading-relaxed whitespace-pre-wrap">
                        {selectedArticle.content}
                    </div>
                </div>
            </div>
        </div>
      )}
    </section>
  );
};

export default Blog;