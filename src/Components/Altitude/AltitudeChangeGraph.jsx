import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts';
import { Box } from '@mui/material';

function niceIncrement(maxValue, ticks) {
  if (maxValue === 0) return 1;
  const rough = maxValue / ticks;
  const magnitude = Math.pow(10, Math.floor(Math.log10(rough)));
  const residual = rough / magnitude;
  if (residual > 5) return 10 * magnitude;
  if (residual > 2) return 5 * magnitude;
  if (residual > 1) return 2 * magnitude;
  return magnitude;
}

export default function AltitudeChangeGraph({ data, xTicks = 10, yTicks = 10 }) {
  if (!data || !data.curAlt || (data.tgtAlt === undefined && data.endAlt === undefined)) {
    return null;
  }

  // Determine start and end altitude
  const startAlt = data.curAlt;
  const endAlt = data.tgtAlt !== undefined ? data.tgtAlt : data.endAlt;

  // Determine distance to go
  const dist = data.dist;

  if (dist <= 0) return null;

  // Determine max altitude for Y axis (highest of start or end)
  const maxAlt = Math.max(startAlt, endAlt);

  // Calculate increments
  const yInc = niceIncrement(maxAlt, yTicks);
  const xInc = niceIncrement(dist, xTicks);

  const steps = 10;
  const distanceStep = dist / steps;

  // Linear interpolation of altitude at each step (no curve)
  const points = Array.from({ length: steps + 1 }, (_, i) => {
    const distance = i * distanceStep;
    const altitude = startAlt + ((endAlt - startAlt) * (i / steps));
    return { distance, altitude };
  });

  return (
    <Box
      sx={{
        mt: 4,
        p: 2,
        backgroundColor: '#f5f5f5',
        borderRadius: 2,
        boxShadow: 1,
        height: 300,
      }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={points} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="distance"
            type="number"
            domain={[0, dist]}
            ticks={Array.from({ length: xTicks + 1 }, (_, i) => i * xInc)}
            label={{ value: 'Distance (NM)', position: 'insideBottomRight', offset: -10 }}
          />
          <YAxis
            domain={[0, Math.ceil(maxAlt / yInc) * yInc]}
            ticks={Array.from({ length: yTicks + 1 }, (_, i) => i * yInc)}
            label={{ value: 'Altitude (ft)', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip />
          <Legend />
          <Line
            type="linear"
            dataKey="altitude"
            stroke="#1976d2"
            strokeWidth={2}
            dot={{ r: 3 }}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
}
