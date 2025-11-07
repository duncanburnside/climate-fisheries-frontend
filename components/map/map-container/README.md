# Map Container Components

This directory contains two map implementations:

## 1. `map-container.tsx` (Current - D3.js)
- Uses D3.js for rendering
- Custom SVG-based map
- Full control over rendering and interactions
- Currently in use

## 2. `maplibre-container.tsx` (New - react-map-gl with MapLibre)
- Uses react-map-gl with MapLibre GL (open-source fork of Mapbox GL)
- WebGL-based rendering for better performance
- Built-in zoom/pan controls
- Better mobile support
- **No access token required** (open source!)

## Setup for MapLibre Container

To use the MapLibre container:

1. **No setup required!** MapLibre is open source and doesn't require any tokens.

2. **Switch to MapLibre container**:
   - Update `app/map/page.tsx` to import `MaplibreContainerComponent` instead of `MapContainerComponent`

## Features Comparison

| Feature | D3.js Container | MapLibre Container |
|---------|----------------|-------------------|
| Performance | Good | Excellent (WebGL) |
| Zoom/Pan | Custom | Built-in |
| Mobile Support | Basic | Excellent |
| GeoJSON Support | Custom | Built-in |
| PNG Overlay | Custom | Built-in (raster layer) |
| Customization | Full | Limited by MapLibre |
| Access Token | Not required | Not required (open source!) |

## Migration Notes

The MapLibre container provides:
- Better performance for large datasets
- Smoother zoom/pan interactions
- Better mobile experience
- Built-in layer management
- **No access token required** (fully open source)

Migration considerations:
- Migration of custom styling/logic
- Testing of all interactions
- May need to adjust map style for your use case

