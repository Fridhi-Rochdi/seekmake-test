import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col font-sans">
      {/* Navbar */}
      <nav className="w-full py-8 px-6 flex justify-between items-center max-w-5xl mx-auto">
        <div className="text-xl font-bold tracking-tight">STL Viewer</div>
        <Link href="/viewer" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">
          Open App
        </Link>
      </nav>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-6">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-8">
          View 3D Models<br />
          <span className="text-gray-500">Instantly.</span>
        </h1>
        
        <p className="text-lg md:text-xl text-gray-400 max-w-lg mb-12 leading-relaxed">
          The simplest way to visualize STL files on the web. 
          Fast, responsive, and secure.
        </p>
        
        <Link 
          href="/viewer" 
          className="bg-white text-black px-10 py-4 rounded-full font-medium hover:bg-gray-200 transition-colors text-lg"
        >
          Get Started
        </Link>
      </main>

      {/* Footer */}
      <footer className="py-8 text-center text-gray-700 text-sm">
        <p>&copy; 2025 SeekMake. Simple & Perfect.</p>
      </footer>
    </div>
  );
}
