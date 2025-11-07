import dynamic from 'next/dynamic'
import Link from 'next/link'

// Dynamically import the map component to avoid SSR issues with Leaflet
const InteractiveMap = dynamic(() => import('../components/InteractiveMap'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center p-8 text-center">
      <div className="animate-pulse">
        <p className="text-purple-600 font-semibold">Loading map...</p>
      </div>
    </div>
  ),
})

export default function MapPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 px-4 py-8 md:p-8 max-w-7xl mx-auto">
      <div className="mb-6">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-800 font-medium transition-colors"
        >
          ← Back to Home
        </Link>
      </div>
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
          Interactive Map - Area Selector
        </h1>
        <p className="text-lg text-purple-700 font-medium">
          Draw a polygon or rectangle to get coordinates
        </p>
      </div>
      <InteractiveMap />
    </main>
  )
}

