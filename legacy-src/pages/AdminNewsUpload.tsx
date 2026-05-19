import { useState, useRef, FormEvent, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { newsService, NewsItem } from '../services/newsService';
import { notificationService } from '../services/notificationService';
import { useAuth } from '../contexts/AuthContext';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../lib/firebase';
import { Loader2, ArrowLeft, Image as ImageIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

const CATEGORIES = ["Church", "Ministry", "Persecution", "Testimonies", "Global Faith", "Bible Insight", "Christian Culture"];

export default function AdminNewsUpload() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('');
  const [readTime, setReadTime] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [tagsInput, setTagsInput] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const imageInputRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!imageFile) {
      setError('Please provide a featured image.');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setSuccess(null);
    setUploadProgress(0);

    try {
      const storageRef = ref(storage, `news/images/${Date.now()}_${imageFile.name}`);
      const uploadTask = uploadBytesResumable(storageRef, imageFile);
      
      const imageUrl = await new Promise<string>((resolve, reject) => {
        uploadTask.on('state_changed', 
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setUploadProgress(progress);
          }, 
          reject, 
          async () => {
            const url = await getDownloadURL(uploadTask.snapshot.ref);
            resolve(url);
          }
        );
      });

      const tags = tagsInput.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);

      const newsData: Omit<NewsItem, 'id'> = {
        title,
        subtitle,
        content,
        imageUrl,
        category,
        author,
        readTime: Number(readTime) || 3,
        createdAt: Date.now(),
        createdBy: user.uid,
        isFeatured,
        tags,
        views: 0
      };

      const createRes = await newsService.createItem(newsData);

      if (!createRes.success || !createRes.data) throw new Error(createRes.error);

      await notificationService.broadcastNotification({
        type: 'new_content',
        title: 'New Article',
        message: `Read our latest news: "${title}"`,
        contentType: 'news',
        contentId: createRes.data
      });

      setSuccess('News article published successfully!');
      setTitle('');
      setSubtitle('');
      setContent('');
      setAuthor('');
      setReadTime('');
      setTagsInput('');
      setIsFeatured(false);
      setImageFile(null);
      setUploadProgress(0);

    } catch (err: any) {
      setError(err.message || 'An error occurred during upload.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-primary-base pt-32 pb-24 px-4 sm:px-6 lg:px-8 text-white relative">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/4 -right-1/4 w-[500px] h-[500px] bg-gold/5 rounded-full blur-[150px]"></div>
      </div>
      
      <div className="max-w-4xl mx-auto relative z-10">
        <Link to="/admin" className="inline-flex items-center text-gray-400 hover:text-gold transition-colors mb-8 text-sm uppercase tracking-wider font-medium">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
        </Link>
        
        <div className="mb-10">
          <h1 className="text-4xl font-serif font-bold mb-3">Publish News Article</h1>
          <p className="text-gray-400">Share updates, testimonies, and Christian news.</p>
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
                <label className="block text-sm font-medium text-gray-300 mb-2">Headline / Title</label>
                <input 
                  type="text" 
                  required
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-lg p-3.5 text-white focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/50 transition-all placeholder-gray-600"
                  placeholder="Article headline"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Subtitle / Excerpt</label>
                <input 
                  type="text" 
                  required
                  value={subtitle}
                  onChange={e => setSubtitle(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-lg p-3.5 text-white focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/50 transition-all placeholder-gray-600"
                  placeholder="Brief summary"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Author</label>
                  <input 
                    type="text" 
                    required
                    value={author}
                    onChange={e => setAuthor(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-lg p-3.5 text-white focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/50 transition-all placeholder-gray-600"
                    placeholder="E.g., John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Read Time (mins)</label>
                  <input 
                    type="number" 
                    required
                    min="1"
                    value={readTime}
                    onChange={e => setReadTime(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-lg p-3.5 text-white focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/50 transition-all placeholder-gray-600"
                    placeholder="e.g. 5"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
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
                  <label className="block text-sm font-medium text-gray-300 mb-2">Tags (CSV)</label>
                  <input 
                    type="text" 
                    value={tagsInput}
                    onChange={e => setTagsInput(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-lg p-3.5 text-white focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/50 transition-all placeholder-gray-600"
                    placeholder="news, event"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-6 flex flex-col">
              {/* Image Upload */}
              <div className="flex-1 flex flex-col">
                <label className="block text-sm font-medium text-gray-300 mb-2">Featured Image</label>
                <div 
                  onClick={() => imageInputRef.current?.click()}
                  className={`w-full flex-1 min-h-[200px] border-2 border-dashed rounded-xl flex flex-col items-center justify-center p-6 cursor-pointer transition-colors ${imageFile ? 'border-gold/50 bg-gold/5 text-gold' : 'border-white/20 bg-black/20 hover:border-white/40 hover:bg-black/40 text-gray-400'}`}
                >
                  <ImageIcon className="w-8 h-8 mb-3 opacity-80" />
                  <p className="text-sm font-medium mb-1">
                    {imageFile ? 'Image Selected' : 'Click to Upload Image'}
                  </p>
                  <p className="text-xs text-center opacity-70">
                    {imageFile ? imageFile.name : 'High-quality JPG or PNG'}
                  </p>
                  <input 
                    type="file" 
                    readOnly
                    ref={imageInputRef}
                    onChange={handleImageSelect}
                    accept="image/*"
                    className="hidden" 
                  />
                </div>
              </div>

              <div className="space-y-3 pt-3">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <div className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${isFeatured ? 'bg-gold' : 'bg-gray-600'}`}>
                    <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${isFeatured ? 'translate-x-6' : 'translate-x-0'}`}></div>
                  </div>
                  <span className="text-gray-300 font-medium">Featured News Article</span>
                  <input type="checkbox" className="hidden" checked={isFeatured} onChange={e => setIsFeatured(e.target.checked)} />
                </label>
              </div>
            </div>
          </div>
          
          <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Article Content</label>
              <textarea 
                required
                rows={10}
                value={content}
                onChange={e => setContent(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-lg p-5 text-white focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/50 transition-all font-serif placeholder-gray-600 leading-relaxed"
                placeholder="Write the full article content here..."
              />
          </div>

          <div className="pt-6 border-t border-white/10">
             {uploadProgress > 0 && uploadProgress < 100 && (
              <div className="mb-6">
                <div className="flex justify-between text-xs text-gray-400 mb-2">
                  <span>Uploading media...</span>
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
                  Publishing Article...
                </>
              ) : (
                'Publish News Article'
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
