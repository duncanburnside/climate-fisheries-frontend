# Climate-Fisheries Scripts

This directory contains scripts and configuration files for the Climate-Fisheries application.

## Current Files

### Zone ID Files
These files contain zone IDs and metadata extracted from GeoJSON files:

- `zone-ids-FAO.json` - FAO fishing areas zone IDs
- `zone-ids-LME.json` - Large Marine Ecosystems zone IDs
- `zone-ids-EEZ.json` - Exclusive Economic Zones zone IDs
- `zone-ids-BGCP.json` - Biogeochemical Provinces zone IDs
- `zone-ids-summary.json` - Combined summary of all zones
- `zone-ids.csv` - CSV export of zone IDs

### Utility Scripts
- `check-progress.sh` - Utility script for checking progress

## Data Processing

Climate data preprocessing is handled by the `OceanVizPreprocess-master` directory at the project root. See that directory for preprocessing scripts.

## Data Structure

The processed climate data (`nc/` directory) is organized by variable:
- `nc/tos/` - Sea Surface Temperature
- `nc/thetao/` - Sea Water Potential Temperature
- `nc/o2/` - Dissolved Oxygen
- `nc/ph/` - pH
- `nc/intpp/` - Integrated Primary Production

Each variable contains 67 files covering:
- Historical (29 files): 1861-2005
- RCP 2.6 (19 files): 2006-2100
- RCP 8.5 (19 files): 2006-2100

## Next Steps

### Data Processing Pipeline

1. **Convert .nc files to CSV format** (required first step)
   - The preprocessing script expects CSV files, not .nc files directly
   - Convert .nc files from `nc/` directory to CSV format matching expected structure
   - CSV files should be placed in `Data/` subdirectories:
     - `Data/{MODEL}_GFDL_MODEL/` - Zone-specific CSV files
     - `Data/PIXEL_GFDL_AVERAGE_MODEL/` - Pixel-level CSV files
     - `Data/BASIC_RASTER/` - Raster CSV files for zone mapping

2. **Run preprocessing script**
   ```bash
   cd OceanVizPreprocess-master
   python3 createData.py
   ```

3. **Output JSON files**
   - Generated JSON files will be in `OceanVizPreprocess-master/OutputData/`
   - These JSON files can then be used by the NextJS web UI map

See `Data/README.md` for detailed information about the expected CSV format and directory structure.
