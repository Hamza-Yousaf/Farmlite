import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Interactive Map - Leaflet Draw',
  description: 'Select areas on the map using polygon or rectangle tools',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

