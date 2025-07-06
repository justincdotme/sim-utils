import React, { useState } from 'react';
import { Paper, Box, Typography, Switch, FormControlLabel } from '@mui/material';
import FlightLandIcon from '@mui/icons-material/FlightLand';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import StraightenIcon from '@mui/icons-material/Straighten';
import VSCalculator from './VSCalculator';
import FPACalculator from './FPACalculator';
import AltitudeChangeGraph from './AltitudeChangeGraph';

export default function AltitudeChangeCalculator() {
  const [mode, setMode] = useState(0);
  const [graphData, setGraphData] = useState(null);
  const [startAlt, setStartAlt] = useState(null);
  const [endAlt, setEndAlt] = useState(null);

  const handleToggle = () => {
    setMode((prev) => (prev === 0 ? 1 : 0));
    setGraphData(null); // Clear graph on mode change
    setStartAlt(null);
    setEndAlt(null);
  };

  const handleValidData = (data) => {
    setGraphData(data);
    if (data && typeof data.curAlt === 'number' && typeof data.tgtAlt === 'number') {
      setStartAlt(data.curAlt);
      setEndAlt(data.tgtAlt);
    } else if (data && typeof data.curAlt === 'number' && typeof data.endAlt === 'number') {
      // For FPACalculator, endAlt key is different
      setStartAlt(data.curAlt);
      setEndAlt(data.endAlt);
    } else {
      setStartAlt(null);
      setEndAlt(null);
    }
  };

  const isClimb = startAlt !== null && endAlt !== null && startAlt < endAlt;
  const isDescent = startAlt !== null && endAlt !== null && startAlt > endAlt;

  const icon = isClimb
    ? <FlightTakeoffIcon fontSize="large" color="primary" />
    : isDescent
      ? <FlightLandIcon fontSize="large" color="primary" />
      : <StraightenIcon fontSize="large" />; // default icon if altitudes unknown or equal

  return (
    <Paper sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h5" component="h2">
          Altitude Change Calculator
        </Typography>
        {icon}
      </Box>

      <Box sx={{ mb: 2 }}>
        <FormControlLabel
          control={<Switch checked={mode === 1} onChange={handleToggle} />}
          label={mode === 0 ? 'V/S Mode' : 'FPA Mode'}
        />
      </Box>

      {mode === 0 ? (
        <VSCalculator
          onValidData={handleValidData}
          isClimb={isClimb}
          isDescent={isDescent}
        />
      ) : (
        <FPACalculator
          onValidData={handleValidData}
          isClimb={isClimb}
          isDescent={isDescent}
        />
      )}

      {graphData && <AltitudeChangeGraph data={graphData} />}
    </Paper>
  );
}
