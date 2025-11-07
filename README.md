# Interactive Map - Leaflet Draw

An interactive map component built with Next.js, Leaflet, and leaflet-draw that allows users to select areas of land (polygon or rectangle) and displays the coordinates.

## Features

- 🗺️ Interactive map centered on Toronto, Canada
- ✏️ Draw polygons and rectangles using leaflet-draw tools
- 📍 Display coordinates of selected areas
- 🎨 Clean, modern UI with rounded containers
- 📱 Responsive design (80vh height, full width)
- 🔍 Zoom controls and map navigation

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Install dependencies:

```bash
npm install
# or
yarn install
```

2. Run the development server:

```bash
npm run dev
# or
yarn dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. **Draw a Shape**: Click on the polygon or rectangle tool in the top-right corner of the map
2. **Draw on Map**: Click and drag to draw a rectangle, or click multiple points to draw a polygon
3. **View Coordinates**: Once you finish drawing, the coordinates will be displayed below the map and logged to the console
4. **Edit/Delete**: Use the edit tools to modify or remove drawn shapes

## Project Structure

```
.
├── app/
│   ├── components/
│   │   └── InteractiveMap.tsx    # Main map component
│   ├── types/
│   │   └── leaflet-draw.d.ts     # TypeScript type definitions
│   ├── globals.css                # Tailwind directives and Leaflet CSS imports
│   ├── layout.tsx                 # Root layout
│   └── page.tsx                   # Home page
├── package.json
├── tsconfig.json
├── next.config.js
├── tailwind.config.js             # Tailwind CSS configuration
└── postcss.config.js              # PostCSS configuration
```

## Technologies Used

- **Next.js 14** - React framework with App Router
- **React 18** - UI library
- **Tailwind CSS** - Utility-first CSS framework
- **Leaflet** - Interactive maps
- **react-leaflet** - React bindings for Leaflet
- **leaflet-draw** - Drawing tools for Leaflet
- **TypeScript** - Type safety

## How It Works

The component uses:

1. **MapContainer** from react-leaflet to render the map
2. **leaflet-draw** Control.Draw to add drawing tools
3. Event listeners on `L.Draw.Event.CREATED` to capture drawn shapes
4. Coordinate extraction from polygon/rectangle layers
5. State management to display coordinates below the map

## Customization

- **Change default location**: Edit the `torontoCoords` variable in `InteractiveMap.tsx`
- **Change map style**: Modify the TileLayer URL or use a different tile provider
- **Adjust map height**: Change the `height: '80vh'` style in MapContainer
- **Customize styling**: Modify Tailwind classes in components or extend the theme in `tailwind.config.js`

## License

MIT

