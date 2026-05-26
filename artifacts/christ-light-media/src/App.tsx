import { Switch, Route, Router as WouterRouter } from 'wouter';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/context/AuthContext';
import { PlayerProvider } from '@/context/PlayerContext';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import GlobalMiniPlayer from '@/components/player/GlobalMiniPlayer';

import HomePage from '@/pages/Home';
import SermonsPage from '@/pages/sermons/index';
import PodcastsPage from '@/pages/podcasts/index';
import MusicPage from '@/pages/music/index';
import RadioPage from '@/pages/radio/index';
import WorshipPage from '@/pages/worship/index';
import DevotionsPage from '@/pages/devotions/index';
import DevotionDatePage from '@/pages/devotions/[date]/index';
import NewsPage from '@/pages/news/index';
import NewsSlugPage from '@/pages/news/[slug]/index';
import NewsArchivePage from '@/pages/news/archive/index';
import CommunityPage from '@/pages/community/index';
import CommunityPrayerPage from '@/pages/community/prayer/index';
import PrayerDetailPage from '@/pages/community/prayer/[id]/index';
import NewPrayerPage from '@/pages/community/prayer/new/index';
import ChatPage from '@/pages/community/chat/index';
import GivePage from '@/pages/give/index';
import MovementPage from '@/pages/movement/index';
import MovementJoinPage from '@/pages/movement/join/index';
import ChallengesPage from '@/pages/movement/challenges/index';
import ChallengeDetailPage from '@/pages/movement/challenges/[slug]/index';
import TestimoniesPage from '@/pages/movement/testimonies/index';
import TestimonyDetailPage from '@/pages/movement/testimonies/[id]/index';
import NewTestimonyPage from '@/pages/movement/testimonies/new/index';
import SchoolPage from '@/pages/school/index';
import ProfilePage from '@/pages/profile/index';
import EditProfilePage from '@/pages/profile/edit/index';
import ProfileSettingsPage from '@/pages/profile/settings/index';
import PrivacyPage from '@/pages/privacy/index';
import TermsPage from '@/pages/terms/index';
import LoginPage from '@/pages/auth/login';
import RegisterPage from '@/pages/auth/register';
import ForgotPasswordPage from '@/pages/auth/forgot-password';
import ResetPasswordPage from '@/pages/auth/reset-password';
import AdminPage from '@/pages/admin/index';
import AdminMediaPage from '@/pages/admin/media/index';
import AdminNewsPage from '@/pages/admin/news/index';
import AdminDevotionsPage from '@/pages/admin/devotions/index';

function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-primary">
      <div className="text-center">
        <h1 className="text-6xl font-cinzel font-bold text-gold mb-4">404</h1>
        <p className="text-text-secondary text-lg mb-8">Page not found</p>
        <a href="/" className="text-gold hover:text-gold-light underline">Go Home</a>
      </div>
    </div>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/sermons" component={SermonsPage} />
      <Route path="/podcasts" component={PodcastsPage} />
      <Route path="/music" component={MusicPage} />
      <Route path="/radio" component={RadioPage} />
      <Route path="/worship" component={WorshipPage} />
      <Route path="/devotions" component={DevotionsPage} />
      <Route path="/devotions/:date" component={DevotionDatePage} />
      <Route path="/news" component={NewsPage} />
      <Route path="/news/archive" component={NewsArchivePage} />
      <Route path="/news/:slug" component={NewsSlugPage} />
      <Route path="/community" component={CommunityPage} />
      <Route path="/community/prayer" component={CommunityPrayerPage} />
      <Route path="/community/prayer/new" component={NewPrayerPage} />
      <Route path="/community/prayer/:id" component={PrayerDetailPage} />
      <Route path="/community/chat" component={ChatPage} />
      <Route path="/give" component={GivePage} />
      <Route path="/movement" component={MovementPage} />
      <Route path="/movement/join" component={MovementJoinPage} />
      <Route path="/movement/challenges" component={ChallengesPage} />
      <Route path="/movement/challenges/:slug" component={ChallengeDetailPage} />
      <Route path="/movement/testimonies" component={TestimoniesPage} />
      <Route path="/movement/testimonies/new" component={NewTestimonyPage} />
      <Route path="/movement/testimonies/:id" component={TestimonyDetailPage} />
      <Route path="/school" component={SchoolPage} />
      <Route path="/school/:courseId/lesson/:lessonId" component={SchoolPage} />
      <Route path="/profile" component={ProfilePage} />
      <Route path="/profile/edit" component={EditProfilePage} />
      <Route path="/profile/settings" component={ProfileSettingsPage} />
      <Route path="/privacy" component={PrivacyPage} />
      <Route path="/terms" component={TermsPage} />
      <Route path="/login" component={LoginPage} />
      <Route path="/register" component={RegisterPage} />
      <Route path="/forgot-password" component={ForgotPasswordPage} />
      <Route path="/reset-password" component={ResetPasswordPage} />
      <Route path="/admin" component={AdminPage} />
      <Route path="/admin/media" component={AdminMediaPage} />
      <Route path="/admin/media/new" component={AdminMediaPage} />
      <Route path="/admin/news" component={AdminNewsPage} />
      <Route path="/admin/news/new" component={AdminNewsPage} />
      <Route path="/admin/news/:slug/edit" component={AdminNewsPage} />
      <Route path="/admin/devotions" component={AdminDevotionsPage} />
      <Route path="/admin/devotions/new" component={AdminDevotionsPage} />
      <Route path="/admin/devotions/:id/edit" component={AdminDevotionsPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <WouterRouter base={import.meta.env.BASE_URL?.replace(/\/$/, '') ?? ''}>
      <AuthProvider>
        <PlayerProvider>
          <Navbar />
          <main className="pb-24">
            <Router />
          </main>
          <Footer />
          <GlobalMiniPlayer />
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: '#1A1A1A',
                color: '#fff',
                border: '1px solid rgba(200,162,74,0.2)',
              },
              success: { iconTheme: { primary: '#C8A24A', secondary: '#0A0A0A' } },
            }}
          />
        </PlayerProvider>
      </AuthProvider>
    </WouterRouter>
  );
}

export default App;
