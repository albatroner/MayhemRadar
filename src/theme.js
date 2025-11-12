import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#5c6cff',
      contrastText: '#f5f6fa',
    },
    secondary: {
      main: '#b2b5ff',
    },
    background: {
      default: '#06070b',
      paper: '#101114',
    },
    success: {
      main: '#4ade80',
    },
    warning: {
      main: '#facc15',
    },
    text: {
      primary: '#f5f6fa',
      secondary: '#9a9cb5',
    },
    divider: 'rgba(255, 255, 255, 0.06)',
  },
  typography: {
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    h3: {
      fontFamily: 'Space Grotesk, Inter, sans-serif',
      fontWeight: 700,
      letterSpacing: '-0.02em',
    },
    h5: {
      fontWeight: 600,
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#06070b',
          borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
          boxShadow: 'none',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: '#101114',
          border: '1px solid rgba(255, 255, 255, 0.04)',
        },
      },
    },
    MuiDataGrid: {
      styleOverrides: {
        root: {
          borderColor: 'rgba(255, 255, 255, 0.04)',
          backgroundColor: '#101114',
        },
        columnHeaders: {
          backgroundColor: '#101114',
          borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
        },
        row: {
          '&.Mui-selected': {
            backgroundColor: '#191921',
          },
          '&:hover': {
            backgroundColor: '#191921',
          },
        },
        cell: {
          borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 24,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
  },
});

export default theme;

