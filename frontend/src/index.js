import React from 'react';
import ReactDOM from 'react-dom/client';
import MemoryVault from './mv';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const root = ReactDOM.createRoot(document.getElementById('root'));

const globalTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

root.render(
  <React.StrictMode>
    <ThemeProvider theme={globalTheme}>
      <CssBaseline />
      <MemoryVault />
    </ThemeProvider>
  </React.StrictMode>
);
