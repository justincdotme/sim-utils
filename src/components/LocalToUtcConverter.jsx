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

const TIMEZONES = [
  { label: 'UTC−12:00 – Baker Island', offset: -12 },
  { label: 'UTC−11:00 – American Samoa', offset: -11 },
  { label: 'UTC−10:00 – Hawaii', offset: -10 },
  { label: 'UTC−09:00 – Alaska', offset: -9 },
  { label: 'UTC−08:00 – Pacific (US & Canada)', offset: -8 },
  { label: 'UTC−07:00 – Mountain (US & Canada)', offset: -7 },
  { label: 'UTC−06:00 – Central (US & Canada)', offset: -6 },
  { label: 'UTC−05:00 – Eastern (US & Canada)', offset: -5 },
  { label: 'UTC−04:00 – Atlantic (Canada)', offset: -4 },
  { label: 'UTC−03:00 – Buenos Aires', offset: -3 },
  { label: 'UTC−02:00 – South Georgia', offset: -2 },
  { label: 'UTC−01:00 – Azores', offset: -1 },
  { label: 'UTC±00:00 – London, Lisbon', offset: 0 },
  { label: 'UTC+01:00 – Berlin, Paris, Rome', offset: 1 },
  { label: 'UTC+02:00 – Athens, Cape Town', offset: 2 },
  { label: 'UTC+03:00 – Moscow, Nairobi', offset: 3 },
  { label: 'UTC+04:00 – Dubai', offset: 4 },
  { label: 'UTC+05:00 – Karachi', offset: 5 },
  { label: 'UTC+05:30 – India Standard Time', offset: 5.5 },
  { label: 'UTC+06:00 – Dhaka', offset: 6 },
  { label: 'UTC+07:00 – Bangkok, Jakarta', offset: 7 },
  { label: 'UTC+08:00 – Singapore, Beijing', offset: 8 },
  { label: 'UTC+09:00 – Tokyo, Seoul', offset: 9 },
  { label: 'UTC+10:00 – Sydney', offset: 10 },
  { label: 'UTC+11:00 – Solomon Islands', offset: 11 },
  { label: 'UTC+12:00 – Fiji, Auckland', offset: 12 },
  { label: 'UTC+13:00 – Tonga', offset: 13 },
  { label: 'UTC+14:00 – Kiritimati', offset: 14 },
];

export default function LocalToUtcConverter() {
  const [selectedTimezone, setSelectedTimezone] = useState(TIMEZONES[4]);
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

        {/* Row 2: Local date/time and UTC result */}
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
                {utcTime.format('YYYY-MM-DD HH:mm')} UTC
              </Box>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
}
