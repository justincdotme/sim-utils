import React, { useState, useEffect, useRef } from 'react';
import { TextField, Grid, Box } from '@mui/material';

export default function VSDescentCalculator({ onValidData }) {
  const [currentAlt, setCurrentAlt] = useState('');
  const [nextAlt, setNextAlt] = useState('');
  const [distanceToGo, setDistanceToGo] = useState('');
  const [groundSpeed, setGroundSpeed] = useState('');
  const [verticalSpeed, setVerticalSpeed] = useState('');
  const [descentAngle, setDescentAngle] = useState('');
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
      setDescentAngle('');
      setError('');
      // Only call onValidData(null) if previous was not null
      if (lastSentData.current !== null) {
        lastSentData.current = null;
        onValidData && onValidData(null);
      }
      return;
    }

    if (curAlt <= tgtAlt) {
      setVerticalSpeed('');
      setDescentAngle('');
      setError('Current altitude must be higher than target altitude');
      if (lastSentData.current !== null) {
        lastSentData.current = null;
        onValidData && onValidData(null);
      }
      return;
    }

    setError('');
    const altDiff = curAlt - tgtAlt;
    const vs = (altDiff / dist) * (gs / 60);
    const angleRad = Math.atan(altDiff / (dist * 6076.12));
    const angleDeg = angleRad * (180 / Math.PI);

    setVerticalSpeed(vs.toFixed(0));
    setDescentAngle(angleDeg.toFixed(2));

    // Compose new data ensuring all are numbers and no NaNs
    const newData = {
      curAlt,
      dist,
      gs,
      vs,
      descentAngle: angleDeg,
    };

    // Compare previous and new data deeply (only simple props)
    const last = lastSentData.current;
    if (
      !last ||
      last.curAlt !== newData.curAlt ||
      last.dist !== newData.dist ||
      last.gs !== newData.gs ||
      last.vs !== newData.vs ||
      last.descentAngle !== newData.descentAngle
    ) {
      lastSentData.current = newData;
      onValidData && onValidData(newData);
    }
  };

  useEffect(() => {
    calculate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
          label="Descent Angle (°)"
          value={descentAngle}
          InputProps={{ readOnly: true }}
          fullWidth
        />
      </Grid>
    </Grid>
  );
}
