'use client';

import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface ColorbarProps {
  colors: string[];
  minDisplay: number;
  maxDisplay: number;
  medianDisplay: number;
}

export default function Colorbar({ colors, minDisplay, maxDisplay, medianDisplay }: ColorbarProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !colors) return;

    // Clear existing
    d3.select(containerRef.current).select('svg').remove();

    const svg = d3
      .select(containerRef.current)
      .append('svg')
      .attr('width', '200')
      .attr('height', '40')
      .append('g');

    const legend = svg
      .selectAll('.legend')
      .data(colors)
      .enter()
      .append('g')
      .attr('transform', (d: any, i: number) => `translate(${30 + i * 25}, 0)`);

    legend
      .append('rect')
      .attr('width', 25)
      .attr('height', 25)
      .style('fill', (d: any, i: number) => colors[i]);

    legend
      .append('text')
      .attr('y', 35)
      .attr('text-anchor', (d: any, i: number) => {
        if (i === 0) return 'middle';
        if (i === 3) return 'start';
        if (i === 5) return 'end';
        return 'middle';
      })
      .text((d: any, i: number) => {
        if (i === 0) return `< ${minDisplay}`;
        if (i === 3) return medianDisplay.toString();
        if (i === 5) return `> ${maxDisplay}`;
        return '';
      });
  }, [colors, minDisplay, maxDisplay, medianDisplay]);

  return <div ref={containerRef} id="color-bar-svg" className="mt-4" />;
}

