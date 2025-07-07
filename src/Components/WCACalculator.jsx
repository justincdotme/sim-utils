import React, { useState, useEffect } from 'react';
import { Paper, Box, Typography, TextField, Grid } from '@mui/material';
import AirIcon from '@mui/icons-material/Air';
import { blueIcon } from '@/constants/theme.js';

export default function WCACalculator() {
  const [course, setCourse] = useState('');
  const [windDir, setWindDir] = useState('');
  const [windSpeed, setWindSpeed] = useState('');
  const [trueAirspeed, setTrueAirspeed] = useState('');
  const [wca, setWca] = useState('');

  useEffect(() => {
    const C = parseFloat(course);
    const Wd = parseFloat(windDir);
    const Ws = parseFloat(windSpeed);
    const Tas = parseFloat(trueAirspeed);

    if (isNaN(C) || isNaN(Wd) || isNaN(Ws) || isNaN(Tas) || Tas <= 0) {
      setWca('');
      return;
    }

    // Convert degrees to radians
    const windAngleRad = ((Wd - C) * Math.PI) / 180;
    const crosswind = Ws * Math.sin(windAngleRad);

    // WCA in degrees
    const wcaDeg = Math.atan2(crosswind, Tas) * (180 / Math.PI);
    setWca(wcaDeg.toFixed(1));
  }, [course, windDir, windSpeed, trueAirspeed]);

  return (
    <Paper elevation={3} sx={{ p: 3, mt: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h6">Wind Correction Angle (WCA)</Typography>
        <AirIcon fontSize="large" sx={blueIcon} />
      </Box>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <TextField
            label="Desired Course (°)"
            type="number"
            value={course}
            onChange={(e) => setCourse(e.target.value)}
            fullWidth
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Wind Direction (°)"
            type="number"
            value={windDir}
            onChange={(e) => setWindDir(e.target.value)}
            fullWidth
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Wind Speed (kts)"
            type="number"
            value={windSpeed}
            onChange={(e) => setWindSpeed(e.target.value)}
            fullWidth
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="True Airspeed (kts)"
            type="number"
            value={trueAirspeed}
            onChange={(e) => setTrueAirspeed(e.target.value)}
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="WCA (°)"
            value={wca}
            InputProps={{ readOnly: true }}
            fullWidth
          />
        </Grid>
      </Grid>
    </Paper>
  );
}
