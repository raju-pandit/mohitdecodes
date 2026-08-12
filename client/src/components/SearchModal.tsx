import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MonitorPlay, FileText, CodeSquare, BookOpen, ChevronRight, Loader2, Map } from 'lucide-react';
import { Modal } from './ui/Modal';
import { Badge } from './ui/Badge';
import { globalSearch } from '../services/searchService';

export const SearchModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

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
    navigate(item.url);
    onClose();
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'course': return <MonitorPlay className="w-5 h-5 text-purple-400" />;
      case 'tutorial': return <FileText className="w-5 h-5 text-blue-400" />;
      case 'blog': return <BookOpen className="w-5 h-5 text-green-400" />;
      case 'project': return <CodeSquare className="w-5 h-5 text-orange-400" />;
      case 'roadmap': return <Map className="w-5 h-5 text-amber-400" />;
      default: return <Search className="w-5 h-5" />;
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
      <div className="-m-6">
        {/* Search Input */}
        <div className="relative border-b border-dark-800 p-4">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search courses, tutorials, blogs..."
            value={query}
            onChange={(e) => { setQuery(e.target.value); setSelectedIndex(0); }}
            className="w-full bg-transparent border-none outline-none text-xl text-white pl-12 pr-4 placeholder-gray-500 font-medium"
          />
          {loading && <Loader2 className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-primary-500 animate-spin" />}
        </div>

        {/* Results */}
        <div className="p-2 max-h-[60vh] overflow-y-auto">
          {query.trim() === '' ? (
            <div className="p-8 text-center text-gray-500">
              <Search className="w-12 h-12 mx-auto mb-4 opacity-20" />
              <p>Type to start searching...</p>
            </div>
          ) : results.length === 0 && !loading ? (
            <div className="p-8 text-center text-gray-500">
              <p>No results found for "{query}"</p>
            </div>
          ) : (
            <div className="space-y-1">
              {results.map((result, idx) => (
                <div
                  key={result.id}
                  onClick={() => handleSelect(result)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-center gap-4 p-3 rounded-xl cursor-pointer transition-colors ${
                    selectedIndex === idx ? 'bg-dark-800' : 'hover:bg-dark-800/50'
                  }`}
                >
                  <div className={`p-2 rounded-lg bg-dark-900 border border-dark-700`}>
                    {getIcon(result.type)}
                  </div>
                  <div className="flex-grow min-w-0">
                    <h4 className={`font-medium truncate ${selectedIndex === idx ? 'text-white' : 'text-gray-200'}`}>
                      {result.title}
                    </h4>
                    <p className="text-sm text-gray-500 truncate">{result.category}</p>
                  </div>
                  <Badge variant={getBadgeVariant(result.type) as any} className="capitalize hidden sm:inline-flex">
                    {result.type}
                  </Badge>
                  <ChevronRight className={`w-5 h-5 transition-colors ${selectedIndex === idx ? 'text-gray-300' : 'text-transparent'}`} />
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="border-t border-dark-800 p-3 bg-dark-900/50 flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1"><kbd className="bg-dark-800 px-1.5 py-0.5 rounded text-gray-400 font-sans border border-dark-700">↑</kbd><kbd className="bg-dark-800 px-1.5 py-0.5 rounded text-gray-400 font-sans border border-dark-700">↓</kbd> to navigate</span>
            <span className="flex items-center gap-1"><kbd className="bg-dark-800 px-1.5 py-0.5 rounded text-gray-400 font-sans border border-dark-700">Enter</kbd> to select</span>
          </div>
          <span className="flex items-center gap-1"><kbd className="bg-dark-800 px-1.5 py-0.5 rounded text-gray-400 font-sans border border-dark-700">Esc</kbd> to close</span>
        </div>
      </div>
    </Modal>
  );
};
