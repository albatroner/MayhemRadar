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

function HowItWorks() {
  return (
    <Container maxWidth="xl" sx={{ py: { xs: 4, md: 6 } }}>
      <Box sx={wrapperSx}>
        <Typography variant="h4" sx={{ fontFamily: 'Space Grotesk, Inter, sans-serif', mb: 1.5 }}>
          How Mayhem Radar Works
        </Typography>
        <Divider sx={{ borderColor: 'rgba(255,255,255,0.04)', width: '100%', mb: 3 }} />
        <Stack spacing={3} sx={{ width: '100%', alignItems: 'center' }}>
          <Typography variant="body1" color="text.secondary" sx={{ ...textBlockSx, lineHeight: 1.7 }}>
            Mayhem Radar keeps a 30-second heartbeat to DexScreener&apos;s pump.fun stream. Every poll is normalised, coerced
            into SOL denominators, and enriched with synthetic AI scoring so you can triage Mayhem launches without
            waiting for backend pipelines.
          </Typography>

          <Box sx={{ width: '100%', maxWidth: 760, textAlign: 'left' }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1, color: 'text.primary' }}>
              Live data loop (extract)
            </Typography>
            <Box
              component="pre"
              sx={{
                m: 0,
                p: 2,
                borderRadius: 2,
                backgroundColor: '#06070b',
                border: '1px solid rgba(255,255,255,0.05)',
                fontFamily: '"IBM Plex Mono", monospace',
                fontSize: 13,
                overflowX: 'auto',
                color: 'rgba(248, 250, 255, 0.88)',
              }}
            >{`const { tokens } = await fetchMayhemTokens();
return tokens.map(pair => ({
  id: pair.pairAddress,
  marketCap: pair.marketCap || pair.fdv,
  volume: deriveVolumeSol(pair.volume),
  createdAt: new Date(pair.pairCreatedAt),
}));`}</Box>
          </Box>

          <Typography variant="body1" color="text.secondary" sx={{ ...textBlockSx, lineHeight: 1.7 }}>
            When you click a row, the token drawer spins up three synthetic series (market cap, liquidity, agent flow) so you
            can eyeball behaviour across the last two hours. The drawer also collates external targets (Pump.fun,
            DexScreener, socials) and exposes a mock x402 unlock to demonstrate how premium analytics could be gated.
          </Typography>

          <Box sx={{ width: '100%', maxWidth: 760, textAlign: 'left' }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1, color: 'text.primary' }}>
              Simulated x402 unlock
            </Typography>
            <Box
              component="pre"
              sx={{
                m: 0,
                p: 2,
                borderRadius: 2,
                backgroundColor: '#06070b',
                border: '1px solid rgba(255,255,255,0.05)',
                fontFamily: '"IBM Plex Mono", monospace',
                fontSize: 13,
                overflowX: 'auto',
                color: 'rgba(248, 250, 255, 0.88)',
              }}
            >{`const simulateX402Payment = async () => {
  const intent = {
    amount: 0.05,
    currency: 'USDC',
    tokenAddress: token.id,
  };
  const response = await client.pay(intent);
  return response.status === 'granted';
};`}</Box>
          </Box>

          <Box sx={{ width: '100%', maxWidth: 760, textAlign: 'left' }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1, color: 'text.primary' }}>
              Mayhem agent heuristics
            </Typography>
            <Box
              component="pre"
              sx={{
                m: 0,
                p: 2,
                borderRadius: 2,
                backgroundColor: '#06070b',
                border: '1px solid rgba(255,255,255,0.05)',
                fontFamily: '"IBM Plex Mono", monospace',
                fontSize: 13,
                overflowX: 'auto',
                color: 'rgba(248, 250, 255, 0.88)',
              }}
            >{`const MAYHEM_WINDOW = 24 * 60 * 60 * 1000;

const scoreMayhemStatus = (token) => {
  const isFresh = Date.now() - new Date(token.createdAt).getTime() < MAYHEM_WINDOW;
  const agentClue = token.tags?.includes('mayhem') || token.info?.mode === 'mayhem';
  return agentClue && isFresh ? 'Active' : isFresh ? 'Cooling' : 'Expired';
};`}</Box>
          </Box>

          <Box sx={{ width: '100%', maxWidth: 760, textAlign: 'left' }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1, color: 'text.primary' }}>
              x402 client handshake
            </Typography>
            <Box
              component="pre"
              sx={{
                m: 0,
                p: 2,
                borderRadius: 2,
                backgroundColor: '#06070b',
                border: '1px solid rgba(255,255,255,0.05)',
                fontFamily: '"IBM Plex Mono", monospace',
                fontSize: 13,
                overflowX: 'auto',
                color: 'rgba(248, 250, 255, 0.88)',
              }}
            >{`const requestWith402 = async (path) => {
  const res = await fetch(path);
  if (res.status !== 402) return res;

  const paymentHeader = res.headers.get('x402-payment-intent');
  const payment = JSON.parse(paymentHeader);

  await simulateX402Payment(payment); // demo path in Mayhem Radar

  return fetch(path, {
    headers: { 'x402-payment-proof': payment.reference },
  });
};`}</Box>
          </Box>

          <Box sx={{ width: '100%', maxWidth: 760, textAlign: 'left' }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1, color: 'text.primary' }}>
              Solana transaction blueprint
            </Typography>
            <Box
              component="pre"
              sx={{
                m: 0,
                p: 2,
                borderRadius: 2,
                backgroundColor: '#06070b',
                border: '1px solid rgba(255,255,255,0.05)',
                fontFamily: '"IBM Plex Mono", monospace',
                fontSize: 13,
                overflowX: 'auto',
                color: 'rgba(248, 250, 255, 0.88)',
              }}
            >{`import { Connection, Transaction, SystemProgram, PublicKey } from '@solana/web3.js';

const connection = new Connection('https://api.mainnet-beta.solana.com');

const buildTransfer = async ({ from, to, lamports }) => {
  const tx = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey: new PublicKey(from),
      toPubkey: new PublicKey(to),
      lamports,
    }),
  );
  tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
  return tx;
};`}</Box>
          </Box>

          <Typography variant="body1" color="text.secondary" sx={{ ...textBlockSx, lineHeight: 1.7 }}>
            Mayhem Radar remains fully static, so deploying a customised build is as easy as dropping the dist folder on a CDN.
            Swap in a real Solana RPC or production 402 micro-access server when you&apos;re ready to graduate from the
            simulation.
          </Typography>
        </Stack>
      </Box>
    </Container>
  );
}

export default HowItWorks;

