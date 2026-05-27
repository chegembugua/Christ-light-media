import { useState, useRef, FormEvent, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { podcastService, PodcastItem } from '../services/podcastService';
import { notificationService } from '../services/notificationService';
import { useAuth } from '../contexts/AuthContext';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../lib/firebase';
import { Mic, Loader2, ArrowLeft, Image as ImageIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

const CATEGORIES = ['Faith', 'Leadership', 'Prayer', 'Teaching', 'Testimonies'];

export default function AdminPodcastUpload() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [speaker, setSpeaker] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [isFeatured, setIsFeatured] = useState(false);
  
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const audioInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const handleAudioSelect = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setAudioFile(e.target.files[0]);
    }
  };

  const handleCoverSelect = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setCoverFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!audioFile || !coverFile) {
      setError('Please provide both audio and cover media.');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setSuccess(null);
    setUploadProgress(0);

    try {
      const duration = await new Promise<number>((resolve) => {
        const audio = new Audio(URL.createObjectURL(audioFile));
        audio.onloadedmetadata = () => {
          resolve(Math.round(audio.duration));
        };
      });

      // Upload Cover
      const coverStorageRef = ref(storage, `podcasts/covers/${Date.now()}_${coverFile.name}`);
      const coverUploadTask = uploadBytesResumable(coverStorageRef, coverFile);
      const coverUrl = await new Promise<string>((resolve, reject) => {
        coverUploadTask.on('state_changed', null, reject, async () => {
          const url = await getDownloadURL(coverUploadTask.snapshot.ref);
          resolve(url);
        });
      });

      // Upload Audio
      const audioStorageRef = ref(storage, `podcasts/audio/${Date.now()}_${audioFile.name}`);
      const audioUploadTask = uploadBytesResumable(audioStorageRef, audioFile);
      
      const audioUrl = await new Promise<string>((resolve, reject) => {
        audioUploadTask.on('state_changed', 
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setUploadProgress(progress);
          }, 
          reject, 
          async () => {
            const url = await getDownloadURL(audioUploadTask.snapshot.ref);
            resolve(url);
          }
        );
      });

      const podcastData: Omit<PodcastItem, 'id'> = {
        title,
        description,
        speaker,
        category,
        audioUrl,
        coverImageUrl: coverUrl,
        duration,
        isFeatured,
        createdAt: Date.now(),
        createdBy: user.uid,
        playCount: 0
      };

      const createRes = await podcastService.createItem(podcastData);

      if (!createRes.success || !createRes.data) throw new Error(createRes.error);

      await notificationService.broadcastNotification({
        type: 'new_content',
        title: 'New Podcast Episode',
        message: `Listen to "${title}" with ${speaker}`,
        contentType: 'podcast',
        contentId: createRes.data
      });

      setSuccess('Podcast episode published successfully!');
      setTitle('');
      setDescription('');
      setSpeaker('');
      setIsFeatured(false);
      setAudioFile(null);
      setCoverFile(null);
      setUploadProgress(0);

    } catch (err: any) {
      setError(err.message || 'An error occurred during upload.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-primary-base pt-32 pb-24 px-4 sm:px-6 lg:px-8 text-white relative">
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 -right-1/4 w-[500px] h-[500px] bg-gold/5 rounded-full blur-[150px]"></div>
      </div>
      
      <div className="max-w-4xl mx-auto relative z-10">
        <Link to="/admin" className="inline-flex items-center text-gray-400 hover:text-gold transition-colors mb-8 text-sm uppercase tracking-wider font-medium">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
        </Link>
        
        <div className="mb-10">
          <h1 className="text-4xl font-serif font-bold mb-3">Upload Podcast Episode</h1>
          <p className="text-gray-400">Add an audio podcast episode to the platform.</p>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-lg text-sm text-center">
            {error}
          </div>
        )}
        
        {success && (
          <div className="mb-8 p-4 bg-green-500/10 border border-green-500/20 text-green-500 rounded-lg text-sm text-center">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-surface/50 backdrop-blur-md border border-white/10 rounded-2xl p-8 space-y-8 shadow-2xl">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Episode Title</label>
                <input 
                  type="text" 
                  required
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-lg p-3.5 text-white focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/50 transition-all placeholder-gray-600"
                  placeholder="e.g., Understanding Faith"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Speaker</label>
                <input 
                  type="text" 
                  required
                  value={speaker}
                  onChange={e => setSpeaker(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-lg p-3.5 text-white focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/50 transition-all placeholder-gray-600"
                  placeholder="e.g., Pastor John"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
                <select 
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-lg p-3.5 text-white focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/50 transition-all"
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                <textarea 
                  required
                  rows={4}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-lg p-3.5 text-white focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/50 transition-all placeholder-gray-600"
                  placeholder="Episode summary..."
                />
              </div>

              <div className="space-y-3 pt-3">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <div className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${isFeatured ? 'bg-gold' : 'bg-gray-600'}`}>
                    <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${isFeatured ? 'translate-x-6' : 'translate-x-0'}`}></div>
                  </div>
                  <span className="text-gray-300 font-medium">Featured Episode</span>
                  <input type="checkbox" className="hidden" checked={isFeatured} onChange={e => setIsFeatured(e.target.checked)} />
                </label>
              </div>
            </div>

            <div className="space-y-6">
              {/* Audio Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Audio File</label>
                <div 
                  onClick={() => audioInputRef.current?.click()}
                  className={`w-full aspect-[2/1] border-2 border-dashed rounded-xl flex flex-col items-center justify-center p-6 cursor-pointer transition-colors ${audioFile ? 'border-gold/50 bg-gold/5 text-gold' : 'border-white/20 bg-black/20 hover:border-white/40 hover:bg-black/40 text-gray-400'}`}
                >
                  <Mic className="w-8 h-8 mb-3 opacity-80" />
                  <p className="text-sm font-medium mb-1">
                    {audioFile ? 'Audio Selected' : 'Click to Upload Audio'}
                  </p>
                  <p className="text-xs text-center opacity-70">
                    {audioFile ? audioFile.name : 'MP3, WAV files'}
                  </p>
                  <input 
                    type="file" 
                    readOnly
                    ref={audioInputRef}
                    onChange={handleAudioSelect}
                    accept="audio/*"
                    className="hidden" 
                  />
                </div>
              </div>

              {/* Cover Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Cover Image</label>
                <div 
                  onClick={() => coverInputRef.current?.click()}
                  className={`w-full aspect-[2/1] border-2 border-dashed rounded-xl flex flex-col items-center justify-center p-6 cursor-pointer transition-colors ${coverFile ? 'border-gold/50 bg-gold/5 text-gold' : 'border-white/20 bg-black/20 hover:border-white/40 hover:bg-black/40 text-gray-400'}`}
                >
                  <ImageIcon className="w-8 h-8 mb-3 opacity-80" />
                  <p className="text-sm font-medium mb-1">
                    {coverFile ? 'Cover Selected' : 'Click to Upload Cover'}
                  </p>
                  <p className="text-xs text-center opacity-70">
                    {coverFile ? coverFile.name : 'JPG, PNG images'}
                  </p>
                  <input 
                    type="file" 
                    readOnly
                    ref={coverInputRef}
                    onChange={handleCoverSelect}
                    accept="image/*"
                    className="hidden" 
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-white/10">
             {uploadProgress > 0 && uploadProgress < 100 && (
              <div className="mb-6">
                <div className="flex justify-between text-xs text-gray-400 mb-2">
                  <span>Uploading audio...</span>
                  <span>{Math.round(uploadProgress)}%</span>
                </div>
                <div className="w-full bg-surface border border-surface-hover rounded-full h-1.5 overflow-hidden">
                  <div className="bg-gold h-1.5 rounded-full transition-all duration-300 ease-out" style={{ width: `${uploadProgress}%` }}></div>
                </div>
              </div>
            )}
            
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gold hover:bg-gold-light text-primary-base font-bold py-4 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center border border-gold hover:border-white/20 hover:shadow-[0_0_20px_rgba(200,162,74,0.3)] shadow-[0_0_10px_rgba(200,162,74,0.15)] text-lg uppercase tracking-wide"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-3" />
                  Publishing Episode...
                </>
              ) : (
                'Upload Episode'
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
