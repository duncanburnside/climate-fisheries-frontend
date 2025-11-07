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
    const indicator = searchParams.get('indicator');
    const climate = searchParams.get('climate');
    const period = searchParams.get('period');
    const latitude = searchParams.get('latitude');
    const longitude = searchParams.get('longitude');

    if (!indicator || !climate || !period || !latitude || !longitude) {
      return NextResponse.json(
        { error: 'Missing required parameters: indicator, climate, period, latitude, longitude' },
        { status: 400 }
      );
    }

    // Map indicator name if needed
    const mappedIndicator = indicatorMapping[indicator] || indicator;

    // Calculate pixel index (same logic as Python)
    const latIndex = (parseFloat(latitude) + 179.75) / 0.5;
    const longIndex = (parseFloat(longitude) + 89.75) / 0.5;
    const index = Math.floor((latIndex * 360) + longIndex);

    // Build file path
    const dataDir = await getDataDir();
    const filename = join(dataDir, 'PIXEL', mappedIndicator, climate, `${period}.json`);

    try {
      // Read and parse JSON file
      const fileContents = await readFile(filename, 'utf-8');
      const pixelJson = JSON.parse(fileContents);

      // Preprocessing outputs an array, not a dict
      let data: any = {};
      if (index < pixelJson.length && pixelJson[index] !== null) {
        data = pixelJson[index];
      }

      return NextResponse.json(data);
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        // File not found
        return NextResponse.json(
          { error: `File not found: ${filename}` },
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

