import React, { useState, useEffect, useRef } from 'react';
import { TextField, Grid, InputAdornment } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

export default function FPACalculator({ onValidData }) {
  const [currentAlt, setCurrentAlt] = useState('');
  const [distanceToGo, setDistanceToGo] = useState('');
  const [inputAngle, setInputAngle] = useState(''); // renamed from descentAngle
  const [groundSpeed, setGroundSpeed] = useState('');
  const [endingAlt, setEndingAlt] = useState('');
  const [vspeed, setVspeed] = useState('');
  const [error, setError] = useState('');
  const [isEndingAltNegative, setIsEndingAltNegative] = useState(false);

  const lastSentData = useRef(null);

  const calculate = () => {
    const curAlt = parseFloat(currentAlt);
    const dist = parseFloat(distanceToGo);
    let angle = parseFloat(inputAngle);
    const gs = parseFloat(groundSpeed);

    if (
      isNaN(curAlt) ||
      isNaN(dist) ||
      isNaN(angle) ||
      dist <= 0 ||
      curAlt <= 0
    ) {
      setEndingAlt('');
      setVspeed('');
      setError('');
      setIsEndingAltNegative(false);
      if (lastSentData.current !== null) {
        lastSentData.current = null;
        onValidData && onValidData(null);
      }
      return;
    }

    setError('');

    // Treat angle as signed; if inputAngle is positive treat as climb, else descent
    // If angle is 0 or NaN, treat as climb by default
    const isClimb = angle >= 0;
    if (!isClimb) angle = Math.abs(angle); // use absolute for calculation

    const distanceFeet = dist * 6076.12;
    const verticalDistance = Math.tan((angle * Math.PI) / 180) * distanceFeet;

    // Calculate final altitude based on climb or descent
    const finalAlt = isClimb ? curAlt + verticalDistance : curAlt - verticalDistance;

    setIsEndingAltNegative(finalAlt < 0);
    setEndingAlt(finalAlt.toFixed(0));

    // Calculate vertical speed if ground speed valid and > 0, else empty
    let vs = '';
    if (!isNaN(gs) && gs > 0) {
      vs = (verticalDistance / distanceFeet) * (gs * 6076.12 / 60);
      vs = isClimb ? vs : -vs;
      setVspeed((vs > 0 ? '+' : '−') + Math.abs(vs).toFixed(0));
    } else {
      setVspeed('');
    }

    const newData = {
      curAlt,
      dist,
      altChangeAngle: isClimb ? angle : -angle,
      gs: gs > 0 ? gs : null,
      vs: vs === '' ? null : vs,
      endAlt: finalAlt,
    };

    if (JSON.stringify(newData) !== JSON.stringify(lastSentData.current)) {
      lastSentData.current = newData;
      onValidData && onValidData(newData);
    }
  };

  React.useEffect(() => {
    calculate();
  }, [currentAlt, distanceToGo, inputAngle, groundSpeed]);

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
          label="Distance to Go (NM)"
          type="number"
          value={distanceToGo}
          onChange={(e) => setDistanceToGo(e.target.value)}
          fullWidth
        />
      </Grid>
      <Grid item xs={6}>
        <TextField
          label="Altitude Change Angle (°)"
          type="number"
          value={inputAngle}
          onChange={(e) => setInputAngle(e.target.value)}
          fullWidth
          InputProps={{
            startAdornment:
              inputAngle && !isNaN(parseFloat(inputAngle)) ? (
                <InputAdornment position="start">
                  {parseFloat(inputAngle) >= 0 ? '+' : '−'}
                </InputAdornment>
              ) : null,
          }}
        />
      </Grid>
      <Grid item xs={6}>
        <TextField
          label="Ground Speed (knots) (optional)"
          type="number"
          value={groundSpeed}
          onChange={(e) => setGroundSpeed(e.target.value)}
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
