# Beta Features

This folder contains experimental features that are separate from the main application.

## 3D Globe Visualization (`/beta/globe`)

A proof-of-concept implementation using [globe.gl](https://globe.gl/) to visualize climate data on a 3D interactive globe.

### Features

- **PNG Texture Overlay**: Uses the existing equirectangular PNG images (4000x2000) as textures on the globe
- **Interactive Controls**: Select indicator, climate scenario, and period
- **3D Navigation**: Rotate, zoom, and pan the globe with mouse/touch

### Access

Navigate to `/beta/globe` in your browser to view the 3D globe visualization.

### Future Enhancements

- Point-based data visualization using pixel JSON data
- Heatmap overlay using converted pixel data
- Hexagonal aggregation for performance optimization
- Animation between time periods
- Comparison mode (side-by-side scenarios)

### Technical Details

- Uses `globe.gl` library built on Three.js
- PNG images are in equirectangular projection (compatible with globe.gl)
- Pixel data can be converted using `GlobeDataService` in `lib/services/beta/globe-data.service.ts`

### Performance Considerations

- Full pixel data (259,200 points) may be too heavy for real-time rendering
- Consider sampling or aggregation for point-based visualizations
- PNG texture overlay is efficient and recommended for initial implementation

