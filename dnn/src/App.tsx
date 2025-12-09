import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Hero from './components/Hero';
import FridayBanner from './components/FridayBanner';
import FeaturedArtists from './components/FeaturedArtists';
import Education from './components/Education';
import Events from './components/Events';
import Blog from './components/Blog';
import About from './components/About';
import Contact from './components/Contact';
import MusicUpload from './components/MusicUpload';
import TikTokPage from './components/TikTokPage';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [adminUser, setAdminUser] = useState<string | null>(null);

  useEffect(() => {
    if (currentPage === 'home') {
      const hash = window.location.hash;
      if (hash) {
        const id = hash.replace('#', '');
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      window.scrollTo(0, 0);
    }
  }, [currentPage]);

  const renderContent = () => {
    switch (currentPage) {
      case 'home':
        return (
          <>
            <div id="home"><Hero /></div>
            <FridayBanner onUploadClick={() => setCurrentPage('upload')} />
            <FeaturedArtists />
            <Education />
            <Events />
            <Blog />
            <About />
            <Contact />
          </>
        );
      case 'upload': 
        return <MusicUpload onBackToHome={() => setCurrentPage('home')} />;
      case 'tiktok': 
        return <TikTokPage onBackToHome={() => setCurrentPage('home')} />;
      case 'admin': 
        // FIX: Pass onBackToHome to both Login and Dashboard
        return adminUser ? (
            <AdminDashboard 
                username={adminUser} 
                onLogout={() => setAdminUser(null)} 
                onBackToHome={() => setCurrentPage('home')} 
            />
        ) : (
            <AdminLogin 
                onLogin={setAdminUser} 
                onBackToHome={() => setCurrentPage('home')} 
            />
        );
      default: 
        return <div className="text-white text-center py-20">Page Not Found</div>;
    }
  };

  return <Layout currentPage={currentPage} onNavigate={setCurrentPage}>{renderContent()}</Layout>;
};

export default App;