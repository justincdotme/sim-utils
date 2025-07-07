import React, { useState, useEffect } from 'react';
import { Paper, Box, Typography, Grid, TextField } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { blueIcon } from '@/constants/theme.js';

export default function ETACalculator() {
  const [distanceToGo, setDistanceToGo] = useState('');
  const [groundSpeed, setGroundSpeed] = useState('');
  const [eta, setEta] = useState('');

  useEffect(() => {
    const dist = parseFloat(distanceToGo);
    const gs = parseFloat(groundSpeed);

    if (dist > 0 && gs > 0) {
      const hours = dist / gs;
      const totalMinutes = Math.round(hours * 60);
      const h = Math.floor(totalMinutes / 60);
      const m = totalMinutes % 60;
      setEta(`${h}h ${m.toString().padStart(2, '0')}m`);
    } else {
      setEta('');
    }
  }, [distanceToGo, groundSpeed]);

  return (
    <Paper elevation={3} sx={{ p: 3, mt: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h5" component="h2">
          ETA Calculator
        </Typography>
        <AccessTimeIcon fontSize="large" sx={blueIcon} />
      </Box>

      <Grid container spacing={2}>
        <Grid item xs={6}>
          <TextField
            label="Distance To Go (NM)"
            type="number"
            value={distanceToGo}
            onChange={(e) => setDistanceToGo(e.target.value)}
            fullWidth
          />
        </Grid>

        <Grid item xs={6}>
          <TextField
            label="Groundspeed (knots)"
            type="number"
            value={groundSpeed}
            onChange={(e) => setGroundSpeed(e.target.value)}
            fullWidth
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            label="ETA"
            value={eta}
            InputProps={{ readOnly: true }}
            fullWidth
            disabled
          />
        </Grid>
      </Grid>
    </Paper>
  );
}
