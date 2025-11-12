import { Container, Box, Typography, Divider, Stack } from '@mui/material';

const wrapperSx = {
  backgroundColor: '#101114',
  borderRadius: 3,
  border: '1px solid rgba(255,255,255,0.04)',
  px: { xs: 2.5, md: 3.5 },
  py: { xs: 3, md: 4 },
  textAlign: 'center',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 1.5,
};

const textBlockSx = { maxWidth: 720 };
const bulletBlockSx = { pl: 0, textAlign: 'left', width: '100%', maxWidth: 520, mx: 'auto' };

function About() {
  return (
    <Container maxWidth="xl" sx={{ py: { xs: 4, md: 6 } }}>
      <Box sx={wrapperSx}>
        <Typography variant="h4" sx={{ fontFamily: 'Space Grotesk, Inter, sans-serif', mb: 1.5 }}>
          About Mayhem Radar
        </Typography>
        <Divider sx={{ borderColor: 'rgba(255,255,255,0.04)', width: '100%', mb: 3 }} />
        <Stack spacing={2} alignItems="center" sx={{ width: '100%' }}>
          <Typography variant="body1" color="text.secondary" sx={textBlockSx}>
            Mayhem Radar is a purpose-built, front-end first radar that keeps Pump.fun hunters
            wired into every Mayhem Mode activation without requiring a wallet connection or custom backend. The app
            leans on DexScreener streams, enriches them with AI heuristics, and delivers a high-signal dashboard that
            feels at home on both trading rigs and mobile scouting.
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={textBlockSx}>
            Our ethos is to stay lightweight, transparent, and ready for the next wave. Everything happens in the
            browser: polling, analytics, visualisations, and even the simulated x402 unlock flow. That makes Mayhem Radar easy
            to host, fork, or embed straight into an analyst’s toolkit.
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={textBlockSx}>
            The heartbeat of Mayhem Radar is Pump.fun’s experimental Mayhem Mode. According to the official docs,
            <Typography
              component="a"
              href="https://pump.fun/docs/mayhem-mode"
              target="_blank"
              rel="noopener noreferrer"
              sx={{ color: 'primary.light', textDecoration: 'none', fontWeight: 600, ml: 0.5 }}
            >
              Mayhem Mode
            </Typography>{' '}
            deploys an autonomous trading agent for the first 24 hours of a launch, minting an additional billion
            tokens and walking price+volume to seed attention. Mayhem Radar tracks those AI-assisted coins, surfaces their
            liquidity posture, and calls out whether the agent is still inside its 24h trading window.
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={textBlockSx}>
            On the monetisation side, we lean into the x402 protocol. As the x402 team describes it,
            <Typography
              component="a"
              href="https://www.x402.org/"
              target="_blank"
              rel="noopener noreferrer"
              sx={{ color: 'primary.light', textDecoration: 'none', fontWeight: 600, ml: 0.5 }}
            >
              x402
            </Typography>{' '}
            activates the dormant HTTP 402 status code to request on-chain payments without accounts, OAuth, or
            signatures. Mayhem Radar’s simulated unlock demonstrates how a Mayhem analytics provider could charge 0.05&nbsp;USDC for
            deeper intel while keeping the flow entirely client-side.
          </Typography>
          <Stack spacing={1} sx={bulletBlockSx}>
            <Typography variant="body2" color="text.secondary">
              • Live DexScreener ingestion with graceful mock fallback whenever the upstream API rate-limits.
            </Typography>
            <Typography variant="body2" color="text.secondary">
              • Composable filters for timeframe, liquidity, AI score thresholds, and direct symbol search.
            </Typography>
            <Typography variant="body2" color="text.secondary">
              • Token detail modal with responsive charting, sentiment snapshots, and rapid jumps to Pump.fun or DexScreener.
            </Typography>
            <Typography variant="body2" color="text.secondary">
              • x402-inspired micro-access flow that demonstrates how premium intelligence can be gated without a backend.
            </Typography>
            <Typography variant="body2" color="text.secondary">
              • Minimal, performant styling designed for dark terminals and multi-monitor trading caves.
            </Typography>
          </Stack>
        </Stack>
      </Box>
    </Container>
  );
}

export default About;

