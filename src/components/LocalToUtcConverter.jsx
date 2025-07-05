import React, { useState, useEffect } from 'react';
import {
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Typography,
  Box,
  Paper,
} from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { DatePicker, TimePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import TIMEZONES from '../constants/timezones';

export default function LocalToUtcConverter({ onInitialUtcTimeCalculated }) {
  const systemTzName = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const initialTimezone =
    TIMEZONES.find((tz) => tz.name === systemTzName) || TIMEZONES[0];
  const [selectedTimezone, setSelectedTimezone] = useState(initialTimezone);
  const [isDST, setIsDST] = useState(true);

  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [selectedTime, setSelectedTime] = useState(dayjs());
  
  const combinedLocal = selectedDate
    .set('hour', selectedTime.hour())
    .set('minute', selectedTime.minute());

  const utcTime = combinedLocal.subtract(
    selectedTimezone.offset + (isDST ? 1 : 0),
    'hour'
  );

  useEffect(() => {
    if (typeof onInitialUtcTimeCalculated === 'function') {
      onInitialUtcTimeCalculated(utcTime);
    }
  }, []);

  return (
    <Paper elevation={3} sx={{ p: 3, mt: 4 }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 2,
        }}
      >
        <Typography variant="h5" component="h2">
          Local to UTC Time Converter
        </Typography>
        <AccessTimeIcon fontSize="large" />
      </Box>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={11}>
              <FormControl fullWidth>
                <InputLabel>Time Zone</InputLabel>
                <Select
                  value={selectedTimezone.offset}
                  label="Time Zone"
                  onChange={(e) => {
                    const match = TIMEZONES.find(
                      (tz) => tz.offset === e.target.value
                    );
                    if (match) setSelectedTimezone(match);
                  }}
                >
                  {TIMEZONES.map((tz) => (
                    <MenuItem key={tz.offset} value={tz.offset}>
                      {tz.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={1}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={isDST}
                    onChange={(e) => setIsDST(e.target.checked)}
                  />
                }
                label="DST"
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={3}>
              <DatePicker
                label="Local Date"
                value={selectedDate}
                onChange={(newValue) => setSelectedDate(newValue)}
                slotProps={{ textField: { size: 'small', fullWidth: true } }}
              />
            </Grid>
            <Grid item xs={3}>
              <TimePicker
                label="Local Time"
                value={selectedTime}
                onChange={(newValue) => setSelectedTime(newValue)}
                slotProps={{ textField: { size: 'small', fullWidth: true } }}
              />
            </Grid>
            <Grid item xs={6}>
              <Box
                sx={{
                  p: 1.5,
                  backgroundColor: (theme) =>
                    theme.palette.mode === 'dark'
                      ? theme.palette.grey[800]
                      : theme.palette.grey[100],
                  borderRadius: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold',
                  fontSize: '1rem',
                  height: '100%',
                }}
              >
                <AccessTimeIcon fontSize="small" sx={{ mr: 1 }} />
                {utcTime.format('MM-DD-YYYY HH:mm')} UTC
              </Box>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
}
