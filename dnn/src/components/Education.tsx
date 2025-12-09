import React, { useState, useEffect } from "react";
import { GraduationCap, ArrowRight } from "lucide-react";
import { API_ENDPOINTS } from "../config/api";

const Education: React.FC = () => {
  const [courses, setCourses] = useState<any[]>([]);

  useEffect(() => {
    fetch(API_ENDPOINTS.PUBLIC.COURSES)
        .then(res => res.json())
        .then(data => setCourses(data.courses || []))
        .catch(err => console.error(err));
  }, []);

  return (
    <section id="education" className="py-20 bg-[#090b13] text-white">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold mb-10 text-center">Music Education</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course) => (
            <div key={course.id} className="group bg-[#1a1d29] border border-[#2d2f36] rounded-xl p-6 flex flex-col hover:border-white transition-all duration-300">
              <div className="mb-4">
                  <h3 className="text-xl font-bold mb-2 group-hover:text-blue-400">{course.title}</h3>
                  <p className="text-sm text-gray-400">Instructor: {course.instructor}</p>
                  <p className="text-xs text-blue-500 uppercase mt-1">{course.category}</p>
              </div>
              <div className="mt-auto flex items-end justify-between">
                  <span className="text-2xl font-bold">R{course.price}</span>
                  <button onClick={() => window.open(course.link, '_blank')} className="bg-white text-black px-4 py-2 rounded text-xs font-bold uppercase flex gap-2 items-center hover:bg-gray-200">
                      Details <ArrowRight className="w-3 h-3"/>
                  </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
export default Education;