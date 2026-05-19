import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { devotionService } from '../services/devotionService';
import { notificationService } from '../services/notificationService';
import { useAuth } from '../contexts/AuthContext';
import { Loader2, ArrowLeft, Plus, X } from 'lucide-react';
import { Link } from 'react-router-dom';

const CATEGORIES = [
  'Faith',
  'Prayer',
  'Growth',
  'Leadership',
  'Worship'
];

export default function AdminDevotionsCreate() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [scriptureReference, setScriptureReference] = useState('');
  const [scriptureText, setScriptureText] = useState('');
  const [content, setContent] = useState('');
  const [reflectionQuestions, setReflectionQuestions] = useState<string[]>(['']);
  const [prayer, setPrayer] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [isFeatured, setIsFeatured] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleQuestionChange = (index: number, value: string) => {
    const newQuestions = [...reflectionQuestions];
    newQuestions[index] = value;
    setReflectionQuestions(newQuestions);
  };

  const addQuestion = () => {
    setReflectionQuestions([...reflectionQuestions, '']);
  };

  const removeQuestion = (index: number) => {
    setReflectionQuestions(reflectionQuestions.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    const validQuestions = reflectionQuestions.filter(q => q.trim().length > 0);

    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    const data: any = {
      title,
      scriptureReference,
      content,
      reflectionQuestions: validQuestions,
      prayer,
      category,
      isFeatured,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      createdBy: user.uid
    };

    if (scriptureText.trim()) {
      data.scriptureText = scriptureText;
    }

    try {
      const createRes = await devotionService.createItem(data);

      if (!createRes.success || !createRes.data) throw new Error(createRes.error);

      await notificationService.broadcastNotification({
        type: 'new_content',
        title: 'New Devotion',
        message: `Read today's devotion: "${title}"`,
        contentType: 'devotion',
        contentId: createRes.data
      });

      setSuccess('Devotion published successfully!');
      
      // Reset form
      setTitle('');
      setScriptureReference('');
      setScriptureText('');
      setContent('');
      setReflectionQuestions(['']);
      setPrayer('');
      setCategory(CATEGORIES[0]);
      setIsFeatured(false);

    } catch (err: any) {
      setError(err.message || 'An error occurred during publishing.');
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
          <h1 className="text-4xl font-serif font-bold mb-3">Create Devotion</h1>
          <p className="text-gray-400">Publish a new daily devotion or scripture reflection.</p>
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
                  placeholder="e.g., Walking in the Light"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Scripture Reference</label>
                <input 
                  type="text" 
                  required
                  value={scriptureReference}
                  onChange={e => setScriptureReference(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-lg p-3.5 text-white focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/50 transition-all placeholder-gray-600"
                  placeholder="e.g., 1 John 1:7"
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
                <label className="block text-sm font-medium text-gray-300 mb-2">Featured Item</label>
                <label className="flex items-center space-x-3 cursor-pointer">
                  <div className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${isFeatured ? 'bg-gold' : 'bg-gray-600'}`}>
                    <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${isFeatured ? 'translate-x-6' : 'translate-x-0'}`}></div>
                  </div>
                  <span className="text-gray-300 font-medium">Highlight this devotion</span>
                  <input type="checkbox" className="hidden" checked={isFeatured} onChange={e => setIsFeatured(e.target.checked)} />
                </label>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Scripture Text (Optional)</label>
                <textarea 
                  rows={4}
                  value={scriptureText}
                  onChange={e => setScriptureText(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-lg p-3.5 text-white focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/50 transition-all placeholder-gray-600 resize-none font-serif italic"
                  placeholder="But if we walk in the light..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Content</label>
                <textarea 
                  required
                  rows={10}
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-lg p-3.5 text-white focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/50 transition-all placeholder-gray-600 resize-none"
                  placeholder="Write your devotion here..."
                />
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-white/10 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Reflection Questions</label>
              <div className="space-y-3">
                {reflectionQuestions.map((q, idx) => (
                  <div key={idx} className="flex gap-2">
                    <input 
                      type="text" 
                      value={q}
                      onChange={e => handleQuestionChange(idx, e.target.value)}
                      className="flex-1 bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/50 transition-all placeholder-gray-600"
                      placeholder={`Question ${idx + 1}`}
                    />
                    {reflectionQuestions.length > 1 && (
                      <button type="button" onClick={() => removeQuestion(idx)} className="p-3 text-gray-500 hover:text-red-400 bg-black/20 rounded-lg border border-white/5 transition-colors">
                        <X className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <button type="button" onClick={addQuestion} className="mt-3 flex items-center text-sm text-gold hover:text-gold/80 font-medium transition-colors">
                <Plus className="w-4 h-4 mr-1" /> Add another question
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Prayer</label>
              <textarea 
                required
                rows={4}
                value={prayer}
                onChange={e => setPrayer(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-lg p-3.5 text-white focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/50 transition-all placeholder-gray-600 resize-none"
                placeholder="Lord, please help me..."
              />
            </div>
          </div>

          <div className="pt-6 border-t border-white/10">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gold hover:bg-gold-light text-primary-base font-bold py-4 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center border border-gold hover:border-white/20 hover:shadow-[0_0_20px_rgba(200,162,74,0.3)] shadow-[0_0_10px_rgba(200,162,74,0.15)] text-lg uppercase tracking-wide"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-3" />
                  Publishing...
                </>
              ) : (
                'Publish Devotion'
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
