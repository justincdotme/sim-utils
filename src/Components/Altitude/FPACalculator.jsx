import React, { useState, useEffect, useRef } from 'react';
import { TextField, Grid, InputAdornment } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

export default function FPACalculator({ onValidData }) {
  const [currentAlt, setCurrentAlt] = useState('');
  const [distanceToGo, setDistanceToGo] = useState('');
  const [descentAngle, setDescentAngle] = useState('');
  const [groundSpeed, setGroundSpeed] = useState('');
  const [endingAlt, setEndingAlt] = useState('');
  const [vspeed, setVspeed] = useState('');
  const [error, setError] = useState('');
  const [isEndingAltNegative, setIsEndingAltNegative] = useState(false);
  const [sign, setSign] = useState(''); // added sign state
  const [signedAngle, setSignedAngle] = useState(null); // added signedAngle state

  const lastSentData = useRef(null);

  const calculate = () => {
    const curAlt = parseFloat(currentAlt);
    const dist = parseFloat(distanceToGo);
    const angle = parseFloat(descentAngle);
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
      setSign('');
      setSignedAngle(null);
      if (lastSentData.current !== null) {
        lastSentData.current = null;
        onValidData && onValidData(null);
      }
      return;
    }

    setError('');

    const distanceFeet = dist * 6076.12;
    const verticalDistance = Math.tan((angle * Math.PI) / 180) * distanceFeet;

    const assumedEndAltClimb = curAlt + verticalDistance;
    const assumedEndAltDescent = curAlt - verticalDistance;

    const isClimb = assumedEndAltClimb > curAlt;
    const isDescent = assumedEndAltDescent < curAlt;

    let finalAlt, vs;
    if (isClimb) {
      finalAlt = assumedEndAltClimb;
      vs = (verticalDistance / distanceFeet) * (gs * 6076.12 / 60);
      setSign('+');
      setSignedAngle(angle);
    } else {
      finalAlt = assumedEndAltDescent;
      vs = -((verticalDistance / distanceFeet) * (gs * 6076.12 / 60));
      setSign('−');
      setSignedAngle(-angle);
    }

    setIsEndingAltNegative(finalAlt < 0);
    setEndingAlt(finalAlt.toFixed(0));
    setVspeed(sign + vs.toFixed(0)); // use latest sign state here for consistency

    const newData = {
      curAlt,
      dist,
      descentAngle: signedAngle,
      gs: gs > 0 ? gs : null,
      vs,
      endAlt: finalAlt,
    };

    if (JSON.stringify(newData) !== JSON.stringify(lastSentData.current)) {
      lastSentData.current = newData;
      onValidData && onValidData(newData);
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
          label="Descent Angle (°)"
          type="number"
          value={descentAngle}
          onChange={(e) => setDescentAngle(e.target.value)}
          fullWidth
          InputProps={{
            startAdornment: sign ? <InputAdornment position="start">{sign}</InputAdornment> : null,
          }}
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
          value={sign + vspeed.replace(/^\+|−/, '')} // ensure no duplicate sign
          InputProps={{ readOnly: true }}
          fullWidth
        />
      </Grid>
    </Grid>
  );
}
