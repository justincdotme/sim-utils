import React, { useState, useEffect } from 'react';
import { TextField, Grid, Box } from '@mui/material';

export default function VSDescentCalculator() {
  const [currentAlt, setCurrentAlt] = useState('');
  const [nextAlt, setNextAlt] = useState('');
  const [distanceToGo, setDistanceToGo] = useState('');
  const [groundSpeed, setGroundSpeed] = useState('');
  const [verticalSpeed, setVerticalSpeed] = useState('');
  const [descentAngle, setDescentAngle] = useState('');
  const [error, setError] = useState('');

  const calculate = () => {
    const curAlt = parseFloat(currentAlt);
    const tgtAlt = parseFloat(nextAlt);
    const dist = parseFloat(distanceToGo);
    const gs = parseFloat(groundSpeed);

    if (
      isNaN(curAlt) ||
      isNaN(tgtAlt) ||
      isNaN(dist) ||
      isNaN(gs) ||
      dist <= 0 ||
      gs <= 0
    ) {
      setVerticalSpeed('');
      setDescentAngle('');
      setError('');
      return;
    }

    if (curAlt <= tgtAlt) {
      setVerticalSpeed('');
      setDescentAngle('');
      setError('Current altitude must be higher than next altitude');
      return;
    }

    setError('');
    const altDiff = curAlt - tgtAlt;
    const vs = (altDiff / dist) * (gs / 60);
    const angleRad = Math.atan(altDiff / (dist * 6076.12));
    const angleDeg = angleRad * (180 / Math.PI);

    setVerticalSpeed(vs.toFixed(0));
    setDescentAngle(angleDeg.toFixed(2));
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
          onChange={e => setCurrentAlt(e.target.value)}
          fullWidth
        />
      </Grid>
      <Grid item xs={6}>
        <TextField
          label="Target Altitude (ft)"
          type="number"
          value={nextAlt}
          onChange={e => setNextAlt(e.target.value)}
          fullWidth
        />
      </Grid>
      <Grid item xs={6}>
        <TextField
          label="Distance to Go (NM)"
          type="number"
          value={distanceToGo}
          onChange={e => setDistanceToGo(e.target.value)}
          fullWidth
        />
      </Grid>
      <Grid item xs={6}>
        <TextField
          label="Ground Speed (knots)"
          type="number"
          value={groundSpeed}
          onChange={e => setGroundSpeed(e.target.value)}
          fullWidth
        />
      </Grid>
      {error && (
        <Grid item xs={12}>
          <Box mt={1} color="error.main">{error}</Box>
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
          label="Descent Angle (°)"
          value={descentAngle}
          InputProps={{ readOnly: true }}
          fullWidth
        />
      </Grid>
    </Grid>
  );
}
