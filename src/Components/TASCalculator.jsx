import React, { useState, useEffect } from 'react';
import { Paper, Box, Typography, TextField, Grid } from '@mui/material';
import SpeedIcon from '@mui/icons-material/Speed';
import { blueIcon } from '@/constants/theme.js';

export default function TASCalculator() {
  const [ias, setIas] = useState('');
  const [pressureAlt, setPressureAlt] = useState('');
  const [oat, setOat] = useState('');
  const [tas, setTas] = useState('');

  useEffect(() => {
    const IAS = parseFloat(ias);
    const PA = parseFloat(pressureAlt);
    const OAT = parseFloat(oat);

    if (isNaN(IAS) || isNaN(PA) || isNaN(OAT)) {
      setTas('');
      return;
    }

    const standardTemp = 15 - (2 * PA) / 1000;
    const tasCalc = IAS * Math.sqrt((OAT + 273.15) / (standardTemp + 273.15));
    setTas(tasCalc.toFixed(0));
  }, [ias, pressureAlt, oat]);

  return (
    <Paper elevation={3} sx={{ p: 3, mt: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h6">True Airspeed Calculator</Typography>
        <SpeedIcon fontSize="large" sx={blueIcon} />
      </Box>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <TextField
            label="Indicated Airspeed (IAS)"
            type="number"
            value={ias}
            onChange={(e) => setIas(e.target.value)}
            fullWidth
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Pressure Altitude (ft)"
            type="number"
            value={pressureAlt}
            onChange={(e) => setPressureAlt(e.target.value)}
            fullWidth
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Outside Air Temp (°C)"
            type="number"
            value={oat}
            onChange={(e) => setOat(e.target.value)}
            fullWidth
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="True Airspeed (TAS)"
            value={tas}
            InputProps={{ readOnly: true }}
            fullWidth
          />
        </Grid>
      </Grid>
    </Paper>
  );
}
