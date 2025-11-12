import PropTypes from 'prop-types';
import { memo, useMemo } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import {
  Avatar,
  Box,
  Chip,
  LinearProgress,
  Paper,
  Stack,
  Typography,
  alpha,
} from '@mui/material';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

const aiScoreColor = (score) => {
  if (score >= 90) return 'success';
  if (score >= 80) return 'secondary';
  if (score >= 70) return 'warning';
  return 'default';
};

const TokenTable = ({ tokens, loading, onSelectToken }) => {
  const columns = useMemo(
    () => [
      {
        field: 'name',
        headerName: 'Token',
        flex: 1.3,
        minWidth: 220,
        sortable: false,
        renderCell: (params) => {
          const { row } = params;
          return (
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar
                variant="rounded"
                src={row.image || undefined}
                alt={row.symbol}
                imgProps={{
                  onError: (e) => {
                    if (row.image) {
                      console.warn(`Failed to load image for ${row.symbol}:`, row.image);
                    }
                    e.target.style.display = 'none';
                  },
                  onLoad: () => {
                    if (row.image) {
                      console.log(`Successfully loaded image for ${row.symbol}:`, row.image);
                    }
                  },
                }}
                sx={{
                  width: 44,
                  height: 44,
                  borderRadius: 2,
                  border: '1px solid rgba(148, 163, 184, 0.2)',
                  bgcolor: row.image ? 'transparent' : alpha('#41d3ff', 0.1),
                  color: 'secondary.main',
                  fontWeight: 700,
                }}
              >
                {row.symbol?.slice(0, 2) ?? 'M?'}
              </Avatar>
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  {row.name}
                </Typography>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                    {row.symbol}
                  </Typography>
                  {row.isMock && (
                    <Chip
                      size="small"
                      label="Simulated"
                      sx={{
                        height: 20,
                        fontSize: 11,
                        fontWeight: 600,
                        bgcolor: 'rgba(58, 66, 86, 0.6)',
                        color: 'text.secondary',
                      }}
                    />
                  )}
                </Stack>
              </Box>
            </Stack>
          );
        },
      },
      {
        field: 'volume',
        headerName: 'Volume (SOL)',
        flex: 0.6,
        minWidth: 140,
        type: 'number',
        renderCell: (params) => {
          const value = Number(params?.value);
          const display = Number.isFinite(value)
            ? value.toLocaleString(undefined, { maximumFractionDigits: 1 })
            : '—';
          return (
            <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>
              {display}
            </Typography>
          );
        },
      },
      {
        field: 'marketCap',
        headerName: 'Market Cap',
        flex: 0.7,
        minWidth: 140,
        type: 'number',
        renderCell: (params) => {
          const value = Number(params?.value);
          let display = '—';
          if (Number.isFinite(value)) {
            if (value >= 1000000) {
              display = `$${(value / 1000000).toFixed(2)}M`;
            } else if (value >= 1000) {
              display = `$${(value / 1000).toFixed(1)}K`;
            } else {
              display = `$${value.toFixed(0)}`;
            }
          }
          return (
            <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>
              {display}
            </Typography>
          );
        },
      },
      {
        field: 'aiScore',
        headerName: 'AI Score',
        flex: 0.5,
        minWidth: 120,
        type: 'number',
        renderCell: (params) => {
          const score = Number(params.value);
          const label = Number.isFinite(score) ? `${score}` : '—';
          return (
            <Chip
              label={label}
              color={Number.isFinite(score) ? aiScoreColor(score) : 'default'}
              sx={{
                fontWeight: 700,
                letterSpacing: '0.04em',
                bgcolor: alpha('#41d3ff', 0.12),
              }}
            />
          );
        },
      },
    ],
    [],
  );

  const rows = useMemo(
    () =>
      tokens.map((token) => ({
        ...token,
        marketCap: Number.isFinite(Number(token.marketCap)) ? Number(token.marketCap) : null,
        volume: Number.isFinite(Number(token.volume)) ? Number(token.volume) : null,
        createdAt: token.createdAt ? new Date(token.createdAt) : null,
      })),
    [tokens],
  );

  return (
    <Paper
      variant="outlined"
      sx={{
        height: 540,
        borderRadius: 3,
        overflow: 'hidden',
        bgcolor: '#101114',
        position: 'relative',
      }}
    >
      <DataGrid
        rows={rows}
        columns={columns}
        getRowId={(row) => row.id}
        disableRowSelectionOnClick
        disableColumnMenu
        hideFooterSelectedRowCount
        loading={loading}
        pageSizeOptions={[10, 25, 50]}
        initialState={{
          pagination: { paginationModel: { pageSize: 10 } },
        }}
        onRowClick={(params) => onSelectToken(params.row)}
        slotProps={{
          loadingOverlay: {
            variant: 'linear-progress',
          },
        }}
        slots={{
          loadingOverlay: LinearProgress,
        }}
        sx={{
          fontSize: 14,
          border: 'none',
          backgroundColor: '#101114',
          '.MuiDataGrid-columnHeaders': {
            borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
            fontWeight: 600,
          },
          '.MuiDataGrid-virtualScroller': {
            backgroundColor: '#101114',
          },
          '.MuiDataGrid-row': {
            backgroundColor: '#101114',
            '&:nth-of-type(even)': {
              backgroundColor: '#141519',
            },
            '&:hover': {
              cursor: 'pointer',
              backgroundColor: '#191921',
            },
          },
        }}
      />
    </Paper>
  );
};

TokenTable.propTypes = {
  tokens: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      name: PropTypes.string.isRequired,
      symbol: PropTypes.string,
      createdAt: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]).isRequired,
      volume: PropTypes.number.isRequired,
      marketCap: PropTypes.number.isRequired,
      aiScore: PropTypes.number.isRequired,
      image: PropTypes.string,
      isMock: PropTypes.bool,
    }),
  ).isRequired,
  loading: PropTypes.bool,
  onSelectToken: PropTypes.func.isRequired,
};

TokenTable.defaultProps = {
  loading: false,
};

export default memo(TokenTable);

