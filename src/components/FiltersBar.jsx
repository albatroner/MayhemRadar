import PropTypes from 'prop-types';
import {
  Box,
  Divider,
  InputAdornment,
  Paper,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  Slider,
  Chip,
  Tooltip,
  IconButton,
} from '@mui/material';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import QueryStatsRoundedIcon from '@mui/icons-material/QueryStatsRounded';
import TimelineRoundedIcon from '@mui/icons-material/TimelineRounded';
import BoltOutlinedIcon from '@mui/icons-material/BoltOutlined';
import AutorenewRoundedIcon from '@mui/icons-material/AutorenewRounded';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

const FiltersBar = ({
  timeframe,
  onTimeframeChange,
  minVolume,
  onVolumeChange,
  minScore,
  onScoreChange,
  search,
  onSearchChange,
  loading,
  lastUpdated,
  onRefresh,
}) => {
  const handleTimeframeChange = (_, value) => {
    if (value) {
      onTimeframeChange(value);
    }
  };

  return (
    <Paper variant="outlined" sx={{ p: { xs: 2.5, md: 3 }, borderRadius: 3, backgroundColor: '#101114' }}>
      <Stack spacing={{ xs: 2.5, md: 3 }}>
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={2}
          alignItems={{ xs: 'stretch', md: 'center' }}
        >
          <Box sx={{ flexGrow: 1 }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search token symbol or name"
              value={search}
              onChange={(event) => onSearchChange(event.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchRoundedIcon sx={{ color: 'primary.light' }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                  backgroundColor: '#06070b',
                  border: '1px solid rgba(255,255,255,0.04)',
                },
              }}
            />
          </Box>

          <ToggleButtonGroup
            value={timeframe}
            exclusive
            onChange={handleTimeframeChange}
            color="primary"
            sx={{
              borderRadius: 999,
              backgroundColor: '#06070b',
              p: 0.5,
              '& .MuiToggleButtonGroup-grouped': {
                borderRadius: 999,
                border: 0,
                px: 2,
                py: 1,
              },
            }}
          >
            <ToggleButton value="1h">Last 1h</ToggleButton>
            <ToggleButton value="6h">Last 6h</ToggleButton>
            <ToggleButton value="24h">Last 24h</ToggleButton>
          </ToggleButtonGroup>
        </Stack>

        <Divider flexItem light sx={{ borderColor: 'rgba(148, 163, 184, 0.12)' }} />

        <Stack
          direction={{ xs: 'column', lg: 'row' }}
          spacing={3}
          alignItems={{ xs: 'stretch', lg: 'center' }}
        >
          <Stack direction="row" spacing={2} flex={1}>
            <Box sx={{ flex: 1 }}>
              <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                Volume Filter (SOL)
              </Typography>
              <Slider
                value={minVolume}
                onChange={(_, value) => {
                  const numericValue = Array.isArray(value) ? value[0] : value;
                  onVolumeChange(numericValue);
                }}
                min={0}
                max={500}
                step={10}
                valueLabelDisplay="auto"
                marks={[
                  { value: 0, label: '0' },
                  { value: 250, label: '250' },
                  { value: 500, label: '500' },
                ]}
                sx={{ mt: 1 }}
              />
            </Box>

            <Box sx={{ flex: 1 }}>
              <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                AI Score Minimum
              </Typography>
              <Slider
                value={minScore}
                onChange={(_, value) => {
                  const numericValue = Array.isArray(value) ? value[0] : value;
                  onScoreChange(numericValue);
                }}
                min={60}
                max={95}
                step={1}
                valueLabelDisplay="auto"
                marks={[
                  { value: 60, label: '60' },
                  { value: 80, label: '80' },
                  { value: 95, label: '95' },
                ]}
                sx={{ mt: 1 }}
              />
            </Box>
          </Stack>

          <Divider
            orientation="vertical"
            flexItem
            sx={{
              display: { xs: 'none', lg: 'block' },
              borderColor: 'rgba(148, 163, 184, 0.12)',
            }}
          />

          <Stack
            direction="row"
            spacing={2}
            alignItems="center"
            justifyContent={{ xs: 'flex-start', lg: 'flex-end' }}
            sx={{ minWidth: { lg: 260 } }}
          >
            <Chip
              color="primary"
              variant="outlined"
              icon={<BoltOutlinedIcon />}
              label={
                <Typography component="span" variant="body2" sx={{ fontWeight: 600 }}>
                  {loading ? 'Scanning...' : 'Live Feed Active'}
                </Typography>
              }
              sx={{ borderRadius: 999, px: 0.5 }}
            />

            <Tooltip title="Manual refresh">
              <span>
                <IconButton
                  color="secondary"
                  onClick={onRefresh}
                  disabled={loading}
                  sx={{
                    borderRadius: 2,
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    backgroundColor: '#06070b',
                  }}
                >
                  <AutorenewRoundedIcon />
                </IconButton>
              </span>
            </Tooltip>

            <Stack spacing={0.2}>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                Last updated
              </Typography>
              <Stack direction="row" spacing={1} alignItems="center">
                <QueryStatsRoundedIcon fontSize="small" sx={{ color: 'secondary.light' }} />
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {lastUpdated ? dayjs(lastUpdated).fromNow() : 'Just now'}
                </Typography>
              </Stack>
            </Stack>
          </Stack>
        </Stack>
      </Stack>
    </Paper>
  );
};

FiltersBar.propTypes = {
  timeframe: PropTypes.string.isRequired,
  onTimeframeChange: PropTypes.func.isRequired,
  minVolume: PropTypes.number.isRequired,
  onVolumeChange: PropTypes.func.isRequired,
  minScore: PropTypes.number.isRequired,
  onScoreChange: PropTypes.func.isRequired,
  search: PropTypes.string.isRequired,
  onSearchChange: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  lastUpdated: PropTypes.instanceOf(Date),
  onRefresh: PropTypes.func.isRequired,
};

FiltersBar.defaultProps = {
  loading: false,
  lastUpdated: null,
};

export default FiltersBar;

