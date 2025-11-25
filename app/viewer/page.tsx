'use client';

import { useState, useEffect } from 'react';
import Viewer from '@/components/Viewer';

interface FileRecord {
  id: string;
  name: string;
  url: string;
  size: number;
  createdAt: string;
}

export default function ViewerPage() {
  const [files, setFiles] = useState<FileRecord[]>([]);
  const [selectedUrl, setSelectedUrl] = useState<string | null>(null);
  const [loadTime, setLoadTime] = useState<number | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const fetchFiles = () => {
    fetch('/api/files')
      .then(res => res.json())
      .then(data => setFiles(data))
      .catch(err => console.error("Failed to fetch files", err));
  };

  useEffect(() => {
    fetchFiles();
    
    const mediaQuery = window.matchMedia('(max-width: 768px)');
    const handleMediaQueryChange = (e: MediaQueryListEvent | MediaQueryList) => {
      setIsSidebarOpen(!e.matches);
    };
    handleMediaQueryChange(mediaQuery);
    mediaQuery.addEventListener('change', handleMediaQueryChange);
    return () => mediaQuery.removeEventListener('change', handleMediaQueryChange);
  }, []);

  const handleFileSelect = (file: FileRecord) => {
    setSelectedUrl(file.url);
    setLoadTime(null);
    if (window.innerWidth <= 768) {
      setIsSidebarOpen(false);
    }
  };

  const handleLocalFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setSelectedUrl(url);
      setLoadTime(null);
      if (window.innerWidth <= 768) {
        setIsSidebarOpen(false);
      }
    }
  };

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i]);
    }

    try {
      await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      fetchFiles();
    } catch (error) {
      console.error('Upload failed', error);
    }
  };

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-gray-100">
      {/* Toggle Button */}
      <button 
        className={`absolute top-4 z-30 flex h-10 w-10 items-center justify-center rounded-full shadow-md transition-all hover:scale-110 ${
          isSidebarOpen 
            ? 'left-[250px] text-white bg-transparent shadow-none hover:bg-white/10' 
            : 'left-4 bg-white text-gray-800'
        }`}
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        aria-label="Toggle Menu"
      >
        {isSidebarOpen ? '×' : '☰'}
      </button>

      {/* Sidebar */}
      <div className={`absolute top-0 left-0 z-20 h-full w-[300px] flex flex-col gap-5 bg-slate-800/95 p-5 pt-16 text-white shadow-2xl backdrop-blur-md transition-transform duration-300 ease-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">STL Viewer</h2>
        </div>
        
        <div className="rounded-lg bg-white/10 p-4">
          <h3 className="mb-2 text-sm font-medium text-gray-400">Local File</h3>
          <label className="block w-full cursor-pointer rounded bg-blue-600 px-4 py-2 text-center text-sm font-medium text-white transition-colors hover:bg-blue-700">
            View Local File
            <input type="file" accept=".stl" onChange={handleLocalFile} className="hidden" />
          </label>
        </div>

        <div className="rounded-lg bg-white/10 p-4">
          <h3 className="mb-2 text-sm font-medium text-gray-400">Upload to Server</h3>
          <label className="block w-full cursor-pointer rounded bg-green-600 px-4 py-2 text-center text-sm font-medium text-white transition-colors hover:bg-green-700">
            Upload Files
            <input type="file" accept=".stl" multiple onChange={handleUpload} className="hidden" />
          </label>
        </div>

        <div className="flex-1 overflow-hidden rounded-lg bg-white/10 p-4 flex flex-col">
          <h3 className="mb-2 text-sm font-medium text-gray-400">Server Files</h3>
          {files.length === 0 ? (
            <p className="text-sm italic text-gray-500">No files found on server.</p>
          ) : (
            <ul className="flex-1 overflow-y-auto pr-2">
              {files.map(file => (
                <li key={file.id} className="mb-1">
                  <button 
                    className={`w-full truncate rounded px-3 py-2 text-left text-sm transition-colors hover:bg-white/10 ${selectedUrl === file.url ? 'bg-blue-500/30 border-l-4 border-blue-500' : ''}`}
                    onClick={() => handleFileSelect(file)}
                    title={file.name}
                  >
                    {file.name}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {loadTime !== null && (
          <div className="rounded-lg bg-black/20 p-4">
            <h3 className="text-sm font-medium text-gray-400">Performance</h3>
            <p className="text-sm">Load Time: <span className="font-bold text-green-400">{loadTime.toFixed(2)} ms</span></p>
          </div>
        )}
      </div>

      {/* Viewer Container */}
      <div className="absolute top-0 left-0 h-full w-full z-10">
        <Viewer url={selectedUrl} onLoadComplete={setLoadTime} />
      </div>
    </div>
  );
}
