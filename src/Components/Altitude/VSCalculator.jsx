import React, { useState, useEffect, useRef } from 'react';
import { TextField, Grid, Box } from '@mui/material';
import { blueIcon } from '@/constants/theme.js';


export default function VSCalculator({ onValidData, isClimb, isDescent }) {
  const [currentAlt, setCurrentAlt] = useState('');
  const [nextAlt, setNextAlt] = useState('');
  const [distanceToGo, setDistanceToGo] = useState('');
  const [groundSpeed, setGroundSpeed] = useState('');
  const [verticalSpeed, setVerticalSpeed] = useState('');
  const [altChangeAngle, setAltChangeAngle] = useState('');
  const [error, setError] = useState('');

  const lastSentData = useRef(null);

  const isValidNumber = (n) => typeof n === 'number' && !isNaN(n);

  const calculate = () => {
    const curAlt = parseFloat(currentAlt);
    const tgtAlt = parseFloat(nextAlt);
    const dist = parseFloat(distanceToGo);
    const gs = parseFloat(groundSpeed);

    // Validate inputs
    if (
      !isValidNumber(curAlt) ||
      !isValidNumber(tgtAlt) ||
      !isValidNumber(dist) ||
      !isValidNumber(gs) ||
      dist <= 0 ||
      gs <= 0
    ) {
      setVerticalSpeed('');
      setAltChangeAngle('');
      setError('');
      if (lastSentData.current !== null) {
        lastSentData.current = null;
        onValidData && onValidData(null);
      }
      return;
    }

    setError('');

    const climb = curAlt < tgtAlt;
    const descent = curAlt > tgtAlt;
    const altDiff = Math.abs(curAlt - tgtAlt);

    // Vertical Speed = altitude difference divided by time in minutes (distance/groundspeed)
    const vs = (altDiff / dist) * (gs / 60);

    // Angle in radians = atan(altDiff / distance in feet)
    const angleRad = Math.atan(altDiff / (dist * 6076.12));
    const angleDeg = angleRad * (180 / Math.PI);

    // Determine sign prefix
    const sign = climb ? '+' : descent ? '−' : '';

    setVerticalSpeed(sign + vs.toFixed(0));
    setAltChangeAngle(sign + angleDeg.toFixed(2));

    const newData = {
      curAlt,
      tgtAlt,
      dist,
      gs,
      vs: climb ? vs : -vs,                 // positive VS if climb, negative if descent
      altChangeAngle: climb ? angleDeg : -angleDeg,  // signed angle
    };

    const last = lastSentData.current;
    if (
      !last ||
      last.curAlt !== newData.curAlt ||
      last.tgtAlt !== newData.tgtAlt ||
      last.dist !== newData.dist ||
      last.gs !== newData.gs ||
      last.vs !== newData.vs ||
      last.altChangeAngle !== newData.altChangeAngle
    ) {
      lastSentData.current = newData;
      onValidData && onValidData(newData);
    }
  };

  useEffect(() => {
    calculate();
  }, [currentAlt, nextAlt, distanceToGo, groundSpeed]);

  return (
    <Grid container spacing={2}>
      <Grid item xs={6}>
        <TextField
          label="Current Altitude (ft)"
          type="number"
          value={currentAlt}
          onChange={(e) => setCurrentAlt(e.target.value)}
          fullWidth
        />
      </Grid>
      <Grid item xs={6}>
        <TextField
          label="Target Altitude (ft)"
          type="number"
          value={nextAlt}
          onChange={(e) => setNextAlt(e.target.value)}
          fullWidth
        />
      </Grid>
      <Grid item xs={6}>
        <TextField
          label="Distance to Go (NM)"
          type="number"
          value={distanceToGo}
          onChange={(e) => setDistanceToGo(e.target.value)}
          fullWidth
        />
      </Grid>
      <Grid item xs={6}>
        <TextField
          label="Ground Speed (knots)"
          type="number"
          value={groundSpeed}
          onChange={(e) => setGroundSpeed(e.target.value)}
          fullWidth
        />
      </Grid>
      {error && (
        <Grid item xs={12}>
          <Box mt={1} color="error.main">
            {error}
          </Box>
        </Grid>
      )}
      <Grid item xs={6}>
        <TextField
          label="Required V/S (ft/min)"
          value={verticalSpeed}
          InputProps={{ readOnly: true }}
          fullWidth
        />
      </Grid>
      <Grid item xs={6}>
        <TextField
          label="Altitude Change Angle (°)"
          value={altChangeAngle}
          InputProps={{ readOnly: true }}
          fullWidth
        />
      </Grid>
    </Grid>
  );
}
