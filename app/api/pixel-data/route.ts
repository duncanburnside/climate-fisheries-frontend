import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';

// Helper to get data directory path
function getDataDir(): string {
  if (process.env.DATA_DIR) {
    return process.env.DATA_DIR;
  }
  
  const projectRoot = process.cwd();
  const possiblePaths = [
    join(projectRoot, '..', 'backend', 'Data'),
    join(projectRoot, '..', 'Data'),
    join(projectRoot, 'data'),
    join(projectRoot, 'public', 'data'),
  ];
  
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

    if (!indicator || !climate || !period) {
      return NextResponse.json(
        { error: 'Missing required parameters: indicator, climate, period' },
        { status: 400 }
      );
    }

    // Map indicator name if needed
    const mappedIndicator = indicatorMapping[indicator] || indicator;

    // Build file path
    const dataDir = getDataDir();
    const filename = join(dataDir, 'PIXEL', mappedIndicator, climate, `${period}.json`);

    try {
      // Read and parse JSON file (this is the full array)
      const fileContents = await readFile(filename, 'utf-8');
      const pixelJson = JSON.parse(fileContents);

      // Return the full array
      return NextResponse.json(pixelJson);
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        return NextResponse.json(
          { error: `File not found: ${filename}` },
          { status: 404 }
        );
      }
      if (error instanceof SyntaxError) {
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

