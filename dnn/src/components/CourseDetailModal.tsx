import React from "react";
import { X, Star, Clock, BookOpen, Award, Users, CheckCircle2, Play } from "lucide-react";

export function CourseDetailModal({ course, onClose }) {
  if (!course) return null;

  const discount = course.originalPrice 
    ? Math.round(((course.originalPrice - course.price) / course.originalPrice) * 100)
    : 0;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
      
      {/* Modal Container */}
      <div className="bg-[#1a1d29] border border-[#2d2f36] rounded-2xl shadow-2xl w-full max-w-4xl my-8 relative flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header Section */}
        <div className="relative bg-gradient-to-r from-blue-900 to-[#1a1d29] p-8 border-b border-[#2d2f36]">
          
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-black/30 hover:bg-white/20 rounded-full text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="space-y-4">
            <span className="inline-block bg-blue-500/20 border border-blue-400/30 text-blue-200 text-xs font-bold uppercase px-3 py-1 rounded">
                {course.category}
            </span>
            
            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
                {course.title}
            </h2>
            
            <p className="text-gray-300 text-lg leading-relaxed max-w-2xl">
                {course.description}
            </p>
            
            {/* Meta Data Row 1 */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-300">
              <div className="flex items-center gap-1.5">
                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                <span className="font-bold text-white">{course.rating}</span>
                <span className="text-gray-400">({course.studentsEnrolled.toLocaleString()} students)</span>
              </div>
              <div>
                Created by <span className="font-semibold text-white">{course.instructor}</span>
              </div>
            </div>

            {/* Meta Data Row 2 */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-400">
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                <span>Last updated {course.lastUpdated}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <BookOpen className="w-4 h-4" />
                <span>{course.language}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-8 bg-[#090b13]">
          <div className="grid md:grid-cols-3 gap-8">
            
            {/* --- LEFT COLUMN (Details) --- */}
            <div className="md:col-span-2 space-y-8">
              
              {/* Learning Outcomes */}
              <div>
                <h3 className="text-xl font-bold text-white mb-4">What you'll learn</h3>
                <div className="bg-[#1a1d29] border border-[#2d2f36] rounded-xl p-6">
                  <div className="grid sm:grid-cols-2 gap-4">
                    {course.learningOutcomes.map((outcome, index) => (
                      <div key={index} className="flex gap-3 items-start">
                        <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-300">{outcome}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Course Content */}
              <div>
                <h3 className="text-xl font-bold text-white mb-4">Course Content</h3>
                <div className="space-y-3">
                  {course.courseContent.map((section, index) => (
                    <div key={index} className="bg-[#1a1d29] border border-[#2d2f36] rounded-lg p-4 hover:border-gray-500 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-8 h-8 rounded-full bg-[#090b13] flex items-center justify-center text-blue-400">
                             <Play className="w-4 h-4 fill-current" />
                          </div>
                          <div>
                            <div className="font-medium text-white">{section.title}</div>
                            <div className="text-xs text-gray-500 mt-0.5">
                              {section.lessons} lessons • {section.duration}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Requirements */}
              <div>
                <h3 className="text-xl font-bold text-white mb-4">Requirements</h3>
                <ul className="space-y-2">
                  {course.requirements.map((req, index) => (
                    <li key={index} className="flex gap-3 text-gray-400">
                      <span className="text-blue-500">•</span>
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* --- RIGHT COLUMN (Pricing Card) --- */}
            <div>
                <div className="bg-[#1a1d29] border border-[#2d2f36] rounded-xl p-6 sticky top-4">
                    <div className="mb-6">
                        <div className="flex items-end gap-3 mb-1">
                            <span className="text-3xl font-bold text-white">R{course.price}</span>
                            {course.originalPrice && (
                                <span className="text-lg text-gray-500 line-through mb-1">R{course.originalPrice}</span>
                            )}
                        </div>
                        {discount > 0 && (
                            <span className="inline-block bg-green-900 text-green-400 text-xs font-bold px-2 py-1 rounded">
                                {discount}% OFF
                            </span>
                        )}
                    </div>

                    <div className="space-y-3">
                        <button className="w-full bg-white text-black hover:bg-gray-200 font-bold py-3 rounded uppercase tracking-widest text-sm transition-colors">
                            Enroll Now
                        </button>
                        <button className="w-full bg-transparent border border-gray-600 text-white hover:border-white font-bold py-3 rounded uppercase tracking-widest text-sm transition-colors">
                            Add to Cart
                        </button>
                    </div>

                    <div className="mt-6 pt-6 border-t border-[#2d2f36] space-y-4">
                        <p className="text-sm font-bold text-white mb-2">This course includes:</p>
                        
                        <div className="flex items-center gap-3 text-sm text-gray-400">
                            <Clock className="w-4 h-4 text-blue-400" />
                            <span>{course.duration} on-demand video</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-gray-400">
                            <BookOpen className="w-4 h-4 text-blue-400" />
                            <span>{course.lessons} downloadable resources</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-gray-400">
                            <Users className="w-4 h-4 text-blue-400" />
                            <span>Full lifetime access</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-gray-400">
                            <Award className="w-4 h-4 text-blue-400" />
                            <span>Certificate of completion</span>
                        </div>
                    </div>
                </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default CourseDetailModal;