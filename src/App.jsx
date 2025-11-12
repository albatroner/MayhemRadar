import { useCallback, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Container,
  Stack,
  Chip,
  Tooltip,
  IconButton,
  TextField,
  InputAdornment,
  SvgIcon,
  Button,
} from '@mui/material';
import HubOutlinedIcon from '@mui/icons-material/HubOutlined';
import AutoAwesomeOutlinedIcon from '@mui/icons-material/AutoAwesomeOutlined';
import GitHubIcon from '@mui/icons-material/GitHub';
import ContentCopyRoundedIcon from '@mui/icons-material/ContentCopyRounded';
import { Link, Routes, Route, NavLink } from 'react-router-dom';
import './App.css';
import Home from './pages/Home.jsx';
import About from './pages/About.jsx';
import HowItWorks from './pages/HowItWorks.jsx';

const BRAND_NAME = 'Mayhem Radar';

const SocialXIcon = (props) => (
  <SvgIcon {...props} viewBox="0 0 24 24">
    <path
      d="M3 3h5.6l4.4 5.8L17.4 3H21l-6.7 8.7L21 21h-5.6l-4.7-6.2L6.6 21H3l7-9.2L3 3Z"
      fill="currentColor"
    />
  </SvgIcon>
);

const SOCIAL_LINKS = [
  {
    label: 'X',
    href: 'https://x.com/MayhemRadar',
    Icon: SocialXIcon,
  },
  {
    label: 'GitHub',
    href: 'https://github.com/albatroner/MayhemRadar',
    Icon: GitHubIcon,
  },
];

const iconButtonStyles = {
  borderRadius: 2,
  border: '1px solid rgba(255,255,255,0.08)',
  color: 'text.primary',
  backgroundColor: '#06070b',
  '&:hover': {
    backgroundColor: '#191921',
  },
};

const getPhantomProvider = () => {
  if (typeof window === 'undefined') return null;
  const anyWindow = window;
  if (anyWindow?.solana?.isPhantom) {
    return anyWindow.solana;
  }
  return null;
};

const shortenAddress = (address) => {
  if (!address) return '';
  return `${address.slice(0, 4)}…${address.slice(-4)}`;
};

function App() {
  const [copied, setCopied] = useState(false);
  const [walletAddress, setWalletAddress] = useState(null);
  const [phantomAvailable, setPhantomAvailable] = useState(false);
  const [contractAddress, setContractAddress] = useState('Loading...');
  const providerRef = useRef(null);

  useEffect(() => {
    document.title = BRAND_NAME;
  }, []);

  // Fetch CA from API
  useEffect(() => {
    const fetchCA = async () => {
      try {
        const response = await fetch('/api/ca');
        const data = await response.json();
        
        if (data.success && data.ca) {
          setContractAddress(data.ca);
        } else {
          setContractAddress('Loading...');
        }
      } catch (error) {
        console.error('Failed to fetch CA:', error);
        setContractAddress('Loading...');
      }
    };

    fetchCA();
  }, []);

  useEffect(() => {
    const provider = getPhantomProvider();
    if (!provider) return undefined;

    providerRef.current = provider;
    setPhantomAvailable(true);

    const handleConnect = (publicKey) => {
      const key =
        typeof publicKey?.toString === 'function'
          ? publicKey.toString()
          : provider.publicKey?.toString?.() ?? null;
      setWalletAddress(key);
    };

    const handleDisconnect = () => {
      setWalletAddress(null);
    };

    provider.on?.('connect', handleConnect);
    provider.on?.('disconnect', handleDisconnect);

    provider.connect?.({ onlyIfTrusted: true }).catch(() => {});

    return () => {
      provider.off?.('connect', handleConnect);
      provider.off?.('disconnect', handleDisconnect);
      provider.removeListener?.('connect', handleConnect);
      provider.removeListener?.('disconnect', handleDisconnect);
    };
  }, []);

  const handleCopyCa = useCallback(async () => {
    if (!contractAddress || contractAddress === 'Loading...') return;
    try {
      await navigator.clipboard.writeText(contractAddress.trim());
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch (err) {
      setCopied(false);
    }
  }, [contractAddress]);

  const handleConnectPhantom = useCallback(async () => {
    const provider = providerRef.current ?? getPhantomProvider();
    if (!provider) {
      window.open('https://phantom.app/download', '_blank', 'noopener,noreferrer');
      return;
    }

    try {
      const response = await provider.connect();
      const pubkey =
        response?.publicKey?.toString?.() ?? provider.publicKey?.toString?.() ?? null;
      setWalletAddress(pubkey);
    } catch (error) {
      // user rejected connection
    }
  }, []);

  const handleDisconnectPhantom = useCallback(async () => {
    const provider = providerRef.current ?? getPhantomProvider();
    try {
      await provider?.disconnect?.();
    } catch (error) {
      // ignore disconnect errors
    } finally {
      setWalletAddress(null);
    }
  }, []);

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#06070b' }}>
      <AppBar position="sticky" elevation={0} color="transparent">
        <Toolbar sx={{ py: 2, gap: 3 }}>
          <Stack direction="row" spacing={2} alignItems="center" sx={{ flexGrow: 1 }}>
            <Box
              component={Link}
              to="/"
              sx={{
                display: 'flex',
                alignItems: 'center',
                textDecoration: 'none',
                color: 'inherit',
                gap: 2,
              }}
            >
              <Box
                component="img"
                src="/logo.png"
                alt={`${BRAND_NAME} logo`}
                sx={{
                  width: 60,
                  height: 60,
                  objectFit: 'contain',
                }}
              />
              <Box>
                <Typography variant="h5" sx={{ fontFamily: 'Space Grotesk, Inter, sans-serif' }}>
                  {BRAND_NAME}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Solana Mayhem intelligence in real time
                </Typography>
              </Box>
            </Box>
          </Stack>
          <Stack
            direction="row"
            spacing={2.5}
            alignItems="center"
            justifyContent="center"
            sx={{
              display: { xs: 'none', md: 'flex' },
              flexGrow: 1,
              ml: { md: 5 },
            }}
          >
            <NavButton to="/" label="Radar" />
            <NavButton to="/how-it-works" label="How It Works" />
            <NavButton to="/about" label="About" />
          </Stack>
          <Stack
            direction="row"
            spacing={1.5}
            alignItems="center"
            sx={{
              flexWrap: 'wrap',
              justifyContent: { xs: 'flex-start', md: 'flex-end' },
              flexGrow: 1,
            }}
          >
            <TextField
              label="Contract Address"
              value={contractAddress}
              variant="outlined"
              size="small"
              InputProps={{
                readOnly: true,
                endAdornment: (
                  <InputAdornment position="end">
                    <Tooltip title={copied ? 'Copied!' : 'Copy CA'}>
                      <span>
                        <IconButton
                          color={copied ? 'success' : 'secondary'}
                          onClick={handleCopyCa}
                          size="small"
                          sx={iconButtonStyles}
                          disabled={contractAddress === 'Loading...'}
                        >
                          <ContentCopyRoundedIcon fontSize="inherit" />
                        </IconButton>
                      </span>
                    </Tooltip>
                  </InputAdornment>
                ),
              }}
              InputLabelProps={{
                sx: { color: 'text.secondary' },
              }}
              sx={{
                minWidth: 260,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  backgroundColor: '#06070b',
                  '& fieldset': {
                    borderColor: 'rgba(255,255,255,0.08)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(255,255,255,0.16)',
                  },
                },
              }}
            />
            <Button
              variant={walletAddress ? 'contained' : 'outlined'}
              color="primary"
              onClick={walletAddress ? handleDisconnectPhantom : handleConnectPhantom}
              sx={{ borderRadius: 999 }}
            >
              {walletAddress
                ? shortenAddress(walletAddress)
                : phantomAvailable
                ? 'Connect Phantom'
                : 'Install Phantom'}
            </Button>
            {SOCIAL_LINKS.map(({ label, href, Icon }) => (
              <Tooltip key={`nav-${label}`} title={label}>
                <IconButton
                  component="a"
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  size="small"
                  sx={iconButtonStyles}
                >
                  <Icon fontSize="small" />
                </IconButton>
              </Tooltip>
            ))}
            <Chip
              icon={<AutoAwesomeOutlinedIcon sx={{ color: 'success.main !important' }} />}
              label="x402 Protocol"
              sx={{ bgcolor: 'rgba(52, 211, 153, 0.12)', color: 'success.main', fontWeight: 600 }}
            />
            <Chip
              icon={<HubOutlinedIcon sx={{ color: 'secondary.main !important' }} />}
              label="Mayhem Mode"
              sx={{ bgcolor: 'rgba(65, 211, 255, 0.18)', color: 'secondary.main', fontWeight: 600 }}
            />
          </Stack>
        </Toolbar>
      </AppBar>

      <Box component="main" sx={{ flexGrow: 1 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </Box>

      <Box
        component="footer"
        sx={{
          mt: { xs: 5, md: 7 },
          py: { xs: 4, md: 5 },
          borderTop: '1px solid rgba(255,255,255,0.04)',
          backgroundColor: '#06070b',
        }}
      >
        <Container maxWidth="xl">
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            spacing={{ xs: 3, md: 4 }}
            alignItems={{ xs: 'flex-start', md: 'center' }}
            justifyContent="space-between"
          >
            <Stack spacing={0.5}>
              <Typography variant="body1" sx={{ fontWeight: 600 }}>
                {BRAND_NAME}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Real-time DexScreener intel for Pump.fun Mayhem launches.
              </Typography>
            </Stack>

            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={{ xs: 2, sm: 3 }}
              alignItems={{ xs: 'stretch', sm: 'center' }}
              sx={{ width: { xs: '100%', sm: 'auto' } }}
            >
              <TextField
                label="Contract Address"
                value={contractAddress}
                variant="outlined"
                size="small"
                fullWidth
                InputProps={{
                  readOnly: true,
                  endAdornment: (
                    <InputAdornment position="end">
                      <Tooltip title={copied ? 'Copied!' : 'Copy CA'}>
                        <span>
                          <IconButton
                            color={copied ? 'success' : 'secondary'}
                            onClick={handleCopyCa}
                            size="small"
                            sx={iconButtonStyles}
                            disabled={contractAddress === 'Loading...'}
                          >
                            <ContentCopyRoundedIcon fontSize="inherit" />
                          </IconButton>
                        </span>
                      </Tooltip>
                    </InputAdornment>
                  ),
                }}
                InputLabelProps={{
                  sx: { color: 'text.secondary' },
                }}
                sx={{
                  minWidth: { xs: '100%', sm: 320 },
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    backgroundColor: '#06070b',
                    '& fieldset': {
                      borderColor: 'rgba(255,255,255,0.08)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgba(255,255,255,0.16)',
                    },
                  },
                }}
              />
              <Stack direction="row" spacing={1.2}>
                {SOCIAL_LINKS.map(({ label, href, Icon }) => (
                  <Tooltip key={`footer-${label}`} title={label}>
                    <IconButton
                      component="a"
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      size="small"
                      sx={iconButtonStyles}
                    >
                      <Icon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                ))}
              </Stack>
            </Stack>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
}

const NavButton = ({ to, label }) => (
  <Typography
    component={NavLink}
    to={to}
    end
    sx={({ isActive }) => ({
      fontWeight: 600,
      letterSpacing: '0.04em',
      color: isActive ? 'primary.main' : 'inherit',
      textDecoration: 'none',
      transition: 'color 0.2s ease',
      '&:hover': { color: 'primary.main' },
    })}
  >
    {label}
  </Typography>
);

NavButton.propTypes = {
  to: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
};

export default App;
