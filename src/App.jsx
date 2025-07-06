import React, { useState, useMemo, useEffect, useRef } from 'react';
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

import LocalToUtcConverter from './Components/LocalToUtcConverter';
import AltitudeChangeCalculator from './Components/Altitude/AltitudeChangeCalculator';
import UtcToLocalConverter from './Components/UtcToLocalConverter';

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
                <MenuItem onClick={() => scrollToRef(altChangeRef)}>📉 Altitude Calculator</MenuItem>
                <MenuItem onClick={() => scrollToRef(locUtcRef)}>🕓 Local to UTC Converter</MenuItem>
                <MenuItem onClick={() => scrollToRef(utcLocRef)}>🕓 UTC to Local Converter</MenuItem>
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
            </Container>
        </ThemeProvider>
    );
}
