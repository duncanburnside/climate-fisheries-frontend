import { NextRequest, NextResponse } from 'next/server';
import { readFile, access } from 'fs/promises';
import { join } from 'path';
import { constants } from 'fs';

// Helper to get data directory path
async function getDataDir(): Promise<string> {
  // Check for environment variable first (for Vercel or custom deployments)
  if (process.env.DATA_DIR) {
    return process.env.DATA_DIR;
  }
  
  const projectRoot = process.cwd();
  
  // Try multiple possible locations:
  // 1. Backend directory (development) - correct path for this project
  // 2. Data directory in project root
  // 3. Data directory in frontend (if copied)
  const possiblePaths = [
    join(projectRoot, '..', 'climate-fisheries-backend', 'Data'),
    join(projectRoot, '..', 'backend', 'Data'),
    join(projectRoot, '..', 'Data'),
    join(projectRoot, 'data'),
    join(projectRoot, 'public', 'data'),
  ];
  
  // Try to find the first path that exists
  for (const path of possiblePaths) {
    try {
      await access(path, constants.F_OK);
      return path;
    } catch {
      // Path doesn't exist, try next one
      continue;
    }
  }
  
  // Return the first path as fallback (will fail with proper error message)
  return possiblePaths[0];
}

// Map frontend indicator names to backend directory names
const indicatorMapping: Record<string, string> = {
  'SBOT': 'SBT',
};

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const model = searchParams.get('model');
    const indicator = searchParams.get('indicator');
    const climate = searchParams.get('climate');
    const zoneId = searchParams.get('id');
    const period = searchParams.get('period');

    if (!model || !indicator || !climate || !zoneId || !period) {
      return NextResponse.json(
        { error: 'Missing required parameters: model, indicator, climate, id, period' },
        { status: 400 }
      );
    }

    // Map indicator name if needed
    const mappedIndicator = indicatorMapping[indicator] || indicator;

    // Build file path
    const dataDir = await getDataDir();
    const filename = join(dataDir, 'MODEL', model, mappedIndicator, climate, `${zoneId}.json`);

    try {
      // Read and parse JSON file
      const fileContents = await readFile(filename, 'utf-8');
      const data = JSON.parse(fileContents);

      if (!(period in data)) {
        return NextResponse.json(
          { error: `Period '${period}' not found in data` },
          { status: 400 }
        );
      }

      // Handle different data structures:
      // NPP files have: {"present": [mean, min, max], ...}
      // SST files have: {"present": value, ...}
      const periodData = data[period];
      let ret: any;

      if (Array.isArray(periodData) && periodData.length >= 3) {
        // NPP format: array with [mean, min, max]
        ret = {
          mean: periodData[0],
          min: periodData[1],
          max: periodData[2],
          years: data.years,
        };
      } else if (typeof periodData === 'number') {
        // SST format: single value (mean)
        ret = {
          mean: periodData,
          min: null,
          max: null,
          years: data.years,
        };
      } else {
        return NextResponse.json(
          { error: `Unexpected data format for period '${period}'` },
          { status: 500 }
        );
      }

      // Try to load chart data, but make it optional
      const chartFilename = join(dataDir, 'ZONECHART', model, `${mappedIndicator}.json`);
      try {
        const chartContents = await readFile(chartFilename, 'utf-8');
        const chart = JSON.parse(chartContents);
        if (zoneId in chart) {
          ret.chart = chart[zoneId];
        }
      } catch (error) {
        // Chart data is optional, so we continue without it
      }

      return NextResponse.json(ret);
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        // File not found
        return NextResponse.json(
          {
            error: `File not found: ${filename}`,
            absolute_path: filename,
            request_params: {
              model,
              indicator: mappedIndicator,
              climate,
              id: zoneId,
              period,
            },
          },
          { status: 404 }
        );
      }
      if (error instanceof SyntaxError) {
        // Invalid JSON
        return NextResponse.json(
          { error: `Invalid JSON in file: ${filename}` },
          { status: 500 }
        );
      }
      throw error;
    }
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

