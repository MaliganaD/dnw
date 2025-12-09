import React, { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";

interface LayoutProps { children: ReactNode; currentPage: string; onNavigate: (page: string) => void; }

const Layout: React.FC<LayoutProps> = ({ children, currentPage, onNavigate }) => {
  const isAdminRoute = ['admin', 'upload', 'tiktok'].includes(currentPage);
  return (
    <div className="min-h-screen w-full bg-gray-50 text-gray-900 dark:bg-[#090b13] dark:text-white flex flex-col font-sans overflow-x-hidden transition-colors duration-300">
      {!isAdminRoute && <Header onNavigate={onNavigate} currentPage={currentPage} />}
      <main className="flex-1 w-full relative z-0 flex flex-col">{children}</main>
      {!isAdminRoute && <Footer />}
    </div>
  );
};
export default Layout;