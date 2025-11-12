import { useMemo, useState } from 'react';
import { Container, Stack, Tooltip, Button, Box, Alert } from '@mui/material';
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { AnimatePresence } from 'framer-motion';
import FiltersBar from '../components/FiltersBar.jsx';
import TokenTable from '../components/TokenTable.jsx';
import TokenDetailDialog from '../components/TokenDetailDialog.jsx';
import useMayhemTokens from '../hooks/useMayhemTokens.js';

dayjs.extend(relativeTime);

const TIME_WINDOWS = {
  '1h': 1,
  '6h': 6,
  '24h': 24,
};

function Home() {
  const [timeframe, setTimeframe] = useState('1h');
  const [minVolume, setMinVolume] = useState(0);
  const [minScore, setMinScore] = useState(60);
  const [search, setSearch] = useState('');
  const [selectedToken, setSelectedToken] = useState(null);

  const { tokens, loading, error, refresh, lastUpdated } = useMayhemTokens();

  const filteredTokens = useMemo(() => {
    const windowHours = TIME_WINDOWS[timeframe] ?? 1;
    const cutoff = dayjs().subtract(windowHours, 'hour');

    return tokens
      .filter((token) => {
        const createdAt = dayjs(token.createdAt);
        return createdAt.isAfter(cutoff);
      })
      .filter((token) => token.volume >= minVolume)
      .filter((token) => token.aiScore >= minScore)
      .filter((token) => {
        if (!search.trim()) return true;
        const term = search.trim().toLowerCase();
        return (
          token.name.toLowerCase().includes(term) || token.symbol.toLowerCase().includes(term)
        );
      });
  }, [tokens, timeframe, minVolume, minScore, search]);

  return (
    <>
      <Container maxWidth="xl" sx={{ py: { xs: 4, md: 6 }, position: 'relative', zIndex: 1 }}>
        <Stack spacing={3}>
          <FiltersBar
            timeframe={timeframe}
            onTimeframeChange={setTimeframe}
            minVolume={minVolume}
            onVolumeChange={setMinVolume}
            minScore={minScore}
            onScoreChange={setMinScore}
            search={search}
            onSearchChange={setSearch}
            loading={loading}
            lastUpdated={lastUpdated}
            onRefresh={refresh}
          />

          {error && (
            <Alert severity="warning" sx={{ borderRadius: 3 }}>
              {error}
            </Alert>
          )}

          <TokenTable
            tokens={filteredTokens}
            loading={loading}
            onSelectToken={setSelectedToken}
          />

          <Box display="flex" justifyContent="center">
            <Tooltip title="Trigger an immediate data refresh">
              <span>
                <Button
                  variant="contained"
                  color="secondary"
                  startIcon={<RefreshRoundedIcon />}
                  onClick={refresh}
                  disabled={loading}
                  sx={{ borderRadius: 999, px: 3 }}
                >
                  Sync Now
                </Button>
              </span>
            </Tooltip>
          </Box>
        </Stack>
      </Container>

      <AnimatePresence>
        {selectedToken && (
          <TokenDetailDialog token={selectedToken} onClose={() => setSelectedToken(null)} />
        )}
      </AnimatePresence>
    </>
  );
}

export default Home;

