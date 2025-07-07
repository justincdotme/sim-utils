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
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import TIMEZONES from '../constants/timezones';
import { blueIcon } from '@/constants/theme.js';


dayjs.extend(utc);
dayjs.extend(timezone);

export default function UtcToLocalConverter() {
    const systemTzName = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const initialTimezone =
        TIMEZONES.find((tz) => tz.name === systemTzName) || TIMEZONES[0];
    const [selectedTimezone, setSelectedTimezone] = useState(initialTimezone);
    const [isDST, setIsDST] = useState(true);
    const [selectedDate, setSelectedDate] = useState(dayjs.utc());
    const [selectedTime, setSelectedTime] = useState(dayjs.utc());

    // Combine date and time parts into one UTC datetime
    const combinedUtc = selectedDate
        .set('hour', selectedTime.hour())
        .set('minute', selectedTime.minute())
        .set('second', 0)
        .set('millisecond', 0);

    let localDateTime = combinedUtc.tz(selectedTimezone.name);

    if (!isDST) {
        localDateTime = localDateTime.subtract(1, 'hour');
    }

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
                <AccessTimeIcon fontSize="large" sx={blueIcon} />
            </Box>
            <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
                <Grid item xs={9}>
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
                <Grid item xs={3}>
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
            <Grid container spacing={2} alignItems="center">
                <Grid item xs={4}>
                    <DatePicker
                        label="UTC Date"
                        value={selectedDate}
                        onChange={(newValue) => setSelectedDate(dayjs.utc(newValue))}
                        slotProps={{ textField: { size: 'small', fullWidth: true } }}
                    />
                </Grid>
                <Grid item xs={4}>
                    <TimePicker
                        label="UTC Time"
                        value={selectedTime}
                        onChange={(newValue) => setSelectedTime(dayjs.utc(newValue))}
                        slotProps={{ textField: { size: 'small', fullWidth: true } }}
                    />
                </Grid>
                <Grid item xs={4}>
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
                        {localDateTime.format('MM-DD-YYYY HH:mm')}
                    </Box>
                </Grid>
            </Grid>
        </Paper>
    );
}
