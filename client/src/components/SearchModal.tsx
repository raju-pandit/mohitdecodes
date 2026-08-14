import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Search, MonitorPlay, FileText, CodeSquare, BookOpen, ChevronRight, Loader2, Map, Sparkles } from 'lucide-react';
import { Modal } from './ui/Modal';
import { Badge } from './ui/Badge';
import { LogoIcon } from './Logo';
import { globalSearch } from '../services/searchService';

export const SearchModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const quickSearches = ['React', 'JavaScript', 'Node.js', 'DSA', 'MERN Stack', 'Roadmaps', 'System Design'];

  // Close modal on location change
  useEffect(() => {
    if (isOpen) {
      onClose();
      setQuery('');
      setResults([]);
    }
  }, [location.pathname]);

  useEffect(() => {
    if (isOpen) {
      requestAnimationFrame(() => inputRef.current?.focus());
      setQuery('');
      setResults([]);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        isOpen ? onClose() : document.dispatchEvent(new CustomEvent('open-search'));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Ultra-Fast Real Search Effect (120ms snappy debounce)
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await globalSearch(query);
        const data = res.data || {};
        const flatResults: any[] = [];

        if (data.courses) {
          data.courses.forEach((c: any) => flatResults.push({ id: c._id, type: 'course', title: c.title, url: `/courses/${c.slug}`, category: c.category }));
        }
        if (data.tutorials) {
          data.tutorials.forEach((t: any) => flatResults.push({ id: t._id, type: 'tutorial', title: t.title, url: `/tutorials/${t.slug}`, category: t.category }));
        }
        if (data.blogs) {
          data.blogs.forEach((b: any) => flatResults.push({ id: b._id, type: 'blog', title: b.title, url: `/blogs/${b.slug}`, category: b.category }));
        }
        if (data.projects) {
          data.projects.forEach((p: any) => flatResults.push({ id: p._id, type: 'project', title: p.title, url: `/projects/${p.slug}`, category: p.category }));
        }
        if (data.roadmaps) {
          data.roadmaps.forEach((r: any) => flatResults.push({ id: r._id, type: 'roadmap', title: r.title, url: `/roadmaps/${r.slug}`, category: r.category }));
        }
        if (data.resources) {
          data.resources.forEach((r: any) => flatResults.push({ id: r._id, type: 'resource', title: r.title, url: `/resources`, category: r.category }));
        }

        setResults(flatResults);
      } catch (err) {
        console.error('Search failed:', err);
      } finally {
        setLoading(false);
      }
    }, 120);

    return () => clearTimeout(timer);
  }, [query]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % (results.length || 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + results.length) % (results.length || 1));
      } else if (e.key === 'Enter' && results.length > 0) {
        e.preventDefault();
        handleSelect(results[selectedIndex]);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, results, selectedIndex]);

  const handleSelect = (item: any) => {
    onClose();
    setQuery('');
    setResults([]);
    if (item?.url) {
      navigate(item.url);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'course': return <MonitorPlay className="w-5 h-5 text-purple-500" />;
      case 'tutorial': return <FileText className="w-5 h-5 text-blue-500" />;
      case 'blog': return <BookOpen className="w-5 h-5 text-emerald-500" />;
      case 'project': return <CodeSquare className="w-5 h-5 text-orange-500" />;
      case 'roadmap': return <Map className="w-5 h-5 text-amber-500" />;
      default: return <Search className="w-5 h-5 text-purple-500" />;
    }
  };

  const getBadgeVariant = (type: string) => {
    switch (type) {
      case 'course': return 'primary';
      case 'tutorial': return 'blue';
      case 'blog': return 'green';
      case 'project': return 'orange';
      case 'roadmap': return 'orange';
      default: return 'outline';
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <div className="-m-6 flex flex-col">
        {/* Search Input Bar with Logo */}
        <div className="relative border-b border-slate-200 dark:border-dark-800 p-4 sm:p-5 flex items-center gap-3 bg-white dark:bg-dark-900">
          <LogoIcon size={36} className="shrink-0" />
          <div className="relative flex-1 flex items-center">
            <Search className="w-5 h-5 text-slate-400 mr-2.5 shrink-0" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search courses, tutorials, blogs, roadmaps..."
              value={query}
              onChange={(e) => { setQuery(e.target.value); setSelectedIndex(0); }}
              className="w-full bg-transparent border-none outline-none text-base sm:text-lg text-slate-900 dark:text-white placeholder-slate-400 font-semibold"
            />
          </div>
          {loading && <Loader2 className="w-5 h-5 text-purple-600 animate-spin shrink-0" />}
        </div>

        {/* Search Results Area */}
        <div className="p-3 sm:p-4 max-h-[60vh] overflow-y-auto bg-slate-50/50 dark:bg-dark-950/40">
          {query.trim() === '' ? (
            <div className="py-8 px-4 text-center space-y-5">
              <div className="flex flex-col items-center justify-center space-y-3">
                <LogoIcon size={56} className="shadow-lg shadow-purple-500/20" />
                <div>
                  <h3 className="font-bold text-slate-800 dark:text-slate-200 text-base">
                    Search MohitDecodes
                  </h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                    Find tutorials, complete courses, curated roadmaps, blogs, and developer resources.
                  </p>
                </div>
              </div>

              {/* Quick Suggestion Pills */}
              <div className="pt-2">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2 flex items-center justify-center gap-1.5">
                  <Sparkles size={12} className="text-purple-500" /> Popular Searches
                </p>
                <div className="flex flex-wrap items-center justify-center gap-2 max-w-md mx-auto">
                  {quickSearches.map((item) => (
                    <button
                      key={item}
                      onClick={() => setQuery(item)}
                      className="px-3 py-1 rounded-full text-xs font-semibold bg-white dark:bg-dark-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-dark-700 hover:border-purple-500 dark:hover:border-purple-500 hover:text-purple-600 transition-all cursor-pointer shadow-xs"
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : results.length === 0 && !loading ? (
            <div className="py-12 text-center text-slate-500 space-y-2">
              <Search className="w-10 h-10 mx-auto text-slate-400 opacity-40 mb-2" />
              <p className="font-semibold text-slate-800 dark:text-slate-200">No results found for "{query}"</p>
              <p className="text-xs text-slate-400">Try searching for keywords like "React", "JavaScript", or "Roadmaps"</p>
            </div>
          ) : (
            <div className="space-y-1.5">
              {results.map((result, idx) => (
                <div
                  key={result.id}
                  onClick={() => handleSelect(result)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-center gap-3.5 p-3 rounded-xl cursor-pointer transition-all ${
                    selectedIndex === idx 
                      ? 'bg-purple-50 dark:bg-dark-800 border border-purple-200/80 dark:border-purple-500/30 shadow-xs' 
                      : 'hover:bg-white dark:hover:bg-dark-900 border border-transparent'
                  }`}
                >
                  <div className="p-2.5 rounded-xl bg-white dark:bg-dark-900 border border-slate-200/80 dark:border-dark-700 shadow-xs shrink-0">
                    {getIcon(result.type)}
                  </div>
                  <div className="flex-grow min-w-0">
                    <h4 className={`font-semibold text-sm truncate ${selectedIndex === idx ? 'text-purple-700 dark:text-white' : 'text-slate-900 dark:text-slate-200'}`}>
                      {result.title}
                    </h4>
                    <p className="text-xs text-slate-500 truncate mt-0.5">{result.category}</p>
                  </div>
                  <Badge variant={getBadgeVariant(result.type) as any} className="capitalize hidden sm:inline-flex shrink-0">
                    {result.type}
                  </Badge>
                  <ChevronRight className={`w-4 h-4 shrink-0 transition-colors ${selectedIndex === idx ? 'text-purple-600 dark:text-gray-300' : 'text-slate-300 dark:text-dark-700'}`} />
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Footer Shortcut Bar */}
        <div className="border-t border-slate-200 dark:border-dark-800 p-3.5 bg-white dark:bg-dark-900 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1"><kbd className="bg-slate-100 dark:bg-dark-800 px-1.5 py-0.5 rounded text-slate-600 dark:text-slate-400 font-sans border border-slate-200 dark:border-dark-700 shadow-xs font-semibold">↑</kbd><kbd className="bg-slate-100 dark:bg-dark-800 px-1.5 py-0.5 rounded text-slate-600 dark:text-slate-400 font-sans border border-slate-200 dark:border-dark-700 shadow-xs font-semibold">↓</kbd> navigate</span>
            <span className="flex items-center gap-1"><kbd className="bg-slate-100 dark:bg-dark-800 px-2 py-0.5 rounded text-slate-600 dark:text-slate-400 font-sans border border-slate-200 dark:border-dark-700 shadow-xs font-semibold">Enter</kbd> select</span>
          </div>
          <span className="flex items-center gap-1"><kbd className="bg-slate-100 dark:bg-dark-800 px-1.5 py-0.5 rounded text-slate-600 dark:text-slate-400 font-sans border border-slate-200 dark:border-dark-700 shadow-xs font-semibold">Esc</kbd> close</span>
        </div>
      </div>
    </Modal>
  );
};

export default SearchModal;
