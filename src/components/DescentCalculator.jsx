import React, { useState, useEffect } from 'react';
import { TextField, Box, Typography, Paper, Grid } from '@mui/material';
import FlightLandIcon from '@mui/icons-material/FlightLand';

//todo: Add glideslope angle calc
//todo: Calc vspeed->angle and vice versa
//todo: Add graph showing descent gradient over time, over distance (maybe)

export default function DescentCalculator() {
  const [currentAlt, setCurrentAlt] = useState('');
  const [nextAlt, setNextAlt] = useState('');
  const [distanceToGo, setDistanceToGo] = useState('');
  const [groundSpeed, setGroundSpeed] = useState('');
  const [verticalSpeed, setVerticalSpeed] = useState(null);
  const [error, setError] = useState('');

  const calculateVS = () => {
    try {
      const curAltNum = parseFloat(currentAlt);
      const nextAltNum = parseFloat(nextAlt);
      const distNum = parseFloat(distanceToGo);
      const gsNum = parseFloat(groundSpeed);

      // Input validation
      if (
        Number.isNaN(curAltNum) ||
        Number.isNaN(nextAltNum) ||
        Number.isNaN(distNum) ||
        Number.isNaN(gsNum) ||
        distNum <= 0 ||
        gsNum <= 0
      ) {
        setVerticalSpeed(null);
        setError('');
        return;
      }

      if (curAltNum <= nextAltNum) {
        setVerticalSpeed(null);
        setError('Current altitude must be higher than next altitude');
        return;
      }

      setError('');

      const altitudeToLose = curAltNum - nextAltNum;

      // VS = (Altitude to lose / distance) * groundspeed * 60
      const vs = (altitudeToLose / distanceToGo) * (groundSpeed / 60);


      setVerticalSpeed(vs.toFixed(0));
    } catch (err) {
      console.error('Calculation error:', err);
      setVerticalSpeed(null);
      setError('Calculation error');
    }
  };

  useEffect(() => {
    calculateVS();
  }, [currentAlt, nextAlt, distanceToGo, groundSpeed]);

  return (
    <Paper sx={{ p: 3 }}>
       <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 2,
        }}
      >
        <Typography variant="h5" component="h2">
          Descent Rate Calculator
        </Typography>
        <FlightLandIcon fontSize="large" />
      </Box>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <TextField
            label="Current Altitude (ft)"
            value={currentAlt}
            type="number"
            onChange={e => setCurrentAlt(e.target.value)}
            fullWidth
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Next Altitude (ft)"
            value={nextAlt}
            type="number"
            onChange={e => setNextAlt(e.target.value)}
            fullWidth
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Distance to Go (nm)"
            value={distanceToGo}
            type="number"
            onChange={e => setDistanceToGo(e.target.value)}
            fullWidth
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Current Groundspeed (knots)"
            value={groundSpeed}
            type="number"
            onChange={e => setGroundSpeed(e.target.value)}
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <Box mt={2}>
            {error ? (
              <Typography variant="h6" color="error">
                {error}
              </Typography>
            ) : verticalSpeed !== null ? (
              <Typography variant="h6">
                Required Vertical Speed: {verticalSpeed} ft/min
              </Typography>
            ) : (
              <Typography variant="h6">
                Enter valid numbers in all fields
              </Typography>
            )}
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
}
