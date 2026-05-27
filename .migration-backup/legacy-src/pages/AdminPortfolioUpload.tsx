import { useState, FormEvent, useRef, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { portfolioService } from '../services/portfolioService';
import { useAuth } from '../contexts/AuthContext';
import { Upload, FileUp, Loader2, ArrowLeft, X } from 'lucide-react';
import { Link } from 'react-router-dom';

const CATEGORIES = [
  'Weddings',
  'Church Events',
  'Worship Sessions',
  'Commercial',
  'Ministry'
];

export default function AdminPortfolioUpload() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [type, setType] = useState<'photo' | 'video'>('photo');

  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [overallProgress, setOverallProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const mediaInputRef = useRef<HTMLInputElement>(null);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);

  const handleMediaSelect = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      if (type === 'video') {
        // Only one video allowed
        setMediaFiles([e.target.files[0]]);
      } else {
        // Multiple photos allowed
        setMediaFiles(Array.from(e.target.files));
      }
    }
  };

  const handleThumbnailSelect = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setThumbnailFile(e.target.files[0]);
    }
  };

  const removeMediaFile = (index: number) => {
    setMediaFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    if (mediaFiles.length === 0) {
      setError('Please select at least one media file.');
      return;
    }
    if (!thumbnailFile) {
      setError('A thumbnail image is required.');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setSuccess(null);
    setOverallProgress(0);

    try {
      const totalFiles = mediaFiles.length + 1; // media + thumbnail
      let completedFiles = 0;

      const updateProgress = (fileProgress: number) => {
        // Calculate total progress: (completed files * 100 + current file progress) / (total files * 100)
        const totalProgressPercentage = ((completedFiles * 100) + fileProgress) / totalFiles;
        setOverallProgress(totalProgressPercentage);
      };

      // 1. Upload Thumbnail
      const thumbRes = await portfolioService.uploadFile(
        thumbnailFile, 
        'portfolio/thumbnails', 
        updateProgress
      );
      if (!thumbRes.success || !thumbRes.data) throw new Error(thumbRes.error || 'Failed to upload thumbnail');
      const thumbnailUrl = thumbRes.data;
      completedFiles++;

      // 2. Upload Media Files
      const mediaUrls: string[] = [];
      const mediaPath = type === 'photo' ? 'portfolio/images' : 'portfolio/videos';
      
      for (const file of mediaFiles) {
        const fileRes = await portfolioService.uploadFile(file, mediaPath, updateProgress);
        if (!fileRes.success || !fileRes.data) throw new Error(fileRes.error || 'Failed to upload media file');
        mediaUrls.push(fileRes.data);
        completedFiles++;
      }

      // 3. Save to Firestore
      const createRes = await portfolioService.createItem({
        title,
        description,
        type,
        category,
        mediaUrls,
        thumbnailUrl,
        createdAt: Date.now(),
        createdBy: user.uid
      });

      if (!createRes.success) throw new Error(createRes.error);

      setSuccess('Portfolio item uploaded successfully!');
      
      // Reset form
      setTitle('');
      setDescription('');
      setCategory(CATEGORIES[0]);
      setType('photo');
      setMediaFiles([]);
      setThumbnailFile(null);
      if (mediaInputRef.current) mediaInputRef.current.value = '';
      if (thumbnailInputRef.current) thumbnailInputRef.current.value = '';

    } catch (err: any) {
      setError(err.message || 'An error occurred during upload.');
    } finally {
      setIsSubmitting(false);
      setOverallProgress(0);
    }
  };

  return (
    <div className="min-h-screen bg-primary-base pt-32 pb-24 px-4 sm:px-6 lg:px-8 text-white relative">
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 -left-1/4 w-[500px] h-[500px] bg-gold/5 rounded-full blur-[150px]"></div>
      </div>
      
      <div className="max-w-3xl mx-auto relative z-10">
        <Link to="/admin/dashboard" className="inline-flex items-center text-gray-400 hover:text-gold transition-colors mb-8 text-sm uppercase tracking-wider font-medium">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
        </Link>
        
        <div className="mb-10">
          <h1 className="text-4xl font-serif font-bold mb-3">Upload Portfolio</h1>
          <p className="text-gray-400">Add a new photo or video project to the Christ Light Media portfolio.</p>
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
                <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
                <input 
                  type="text" 
                  required
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-lg p-3.5 text-white focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/50 transition-all placeholder-gray-600"
                  placeholder="e.g., Annual Worship Night 2023"
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
                <label className="block text-sm font-medium text-gray-300 mb-2">Media Type</label>
                <div className="flex bg-black/40 border border-white/10 rounded-lg overflow-hidden p-1">
                  <button
                    type="button"
                    onClick={() => { setType('photo'); setMediaFiles([]); }}
                    className={`flex-1 py-3 text-sm font-medium rounded-md transition-colors ${type === 'photo' ? 'bg-gold text-primary-base' : 'text-gray-400 hover:text-white'}`}
                  >
                    Photography
                  </button>
                  <button
                    type="button"
                    onClick={() => { setType('video'); setMediaFiles([]); }}
                    className={`flex-1 py-3 text-sm font-medium rounded-md transition-colors ${type === 'video' ? 'bg-gold text-primary-base' : 'text-gray-400 hover:text-white'}`}
                  >
                    Videography
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                <textarea 
                  required
                  rows={9}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-lg p-3.5 text-white focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/50 transition-all placeholder-gray-600 resize-none"
                  placeholder="Describe the project..."
                />
              </div>
            </div>
          </div>

          <div className="space-y-6 pt-6 border-t border-white/10">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Thumbnail Image (Required) <span className="text-gray-500 font-normal text-xs ml-2">Displayed in the gallery grid</span>
              </label>
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-white/10 border-dashed rounded-xl cursor-pointer bg-black/20 hover:bg-black/40 hover:border-gold/30 transition-all">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-4">
                    <FileUp className="w-6 h-6 mb-2 text-gray-400" />
                    {thumbnailFile ? (
                      <p className="text-sm text-gold font-medium truncate max-w-xs">{thumbnailFile.name}</p>
                    ) : (
                      <>
                        <p className="mb-1 text-sm text-gray-400"><span className="text-gold font-medium">Click to upload</span></p>
                        <p className="text-xs text-gray-500">Image file only (16:9 recommended)</p>
                      </>
                    )}
                  </div>
                  <input 
                    type="file" 
                    className="hidden" 
                    accept="image/*" 
                    ref={thumbnailInputRef}
                    onChange={handleThumbnailSelect} 
                  />
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Media Files <span className="text-gray-500 font-normal text-xs ml-2">{type === 'photo' ? 'Upload multiple images' : 'Upload one video'}</span>
              </label>
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-white/10 border-dashed rounded-xl cursor-pointer bg-black/20 hover:bg-black/40 hover:border-gold/30 transition-all">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-4">
                    <Upload className="w-8 h-8 mb-3 text-gold" />
                    <p className="mb-1 text-sm text-gray-300"><span className="text-gold font-medium">Click to upload</span> main media</p>
                    <p className="text-xs text-gray-500">
                      {type === 'photo' ? 'Multiple JPG, PNG allowed' : 'Single MP4 allowed'}
                    </p>
                  </div>
                  <input 
                    type="file" 
                    className="hidden" 
                    accept={type === 'photo' ? 'image/*' : 'video/*'} 
                    multiple={type === 'photo'}
                    ref={mediaInputRef}
                    onChange={handleMediaSelect} 
                  />
                </label>
              </div>
              
              {mediaFiles.length > 0 && (
                <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {mediaFiles.map((file, idx) => (
                    <div key={idx} className="bg-black/40 border border-white/5 rounded-lg p-2 px-3 flex items-center justify-between text-xs text-gray-300">
                      <span className="truncate mr-2 flex-1">{file.name}</span>
                      <button type="button" onClick={() => removeMediaFile(idx)} className="text-gray-500 hover:text-red-400 p-1">
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="pt-6 border-t border-white/10">
            {isSubmitting && (
              <div className="mb-6 space-y-2">
                <div className="flex justify-between text-sm text-gray-400 font-mono">
                  <span>Uploading...</span>
                  <span>{Math.round(overallProgress)}%</span>
                </div>
                <div className="w-full bg-black/40 rounded-full h-2 border border-white/10 overflow-hidden">
                  <div className="bg-gold h-2 rounded-full transition-all duration-300 ease-out relative" style={{ width: `${overallProgress}%` }}>
                    <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                  </div>
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
                  Processing Upload...
                </>
              ) : (
                'Publish Portfolio Item'
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
