import { useState, FormEvent } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db, storage, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import AdminModeration from './AdminModeration';
import { LayoutDashboard, Image as ImageIcon, BookOpen, Music as MusicIcon, Upload, Loader2, FileUp, Mic, Video, Newspaper, Radio as RadioIcon, Headphones, User, ShieldAlert } from 'lucide-react';
import { Navigate, Link } from 'react-router-dom';

const TABS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'moderation', label: 'Moderation', icon: ShieldAlert },
  { id: 'portfolio', label: 'Upload Portfolio', icon: ImageIcon },
  { id: 'devotion', label: 'Create Devotion', icon: BookOpen },
  { id: 'sermon', label: 'Upload Sermon', icon: Video },
  { id: 'music', label: 'Upload Music', icon: MusicIcon },
  { id: 'podcast', label: 'Upload Podcast', icon: Mic },
  { id: 'news', label: 'Publish News', icon: Newspaper },
];

export default function Admin() {
  const { userData, isAdmin, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Simple state for forms (MVP, no complex validation)
  const [portfolioData, setPortfolioData] = useState({ title: '', description: '', category: 'Photography', type: 'photo' });
  const [portfolioFile, setPortfolioFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [devotionData, setDevotionData] = useState({ title: '', scriptureReference: '', content: '', category: 'Faith' });
  const [musicData, setMusicData] = useState({ title: '', artist: '', category: 'Worship Flow', audioUrl: '', coverImageUrl: '' });

  if (authLoading) return <div className="min-h-screen flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-gold" /></div>;
  if (!isAdmin) return <Navigate to="/" />;

  const handlePortfolioSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!portfolioFile) {
      alert('Please select a file to upload.');
      return;
    }
    
    setIsSubmitting(true);
    setUploadProgress(0);
    try {
      const fileRef = ref(storage, `portfolio/${portfolioData.type}s/${Date.now()}_${portfolioFile.name}`);
      const uploadTask = uploadBytesResumable(fileRef, portfolioFile);

      uploadTask.on('state_changed', 
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress);
        }
      );

      await uploadTask;

      const downloadURL = await getDownloadURL(fileRef);

      await addDoc(collection(db, 'portfolio'), {
        ...portfolioData,
        mediaUrls: [downloadURL],
        dateCreated: Date.now(),
        createdBy: userData?.uid,
      });
      alert('Portfolio item created!');
      setPortfolioData({ title: '', description: '', category: 'Photography', type: 'photo' });
      setPortfolioFile(null);
      setUploadProgress(0);
    } catch (error) {
      console.error(error);
      handleFirestoreError(error, OperationType.CREATE, 'portfolio');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDevotionSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'devotions'), {
        ...devotionData,
        authorId: userData?.uid,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        reflectionQuestions: [],
      });
      alert('Devotion created!');
      setDevotionData({ title: '', scriptureReference: '', content: '', category: 'Faith' });
    } catch (error) {
       handleFirestoreError(error, OperationType.CREATE, 'devotions');
    }
    setIsSubmitting(false);
  };

  const handleMusicSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'music'), {
        ...musicData,
        uploadedBy: userData?.uid,
        createdAt: Date.now(),
      });
      alert('Music track created!');
      setMusicData({ title: '', artist: '', category: 'Worship Flow', audioUrl: '', coverImageUrl: '' });
    } catch (error) {
       handleFirestoreError(error, OperationType.CREATE, 'music');
    }
    setIsSubmitting(false);
  };

  return (
    <div className="flex min-h-screen bg-primary-base">
      {/* Sidebar */}
      <aside className="w-64 border-r border-surface-hover bg-surface/30 hidden md:block">
        <div className="p-6">
          <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-6">Control Center</p>
          <nav className="space-y-2">
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-md transition-colors text-sm font-medium ${
                  activeTab === tab.id ? 'bg-gold/10 text-gold' : 'text-gray-400 hover:bg-surface hover:text-white'
                }`}
              >
                <tab.icon className="w-5 h-5" /> {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-12 overflow-y-auto">
        <h1 className="font-serif text-3xl text-white mb-8">Admin Dashboard</h1>

        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <div className="bg-surface border border-surface-hover p-6 rounded-xl">
               <p className="text-gray-400 text-sm mb-2">Welcome Back</p>
               <h3 className="text-white text-xl font-medium">{userData?.email}</h3>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
               <div className="bg-surface border border-surface-hover p-6 rounded-xl relative overflow-hidden group">
                 <div className="absolute inset-0 bg-gradient-to-br from-gold/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                 <RadioIcon className="w-8 h-8 text-gold mb-4" />
                 <h4 className="text-gray-400 text-sm uppercase tracking-widest font-medium mb-1">Live Radio Status</h4>
                 <div className="flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
                   <p className="text-white text-2xl font-bold font-mono">1,204 <span className="text-sm text-gray-500 font-sans font-normal">Listeners</span></p>
                 </div>
               </div>

               <div className="bg-surface border border-surface-hover p-6 rounded-xl relative overflow-hidden group">
                 <div className="absolute inset-0 bg-gradient-to-br from-gold/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                 <Headphones className="w-8 h-8 text-gold mb-4" />
                 <h4 className="text-gray-400 text-sm uppercase tracking-widest font-medium mb-1">Total Streams</h4>
                 <p className="text-white text-2xl font-bold font-mono">48.5K</p>
               </div>

               <div className="bg-surface border border-surface-hover p-6 rounded-xl relative overflow-hidden group">
                 <div className="absolute inset-0 bg-gradient-to-br from-gold/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                 <User className="w-8 h-8 text-gold mb-4" />
                 <h4 className="text-gray-400 text-sm uppercase tracking-widest font-medium mb-1">Active Users</h4>
                 <p className="text-white text-2xl font-bold font-mono">12.3K</p>
               </div>
            </div>
          </div>
        )}

        {/* Moderation */}
        {activeTab === 'moderation' && (
           <AdminModeration />
        )}

        {/* Portfolio Upload */}
        {activeTab === 'portfolio' && (
          <div className="max-w-2xl bg-surface border border-surface-hover border-t-4 border-t-gold p-8 rounded-xl text-center">
            <h2 className="text-xl text-white mb-4 font-medium flex items-center justify-center gap-2"><ImageIcon className="w-5 h-5 text-gold"/> Portfolio Management</h2>
            <p className="text-gray-400 mb-8">The portfolio upload system has been moved to a dedicated, full-screen experience with advanced features.</p>
            <Link to="/admin/portfolio-upload" className="inline-block bg-gold text-primary-base font-bold py-3 px-8 rounded-md hover:bg-white transition-colors">
              Go to Portfolio Upload
            </Link>
          </div>
        )}

        {/* Devotion Upload */}
        {activeTab === 'devotion' && (
          <div className="max-w-2xl bg-surface border border-surface-hover border-t-4 border-t-gold p-8 rounded-xl text-center">
            <h2 className="text-xl text-white mb-4 font-medium flex items-center justify-center gap-2"><BookOpen className="w-5 h-5 text-gold"/> Devotions Management</h2>
            <p className="text-gray-400 mb-8">Create and manage daily devotions from the dedicated publishing suite.</p>
            <Link to="/admin/devotions-create" className="inline-block bg-gold text-primary-base font-bold py-3 px-8 rounded-md hover:bg-white transition-colors">
              Go to Devotions Publisher
            </Link>
          </div>
        )}

        {/* Music Upload */}
        {activeTab === 'music' && (
          <div className="max-w-2xl bg-surface border border-surface-hover border-t-4 border-t-gold p-8 rounded-xl text-center">
            <h2 className="text-xl text-white mb-4 font-medium flex items-center justify-center gap-2"><MusicIcon className="w-5 h-5 text-gold"/> Music Management</h2>
            <p className="text-gray-400 mb-8">Upload and manage worship tracks, gospel music, and sermons.</p>
            <Link to="/admin/music-upload" className="inline-block bg-gold text-primary-base font-bold py-3 px-8 rounded-md hover:bg-white transition-colors">
              Go to Music Upload
            </Link>
          </div>
        )}

        {/* Podcast Upload */}
        {activeTab === 'podcast' && (
          <div className="max-w-2xl bg-surface border border-surface-hover border-t-4 border-t-gold p-8 rounded-xl text-center">
            <h2 className="text-xl text-white mb-4 font-medium flex items-center justify-center gap-2"><Mic className="w-5 h-5 text-gold"/> Podcast Management</h2>
            <p className="text-gray-400 mb-8">Upload and manage podcast episodes.</p>
            <Link to="/admin/podcast-upload" className="inline-block bg-gold text-primary-base font-bold py-3 px-8 rounded-md hover:bg-white transition-colors">
              Go to Podcast Upload
            </Link>
          </div>
        )}

        {/* Sermon Upload */}
        {activeTab === 'sermon' && (
          <div className="max-w-2xl bg-surface border border-surface-hover border-t-4 border-t-gold p-8 rounded-xl text-center">
            <h2 className="text-xl text-white mb-4 font-medium flex items-center justify-center gap-2"><Video className="w-5 h-5 text-gold"/> Sermon Library Management</h2>
            <p className="text-gray-400 mb-8">Upload and manage video and audio sermons.</p>
            <Link to="/admin/sermons-upload" className="inline-block bg-gold text-primary-base font-bold py-3 px-8 rounded-md hover:bg-white transition-colors">
              Go to Sermon Upload
            </Link>
          </div>
        )}

        {/* News Upload */}
        {activeTab === 'news' && (
          <div className="max-w-2xl bg-surface border border-surface-hover border-t-4 border-t-gold p-8 rounded-xl text-center">
            <h2 className="text-xl text-white mb-4 font-medium flex items-center justify-center gap-2"><Newspaper className="w-5 h-5 text-gold"/> News Management</h2>
            <p className="text-gray-400 mb-8">Publish articles, updates, and testimonies.</p>
            <Link to="/admin/news-upload" className="inline-block bg-gold text-primary-base font-bold py-3 px-8 rounded-md hover:bg-white transition-colors">
              Go to News Publisher
            </Link>
          </div>
        )}

      </main>
    </div>
  );
}
