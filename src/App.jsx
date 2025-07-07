import React, { useState, useMemo, useRef } from 'react';
import {
    ThemeProvider,
    createTheme,
    CssBaseline,
    AppBar,
    Toolbar,
    Typography,
    IconButton,
    Container,
    Menu,
    MenuItem,
    Box,
    useMediaQuery,
} from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4'; // Moon
import Brightness7Icon from '@mui/icons-material/Brightness7'; // Sun
import MenuIcon from '@mui/icons-material/Menu';
import AirIcon from '@mui/icons-material/Air';

import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ShowChartIcon from '@mui/icons-material/ShowChart'; // 📉 Altitude Calculator
import AccessTimeIcon from '@mui/icons-material/AccessTime'; // 🕓 Local to UTC Converter
import PublicIcon from '@mui/icons-material/Public';         // 🌐 UTC to Local Converter
import TimerIcon from '@mui/icons-material/Timer';           // ⏱️ ETA Calculator
import FastForwardIcon from '@mui/icons-material/FastForward'; // ⏩ TAS Calculator
import { blueIcon } from '@/constants/theme.js';


import LocalToUtcConverter from './Components/LocalToUtcConverter';
import AltitudeChangeCalculator from './Components/Altitude/AltitudeChangeCalculator';
import UtcToLocalConverter from './Components/UtcToLocalConverter';
import ETACalculator from './Components/EtaCalculator';
import TASCalculator from './Components/TASCalculator';
import WCACalculator from './Components/WCACalculator';

const THEME_KEY = 'sim-utils-theme';

export default function App() {
    const systemPrefersDark = useMediaQuery('(prefers-color-scheme: dark)');
    const saved = localStorage.getItem(THEME_KEY);
    const defaultMode = saved || 'system';

    const [themeMode, setThemeMode] = useState(defaultMode);
    const [menuAnchor, setMenuAnchor] = useState(null);

    const actualMode =
        themeMode === 'system' ? (systemPrefersDark ? 'dark' : 'light') : themeMode;

    const theme = useMemo(
        () =>
            createTheme({
                palette: {
                    mode: actualMode,
                },
            }),
        [actualMode]
    );

    const locUtcRef = useRef(null);
    const utcLocRef = useRef(null);
    const altChangeRef = useRef(null);
    const etaCalcRef = useRef(null);
    const tasCalcRef = useRef(null);
    const wcaCalcRef = useRef(null);

    const toggleTheme = () => {
        const newMode =
            themeMode === 'light' ? 'dark' : themeMode === 'dark' ? 'system' : 'light';
        setThemeMode(newMode);
        localStorage.setItem(THEME_KEY, newMode);
    };

    const openMenu = (e) => setMenuAnchor(e.currentTarget);
    const closeMenu = () => setMenuAnchor(null);

    const scrollToRef = (ref) => {
        closeMenu();
        ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    const [sharedUtcTime, setSharedUtcTime] = useState(null);

    const SectionHeader = ({ title, icon }) => (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                mb: 2,
                mt: 4,
            }}
        >
            <Typography variant="h5" component="h2" fontWeight="bold">
                {title}
            </Typography>
            <Box sx={{ ml: 2 }}>{icon}</Box>
        </Box>
    );

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <AppBar position="sticky">
                <Toolbar>
                    <IconButton edge="start" color="inherit" onClick={openMenu} aria-label="menu">
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" sx={{ flexGrow: 1, ml: 1 }}>
                        Sim Utils
                    </Typography>
                    <IconButton
                        onClick={toggleTheme}
                        color="inherit"
                        aria-label={
                            actualMode === 'dark'
                                ? 'Switch to light mode'
                                : 'Switch to dark mode'
                        }
                    >
                        {actualMode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
                    </IconButton>
                </Toolbar>
            </AppBar>
            <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={closeMenu}>
            <MenuItem onClick={() => scrollToRef(altChangeRef)}>
                <ListItemIcon><ShowChartIcon fontSize="small" sx={blueIcon} /></ListItemIcon>
                <ListItemText>Altitude Calculator</ListItemText>
            </MenuItem>
            <MenuItem onClick={() => scrollToRef(locUtcRef)}>
                <ListItemIcon><AccessTimeIcon fontSize="small" sx={blueIcon} /></ListItemIcon>
                <ListItemText>Local to UTC Converter</ListItemText>
            </MenuItem>
            <MenuItem onClick={() => scrollToRef(utcLocRef)}>
                <ListItemIcon><PublicIcon fontSize="small" sx={blueIcon} /></ListItemIcon>
                <ListItemText>UTC to Local Converter</ListItemText>
            </MenuItem>
            <MenuItem onClick={() => scrollToRef(etaCalcRef)}>
                <ListItemIcon><TimerIcon fontSize="small" sx={blueIcon} /></ListItemIcon>
                <ListItemText>ETA Calculator</ListItemText>
            </MenuItem>
            <MenuItem onClick={() => scrollToRef(tasCalcRef)}>
                <ListItemIcon><FastForwardIcon fontSize="small" sx={blueIcon} /></ListItemIcon>
                <ListItemText>TAS Calculator</ListItemText>
            </MenuItem>
            <MenuItem onClick={() => scrollToRef(wcaCalcRef)}>
                <ListItemIcon><AirIcon fontSize="small" sx={blueIcon} /></ListItemIcon>
                <ListItemText>WCA Calculator</ListItemText>
            </MenuItem>
            </Menu>
            <Container maxWidth="md" sx={{ py: 4 }}>
                <section ref={altChangeRef} id="descent-calculator">
                    <AltitudeChangeCalculator />
                </section>
                <section ref={locUtcRef} id="local-to-utc-converter">
                    <LocalToUtcConverter setSharedUtcTime={setSharedUtcTime} />
                </section>
                <section ref={utcLocRef} id="utc-to-local-converter">
                    <UtcToLocalConverter initialUtcTime={sharedUtcTime} />
                </section>
                <section ref={etaCalcRef}>
                    <ETACalculator />
                </section>
                <section ref={tasCalcRef}>
                    <TASCalculator />
                </section>
                <section ref={wcaCalcRef}>
                    <WCACalculator />
                </section>
            </Container>
        </ThemeProvider>
    );
}
