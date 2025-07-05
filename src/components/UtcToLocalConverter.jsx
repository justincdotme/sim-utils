import React, { useState } from 'react';
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

export default function UtcToLocalConverter() {
  const [selectedTimezone, setSelectedTimezone] = useState(TIMEZONES[4]);
  const [isDST, setIsDST] = useState(true);
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [selectedTime, setSelectedTime] = useState(dayjs());

  // Combine selected UTC date and time
  const combinedUtc = selectedDate
    .set('hour', selectedTime.hour())
    .set('minute', selectedTime.minute());

  // Convert UTC to local by adding offset + DST hour if applicable
  const localTime = combinedUtc.add(
    selectedTimezone.offset + (isDST ? 1 : 0),
    'hour'
  );

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
          UTC to Local Time Converter
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
                label="UTC Date"
                value={selectedDate}
                onChange={(newValue) => setSelectedDate(newValue)}
                slotProps={{ textField: { size: 'small', fullWidth: true } }}
              />
            </Grid>
            <Grid item xs={3}>
              <TimePicker
                label="UTC Time"
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
                {localTime.format('YYYY-MM-DD HH:mm')} Local
              </Box>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
}
