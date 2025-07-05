import React, { useState } from 'react';
import { Paper, Box, Typography, Switch, FormControlLabel } from '@mui/material';
import FlightLandIcon from '@mui/icons-material/FlightLand';
import VSDescentCalculator from './VSDescentCalculator';
import FPADescentCalculator from './FPADescentCalculator';

export default function DescentCalculator() {
  const [mode, setMode] = useState(0);

  const handleToggle = () => {
    setMode(prev => (prev === 0 ? 1 : 0));
  };

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

      <Box sx={{ mb: 2 }}>
        <FormControlLabel
          control={<Switch checked={mode === 1} onChange={handleToggle} />}
          label={mode === 0 ? 'V/S Mode' : 'FPA Mode'}
        />
      </Box>

      {mode === 0 ? <VSDescentCalculator /> : <FPADescentCalculator />}
    </Paper>
  );
}
