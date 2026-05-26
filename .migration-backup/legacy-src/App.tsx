import { Routes, Route, BrowserRouter } from 'react-router-dom';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import Home from './pages/Home';
import Portfolio from './pages/Portfolio';
import Devotions from './pages/Devotions';
import SingleDevotion from './pages/SingleDevotion';
import Music from './pages/Music';
import Podcasts from './pages/Podcasts';
import SinglePodcast from './pages/SinglePodcast';
import Sermons from './pages/Sermons';
import SingleSermon from './pages/SingleSermon';
import News from './pages/News';
import SingleNews from './pages/SingleNews';
import PrayerRequests from './pages/community/PrayerRequests';
import NewPrayerRequest from './pages/community/NewPrayerRequest';
import SinglePrayerRequest from './pages/community/SinglePrayerRequest';
import Radio from './pages/Radio';
import Profile from './pages/Profile';
import Admin from './pages/Admin';
import AdminLogin from './pages/AdminLogin';
import Unauthorized from './pages/Unauthorized';
import AdminRoute from './components/AdminRoute';
import AdminPortfolioUpload from './pages/AdminPortfolioUpload';
import AdminDevotionsCreate from './pages/AdminDevotionsCreate';
import AdminMusicUpload from './pages/AdminMusicUpload';
import AdminPodcastUpload from './pages/AdminPodcastUpload';
import AdminSermonUpload from './pages/AdminSermonUpload';
import AdminNewsUpload from './pages/AdminNewsUpload';
import About from './pages/About';
import DesignSystem from './pages/DesignSystem';
import { PlayerProvider } from './contexts/PlayerContext';
import GlobalMiniPlayer from './components/GlobalMiniPlayer';
import { AuthProvider } from './contexts/AuthContext';

export default function App() {
  return (
    <AuthProvider>
      <PlayerProvider>
        <BrowserRouter>
          <div className="min-h-screen bg-[#0A0A0A] text-white font-sans flex flex-col relative overflow-x-hidden">
            <div className="divine-light-rays"></div>
            <Navigation />
            <main className="flex-1 relative z-10 pb-24">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/design-system" element={<DesignSystem />} />
                <Route path="/portfolio" element={<Portfolio />} />
                <Route path="/devotions" element={<Devotions />} />
                <Route path="/devotions/:id" element={<SingleDevotion />} />
                <Route path="/music" element={<Music />} />
                <Route path="/podcasts" element={<Podcasts />} />
                <Route path="/podcasts/:id" element={<SinglePodcast />} />
                <Route path="/sermons" element={<Sermons />} />
                <Route path="/sermons/:id" element={<SingleSermon />} />
                <Route path="/news" element={<News />} />
                <Route path="/news/:id" element={<SingleNews />} />
                <Route path="/community/prayer-requests" element={<PrayerRequests />} />
                <Route path="/community/prayer-requests/new" element={<NewPrayerRequest />} />
                <Route path="/community/prayer-requests/:id" element={<SinglePrayerRequest />} />
                <Route path="/radio" element={<Radio />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/about" element={<About />} />
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/unauthorized" element={<Unauthorized />} />
                <Route element={<AdminRoute />}>
                  <Route path="/admin/dashboard" element={<Admin />} />
                  <Route path="/admin/portfolio-upload" element={<AdminPortfolioUpload />} />
                  <Route path="/admin/devotions-create" element={<AdminDevotionsCreate />} />
                  <Route path="/admin/music-upload" element={<AdminMusicUpload />} />
                  <Route path="/admin/podcast-upload" element={<AdminPodcastUpload />} />
                  <Route path="/admin/sermons-upload" element={<AdminSermonUpload />} />
                  <Route path="/admin/news-upload" element={<AdminNewsUpload />} />
                  <Route path="/admin" element={<Admin />} />
                </Route>
              </Routes>
            </main>
            <Footer />
            <GlobalMiniPlayer />
          </div>
        </BrowserRouter>
      </PlayerProvider>
    </AuthProvider>
  );
}
