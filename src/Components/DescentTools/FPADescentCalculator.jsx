import React, { useState, useEffect } from 'react';
import { TextField, Grid, InputAdornment } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

export default function FPADescentCalculator() {
  const [currentAlt, setCurrentAlt] = useState('');
  const [distanceToGo, setDistanceToGo] = useState('');
  const [descentAngle, setDescentAngle] = useState('');
  const [groundSpeed, setGroundSpeed] = useState('');
  const [endingAlt, setEndingAlt] = useState('');
  const [vspeed, setVspeed] = useState('');
  const [error, setError] = useState('');
  const [isEndingAltNegative, setIsEndingAltNegative] = useState(false);

  const calculate = () => {
    const curAlt = parseFloat(currentAlt);
    const dist = parseFloat(distanceToGo);
    const angle = parseFloat(descentAngle);
    const gs = parseFloat(groundSpeed);

    if (isNaN(curAlt) || isNaN(dist) || isNaN(angle) || dist <= 0 || curAlt <= 0) {
      setEndingAlt('');
      setVspeed('');
      setError('');
      setIsEndingAltNegative(false);
      return;
    }

    setError('');

    const distanceFeet = dist * 6076.12;
    const descentFeet = Math.tan((angle * Math.PI) / 180) * distanceFeet;
    const finalAlt = curAlt - descentFeet;

    setIsEndingAltNegative(finalAlt < 0);
    setEndingAlt(finalAlt.toFixed(0));

    if (!isNaN(gs) && gs > 0) {
      const vs = (descentFeet / distanceFeet) * (gs * 6076.12 / 60);
      setVspeed(vs.toFixed(0));
    } else {
      setVspeed('---');
    }
  };

  useEffect(() => {
    calculate();
  }, [currentAlt, distanceToGo, descentAngle, groundSpeed]);

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
          label="Distance to Go (NM)"
          type="number"
          value={distanceToGo}
          onChange={e => setDistanceToGo(e.target.value)}
          fullWidth
        />
      </Grid>
      <Grid item xs={6}>
        <TextField
          label="Descent Angle (°)"
          type="number"
          value={descentAngle}
          onChange={e => setDescentAngle(e.target.value)}
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
      <Grid item xs={6}>
        <TextField
          label="Ending Altitude (ft)"
          value={endingAlt}
          InputProps={{
            readOnly: true,
            endAdornment: isEndingAltNegative ? (
              <InputAdornment position="end">
                <ErrorOutlineIcon color="error" />
              </InputAdornment>
            ) : null,
          }}
          error={isEndingAltNegative}
          fullWidth
        />
      </Grid>
      <Grid item xs={6}>
        <TextField
          label="Required V/S (ft/min)"
          value={vspeed}
          InputProps={{ readOnly: true }}
          fullWidth
        />
      </Grid>
    </Grid>
  );
}
