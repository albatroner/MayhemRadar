import { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  Stack,
  Typography,
  Card,
  CardContent,
  Avatar,
} from '@mui/material';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import LaunchRoundedIcon from '@mui/icons-material/LaunchRounded';
import OpenInNewRoundedIcon from '@mui/icons-material/OpenInNewRounded';
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded';
import WaterDropRoundedIcon from '@mui/icons-material/WaterDropRounded';
import GroupsRoundedIcon from '@mui/icons-material/GroupsRounded';
import ShieldMoonRoundedIcon from '@mui/icons-material/ShieldMoonRounded';
import LocalFireDepartmentRoundedIcon from '@mui/icons-material/LocalFireDepartmentRounded';
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';
import { motion } from 'framer-motion';
import { AreaChart, Area, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from 'recharts';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import UnlockDialog from './UnlockDialog.jsx';

dayjs.extend(relativeTime);

const MotionDialogContent = motion.create(DialogContent);

const createSeries = (baseValue, variance, points = 24, invert = false) => {
  const series = [];
  let value = baseValue;
  for (let i = points - 1; i >= 0; i -= 1) {
    const delta = (Math.random() - 0.45) * variance;
    value = Math.max(0, value + (invert ? -delta : delta));
    series.unshift({
      time: `${i * 5}m`,
      value: Number(value.toFixed(4)),
    });
  }
  return series;
};

const summaryBlocks = [
  {
    key: 'breakoutPotential',
    icon: <TrendingUpRoundedIcon color="primary" />,
    title: 'Breakout Potential',
  },
  {
    key: 'liquidityHealth',
    icon: <WaterDropRoundedIcon color="secondary" />,
    title: 'Liquidity Health',
  },
  {
    key: 'communityHype',
    icon: <GroupsRoundedIcon color="success" />,
    title: 'Community Hype',
  },
];

const TokenDetailDialog = ({ token, onClose }) => {
  const [unlockOpen, setUnlockOpen] = useState(false);

  const marketCapSeries = useMemo(
    () => createSeries(token.marketCap || 100000, (token.marketCap || 100000) * 0.25, 24),
    [token.id, token.marketCap],
  );

  const volumeSeries = useMemo(
    () => createSeries(token.volume || 10, Math.max(token.volume * 0.2, 5), 24),
    [token.id, token.volume],
  );

  const agentSeries = useMemo(
    () => createSeries(token.aiScore || 70, 4, 24, true),
    [token.id, token.aiScore],
  );

  const pumpLink = token.pumpfunUrl ?? (token.id?.length === 44 ? `https://pump.fun/${token.id}` : null);
  const dexLink = token.dexUrl ?? null;
  const externalLinks = [
    pumpLink && {
      href: pumpLink,
      label: 'View on Pump.fun',
      icon: <LaunchRoundedIcon />,
    },
    dexLink && {
      href: dexLink,
      label: 'Open on DexScreener',
      icon: <OpenInNewRoundedIcon />,
    },
    token.website && {
      href: token.website,
      label: 'Project Site',
      icon: <OpenInNewRoundedIcon />,
    },
    token.twitter && {
      href: token.twitter.startsWith('http') ? token.twitter : `https://twitter.com/${token.twitter.replace(/^@/, '')}`,
      label: 'Twitter',
      icon: <OpenInNewRoundedIcon />,
    },
    token.telegram && {
      href: token.telegram.startsWith('http') ? token.telegram : `https://t.me/${token.telegram.replace(/^@/, '')}`,
      label: 'Telegram',
      icon: <OpenInNewRoundedIcon />,
    },
  ].filter(Boolean);
  const volumeDisplay = Number(token.volume ?? 0);
  const heroStats = useMemo(
    () => [
      {
        label: 'AI Score',
        value: Number.isFinite(Number(token.aiScore)) ? token.aiScore : '—',
        icon: <ShieldMoonRoundedIcon />,
      },
      {
        label: 'Volume (SOL)',
        value: Number.isFinite(volumeDisplay)
          ? volumeDisplay.toLocaleString(undefined, { maximumFractionDigits: 1 })
          : '—',
        icon: <LocalFireDepartmentRoundedIcon />,
      },
      {
        label: 'Launched',
        value: dayjs(token.createdAt).fromNow(),
        icon: <AccessTimeRoundedIcon />,
      },
    ],
    [token.aiScore, token.createdAt, volumeDisplay],
  );

  return (
    <>
      <Dialog
        open
        onClose={onClose}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          component: motion.div,
          initial: { opacity: 0, y: 40, scale: 0.98 },
          animate: { opacity: 1, y: 0, scale: 1 },
          exit: { opacity: 0, y: 24, scale: 0.98 },
          transition: { duration: 0.3, ease: 'easeOut' },
          sx: { borderRadius: 4 },
        }}
      >
        <DialogTitle
          sx={{
            px: { xs: 3, md: 4 },
            pt: { xs: 3, md: 4 },
            pb: 0,
            backgroundColor: '#101114',
            borderBottom: '1px solid rgba(255,255,255,0.04)',
          }}
        >
          <Stack direction="row" spacing={2} alignItems="flex-start">
            <Avatar
              variant="rounded"
              src={token.image || undefined}
              alt={token.symbol}
              sx={{
                width: 64,
                height: 64,
                borderRadius: 2.5,
                border: '1px solid rgba(255,255,255,0.06)',
                bgcolor: token.image ? 'transparent' : '#191921',
                fontWeight: 700,
                fontSize: 20,
                color: 'secondary.main',
              }}
            >
              {token.symbol?.slice(0, 3) ?? 'MAY'}
            </Avatar>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="h4" sx={{ fontFamily: 'Space Grotesk, Inter, sans-serif' }}>
                {token.name}
              </Typography>
              <Stack direction="row" spacing={2} alignItems="center" sx={{ mt: 1, flexWrap: 'wrap', rowGap: 1.5 }}>
                <Chip
                  label={token.symbol}
                  variant="outlined"
                  sx={{ borderRadius: 999, borderColor: 'rgba(255,255,255,0.08)' }}
                />
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Observed {dayjs(token.createdAt).fromNow()}
                </Typography>
              </Stack>
            </Box>
            <IconButton onClick={onClose} sx={{ alignSelf: 'flex-start' }}>
              <CloseRoundedIcon />
            </IconButton>
          </Stack>
        </DialogTitle>

        <MotionDialogContent
          dividers
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.35, delay: 0.1 }}
          sx={{
            px: 0,
            py: 0,
            backgroundColor: '#06070b',
          }}
        >
          <Stack spacing={4} sx={{ px: { xs: 2.5, md: 3 }, py: { xs: 3, md: 4 } }}>
            <Box
              sx={{
                backgroundColor: '#101114',
                borderRadius: 3,
                border: '1px solid rgba(255,255,255,0.04)',
                p: { xs: 2.5, md: 3 },
                display: 'flex',
                flexDirection: 'column',
                gap: { xs: 2, md: 2.5 },
              }}
            >
              <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
                {token.description}
              </Typography>
              <Grid container spacing={2}>
                {heroStats.map((stat) => (
                  <Grid key={stat.label} item xs={12} md={4}>
                    <Box
                      sx={{
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1.5,
                        backgroundColor: '#191921',
                        border: '1px solid rgba(255,255,255,0.04)',
                        borderRadius: 2,
                        px: 2.5,
                        py: 2,
                      }}
                    >
                      <Box
                        sx={{
                          width: 36,
                          height: 36,
                          display: 'grid',
                          placeItems: 'center',
                          borderRadius: 1.5,
                          backgroundColor: '#101114',
                          color: 'primary.light',
                        }}
                      >
                        {stat.icon}
                      </Box>
                      <Box>
                        <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                          {stat.label}
                        </Typography>
                        <Typography variant="h6" sx={{ fontWeight: 700, mt: 0.5 }}>
                          {stat.value}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Box>

            <Box sx={{ mx: { xs: -2.5, md: -3 } }}>
              <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <PaperSection title="Market Cap Trend">
                  <ResponsiveContainer width="100%" height={240}>
                    <AreaChart data={marketCapSeries}>
                      <defs>
                        <linearGradient id="marketCapGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#ff4d6d" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#ff4d6d" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" />
                      <XAxis dataKey="time" stroke="rgba(148, 163, 184, 0.6)" />
                      <YAxis stroke="rgba(148, 163, 184, 0.6)" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#0f1629',
                          borderRadius: 12,
                          border: '1px solid rgba(255,255,255,0.08)',
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="value"
                        stroke="#ff4d6d"
                        fill="url(#marketCapGradient)"
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </PaperSection>
              </Grid>

              <Grid item xs={12} md={6}>
                <PaperSection title="AI Sentiment">
                  <Stack spacing={1.5}>
                    {summaryBlocks.map((block) => (
                      <Card
                        key={block.key}
                        variant="outlined"
                        sx={{
                          borderRadius: 2,
                          backgroundColor: '#191921',
                          border: '1px solid rgba(255, 255, 255, 0.04)',
                        }}
                      >
                        <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 1.5, py: 1.5, px: 2, '&:last-child': { pb: 1.5 } }}>
                          {block.icon}
                          <Box sx={{ minWidth: 0, flex: 1 }}>
                            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500, display: 'block' }}>
                              {block.title}
                            </Typography>
                            <Typography variant="h6" sx={{ fontWeight: 700, mt: 0.5 }}>
                              {token.aiIndicators?.[block.key]}
                            </Typography>
                          </Box>
                        </CardContent>
                      </Card>
                    ))}
                  </Stack>
                </PaperSection>
              </Grid>

              <Grid item xs={12} md={6}>
                <PaperSection title="Volume Trend (SOL)">
                  <ResponsiveContainer width="100%" height={240}>
                    <AreaChart data={volumeSeries}>
                      <defs>
                        <linearGradient id="volumeGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#41d3ff" stopOpacity={0.7} />
                          <stop offset="95%" stopColor="#41d3ff" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" />
                      <XAxis dataKey="time" stroke="rgba(148, 163, 184, 0.6)" />
                      <YAxis stroke="rgba(148, 163, 184, 0.6)" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#0f1629',
                          borderRadius: 12,
                          border: '1px solid rgba(255,255,255,0.08)',
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="value"
                        stroke="#41d3ff"
                        fill="url(#volumeGradient)"
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </PaperSection>
              </Grid>

              <Grid item xs={12} md={6}>
                <PaperSection title="Mayhem Agent Activity">
                  <ResponsiveContainer width="100%" height={240}>
                    <AreaChart data={agentSeries}>
                      <defs>
                        <linearGradient id="agentGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#34d399" stopOpacity={0.7} />
                          <stop offset="95%" stopColor="#34d399" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" />
                      <XAxis dataKey="time" stroke="rgba(148, 163, 184, 0.6)" />
                      <YAxis stroke="rgba(148, 163, 184, 0.6)" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#0f1629',
                          borderRadius: 12,
                          border: '1px solid rgba(255,255,255,0.08)',
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="value"
                        stroke="#34d399"
                        fill="url(#agentGradient)"
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </PaperSection>
              </Grid>
            </Grid>
            </Box>

            <Divider sx={{ borderColor: 'rgba(148, 163, 184, 0.08)' }} />

            <Stack spacing={3}>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center" flexWrap="wrap" useFlexGap>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Unlock deeper analytics with x402 micro-access flow.
                </Typography>
                <Chip
                  label={`Liquidity ${token.liquidity?.toFixed?.(2) ?? token.liquidity} SOL`}
                  variant="outlined"
                  sx={{ borderRadius: 999, backgroundColor: '#101114', borderColor: 'rgba(255,255,255,0.05)' }}
                />
                <Chip
                  label={`${token.holders ?? '—'} holders`}
                  variant="outlined"
                  sx={{ borderRadius: 999, backgroundColor: '#101114', borderColor: 'rgba(255,255,255,0.05)' }}
                />
              </Stack>

              <Stack direction="row" spacing={1.5} flexWrap="wrap" useFlexGap justifyContent={{ xs: 'stretch', sm: 'flex-start' }}>
                {externalLinks.map((link) => (
                  <Button
                    key={link.href}
                    variant="outlined"
                    color="secondary"
                    endIcon={link.icon}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{ borderRadius: 2, flex: { xs: '1 1 auto', sm: '0 0 auto' } }}
                  >
                    {link.label}
                  </Button>
                ))}
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => setUnlockOpen(true)}
                  sx={{ borderRadius: 2, px: 3, flex: { xs: '1 1 100%', sm: '0 0 auto' } }}
                >
                  Unlock Full Analysis
                </Button>
              </Stack>
            </Stack>
          </Stack>
        </MotionDialogContent>
      </Dialog>

      <UnlockDialog open={unlockOpen} onClose={() => setUnlockOpen(false)} token={token} />
    </>
  );
};

const PaperSection = ({ title, children }) => (
  <Box
    sx={{
      borderRadius: 3,
      border: '1px solid rgba(255, 255, 255, 0.04)',
      backgroundColor: '#101114',
      p: 2.5,
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      gap: 2,
    }}
  >
    <Typography variant="subtitle2" sx={{ mb: 1.5, color: 'text.secondary', fontWeight: 600 }}>
      {title}
    </Typography>
    {children}
  </Box>
);

PaperSection.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

TokenDetailDialog.propTypes = {
  token: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    name: PropTypes.string.isRequired,
    symbol: PropTypes.string,
    aiScore: PropTypes.number.isRequired,
    volume: PropTypes.number.isRequired,
    marketCap: PropTypes.number.isRequired,
    createdAt: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]).isRequired,
    description: PropTypes.string,
    liquidity: PropTypes.number,
    holders: PropTypes.number,
    aiIndicators: PropTypes.object,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
};

export default TokenDetailDialog;

