import { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  Typography,
  Alert,
  Button,
  Chip,
  Divider,
  LinearProgress,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import VerifiedRoundedIcon from '@mui/icons-material/VerifiedRounded';
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined';
import TimelineRoundedIcon from '@mui/icons-material/TimelineRounded';
import InsightsRoundedIcon from '@mui/icons-material/InsightsRounded';
import { motion } from 'framer-motion';
import { simulateX402Payment } from '../services/x402-client.js';

const MotionDialog = motion.create(Dialog);

const UnlockDialog = ({ open, onClose, token }) => {
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState(null);
  const [accessRef, setAccessRef] = useState(null);

  const premiumSignals = useMemo(
    () => [
      {
        title: 'Agent Flow Map',
        description: `Live trace of top 12 Mayhem wallets interacting with ${token.symbol}.`,
        icon: <TimelineRoundedIcon color="secondary" />,
      },
      {
        title: 'Liquidity Pressure Gauge',
        description: 'Predictive breakdown of LP adds vs. pulls across the last 15 minutes.',
        icon: <ShieldOutlinedIcon color="primary" />,
      },
      {
        title: 'Community Pulse AI',
        description: 'Blended sentiment score from X, Warpcast, and channel mentions.',
        icon: <InsightsRoundedIcon color="success" />,
      },
    ],
    [token.symbol],
  );

  const handlePay = async () => {
    setStatus('processing');
    setError(null);
    try {
      const result = await simulateX402Payment({ amount: 0.05, currency: 'USDC', tokenSymbol: token.symbol });
      setAccessRef(result.reference);
      setStatus('success');
    } catch (err) {
      setError(err.message ?? 'Payment failed. Please try again.');
      setStatus('error');
    }
  };

  const handleClose = () => {
    setStatus('idle');
    setError(null);
    setAccessRef(null);
    onClose();
  };

  return (
    <MotionDialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="sm"
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 24 }}
      transition={{ duration: 0.28, ease: 'easeOut' }}
      PaperProps={{ sx: { borderRadius: 4 } }}
    >
      <DialogTitle
        sx={{
          backgroundColor: '#101114',
          borderBottom: '1px solid rgba(255,255,255,0.04)',
        }}
      >
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="h5" sx={{ fontFamily: 'Space Grotesk, Inter, sans-serif' }}>
              Unlock Full Analysis
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
              x402 micro-access for {token.name}
            </Typography>
          </Box>
          <IconButton onClick={handleClose}>
            <CloseRoundedIcon />
          </IconButton>
        </Stack>
      </DialogTitle>

      <DialogContent dividers sx={{ backgroundColor: '#06070b' }}>
        <Stack spacing={3}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ xs: 'flex-start', sm: 'center' }}>
            <Chip
              icon={<VerifiedRoundedIcon />}
              label="x402 Secure Layer"
              color="primary"
              sx={{ fontWeight: 600, borderRadius: 999 }}
            />
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Instant, revocable access. No wallet signatures required during simulation.
            </Typography>
          </Stack>

          {status === 'processing' && <LinearProgress color="secondary" />}

          {error && (
            <Alert severity="error" onClose={() => setError(null)}>
              {error}
            </Alert>
          )}

          {status !== 'success' && (
            <>
              <Stack spacing={2}>
                {premiumSignals.map((signal) => (
                  <Box
                    key={signal.title}
                  sx={{
                    display: 'flex',
                    gap: 2,
                    p: 2,
                    borderRadius: 3,
                    border: '1px solid rgba(255, 255, 255, 0.04)',
                    backgroundColor: '#101114',
                  }}
                  >
                    <Box sx={{ mt: 0.5 }}>{signal.icon}</Box>
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        {signal.title}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        {signal.description}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Stack>

              <Divider sx={{ borderColor: 'rgba(148, 163, 184, 0.1)' }} />

              <Stack spacing={1}>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Payment Summary
                </Typography>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    backgroundColor: '#101114',
                    borderRadius: 2,
                    px: 2,
                    py: 1.5,
                    border: '1px solid rgba(255,255,255,0.04)',
                  }}
                >
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    0.05 USDC
                  </Typography>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    Access • 24h
                  </Typography>
                </Box>
              </Stack>
            </>
          )}

          {status === 'success' && (
            <Stack spacing={2}>
              <Alert
                icon={<VerifiedRoundedIcon fontSize="inherit" />}
                severity="success"
                sx={{ borderRadius: 3, alignItems: 'center' }}
              >
                Access granted via x402. Reference {accessRef}.
              </Alert>
              <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                Full analytics unlocked. Persistent monitoring enabled for the next 24 hours with auto
                revocation if Mayhem mode disables.
              </Typography>
              <Stack spacing={1}>
                <Typography variant="subtitle2">Deeper Insights:</Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  • Wallet clustering identifies {token.holders ?? 'key'} influential holders driving momentum.
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  • Liquidity runway projects {Math.round((token.liquidity ?? 80) / 12)} hours until intervention
                  required.
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  • AI anomaly detection scanning every 90 seconds for exit signatures.
                </Typography>
              </Stack>
            </Stack>
          )}
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2.5 }}>
        <Button onClick={handleClose} color="inherit">
          {status === 'success' ? 'Close' : 'Cancel'}
        </Button>
        {status !== 'success' && (
          <LoadingButton
            variant="contained"
            color="primary"
            onClick={handlePay}
            loading={status === 'processing'}
            sx={{ borderRadius: 12, px: 3 }}
          >
            Simulate x402 Pay
          </LoadingButton>
        )}
      </DialogActions>
    </MotionDialog>
  );
};

UnlockDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  token: PropTypes.shape({
    name: PropTypes.string.isRequired,
    symbol: PropTypes.string,
    liquidity: PropTypes.number,
    holders: PropTypes.number,
  }).isRequired,
};

export default UnlockDialog;

