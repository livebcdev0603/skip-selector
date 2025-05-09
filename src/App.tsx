import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  ThemeProvider,
  createTheme,
  CssBaseline,
  CircularProgress,
  Box,
  TextField,
  Autocomplete,
  InputAdornment,
  Select,
  MenuItem,
  IconButton,
  Tooltip,
  Slide,
  Paper,
  Button
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import UpdateIcon from '@mui/icons-material/Update';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import StraightenIcon from '@mui/icons-material/Straighten';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import styled from 'styled-components';
import SkipCard from './components/SkipCard';
import { fetchSkipsByLocation } from './services/skipService';
import type { Skip } from './types/skip';
import Grid from '@mui/material/Grid';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#121212',
      paper: '#181a20',
    },
  },
});

const StyledContainer = styled(Container)`
  padding-top: 2rem;
  padding-bottom: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Title = styled(Typography)`
  margin-bottom: 2rem;
  text-align: center;
`;

const ControlsBox = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
  width: 100%;
  padding: 0 1rem;
  @media (min-width: 600px) {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    gap: 2rem;
  }
`;

const sortOptions = [
  { value: 'size', label: 'Size', icon: <StraightenIcon fontSize="small" sx={{ mr: 1 }} /> },
  { value: 'price', label: 'Price', icon: <AttachMoneyIcon fontSize="small" sx={{ mr: 1 }} /> },
  { value: 'hire', label: 'Hire', icon: <AccessTimeIcon fontSize="small" sx={{ mr: 1 }} /> },
  { value: 'created', label: 'Created', icon: <CalendarTodayIcon fontSize="small" sx={{ mr: 1 }} /> },
  { value: 'updated', label: 'Updated', icon: <UpdateIcon fontSize="small" sx={{ mr: 1 }} /> },
];

function App() {
  const [skips, setSkips] = useState<Skip[]>([]);
  const [selectedSkipId, setSelectedSkipId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('size');
  const [sortDir, setSortDir] = useState('asc');

  useEffect(() => {
    const loadSkips = async () => {
      try {
        const data = await fetchSkipsByLocation('NR32', 'Lowestoft');
        setSkips(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load skip options. Please try again later.');
        setLoading(false);
      }
    };
    loadSkips();
  }, []);

  const handleSkipSelect = (skipId: number) => {
    setSelectedSkipId(prev => (prev === skipId ? null : skipId));
  };

  const filteredSkips = skips
    .filter(skip => {
      if (!search) return true;
      const searchLower = search.toLowerCase();
      return (
        skip.size.toString().includes(searchLower) ||
        `${skip.size} yard`.includes(searchLower) ||
        `${skip.size} yards`.includes(searchLower)
      );
    })
    .sort((a, b) => {
      let aVal, bVal;
      switch (sort) {
        case 'size':
          aVal = a.size; bVal = b.size; break;
        case 'price':
          aVal = a.price_before_vat + (a.price_before_vat * a.vat / 100);
          bVal = b.price_before_vat + (b.price_before_vat * b.vat / 100);
          break;
        case 'hire':
          aVal = a.hire_period_days; bVal = b.hire_period_days; break;
        case 'created':
          aVal = new Date(a.created_at).getTime(); bVal = new Date(b.created_at).getTime(); break;
        case 'updated':
          aVal = new Date(a.updated_at).getTime(); bVal = new Date(b.updated_at).getTime(); break;
        default:
          aVal = a.size; bVal = b.size;
      }
      return sortDir === 'asc' ? aVal - bVal : bVal - aVal;
    });

  const selectedSkip = skips.find(s => s.id === selectedSkipId);

  if (loading) {
    return (
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
          <CircularProgress />
        </Box>
      </ThemeProvider>
    );
  }

  if (error) {
    return (
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <StyledContainer>
          <Typography color="error" align="center">
            {error}
          </Typography>
        </StyledContainer>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Slide in={!!selectedSkip} direction="up" mountOnEnter unmountOnExit timeout={300}>
        <Paper elevation={8} sx={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          width: { xs: 'calc(100vw - 16px)', sm: '100vw' },
          zIndex: 1300,
          bgcolor: 'rgba(24, 26, 32, 0.98)',
          backdropFilter: 'blur(10px)',
          color: '#fff',
          px: { xs: 1, sm: 3 },
          py: { xs: 1.5, sm: 2 },
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'stretch', sm: 'center' },
          justifyContent: 'space-between',
          gap: { xs: 1.5, sm: 2 },
          boxShadow: '0 -4px 24px rgba(0,0,0,0.18)',
          borderTop: '1px solid rgba(255,255,255,0.1)',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            width: '40px',
            height: '4px',
            bgcolor: 'rgba(255,255,255,0.2)',
            borderRadius: '2px',
            marginTop: '8px'
          }
        }}>
          {/* Mobile Layout */}
          <Box 
            sx={{ 
              display: { xs: 'flex', sm: 'none' },
              flexDirection: 'column',
              width: '100%',
              gap: 1
            }}
          >
            <Box 
              sx={{ 
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%'
              }}
            >
              <Typography variant="h6" fontWeight={700} color="primary">
                £{selectedSkip && (selectedSkip.price_before_vat + (selectedSkip.price_before_vat * selectedSkip.vat / 100)).toFixed(2)}
              </Typography>
            </Box>
            <Typography variant="subtitle1" fontWeight={700}>
              {selectedSkip?.size} Yard Skip
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                color: 'text.secondary',
                display: 'flex',
                alignItems: 'center',
                gap: 0.5
              }}
            >
              <AccessTimeIcon sx={{ fontSize: 16 }} />
              {selectedSkip?.hire_period_days} day hire
            </Typography>
            <Box 
              sx={{ 
                display: 'flex',
                gap: 1,
                width: '100%',
                mt: 0.5
              }}
            >
              <Button 
                variant="outlined" 
                color="inherit" 
                onClick={() => setSelectedSkipId(null)} 
                size="small"
                startIcon={<ArrowBackIcon />}
                sx={{ 
                  fontWeight: 600,
                  borderColor: 'rgba(255,255,255,0.2)',
                  flex: 1,
                  py: 1,
                  '&:hover': {
                    borderColor: 'rgba(255,255,255,0.3)',
                    bgcolor: 'rgba(255,255,255,0.05)'
                  }
                }}
              >
                Back
              </Button>
              <Button 
                variant="contained" 
                color="primary" 
                onClick={() => {
                  console.log('Selected skip:', selectedSkip);
                }}
                size="small"
                endIcon={<ArrowForwardIcon />}
                sx={{ 
                  fontWeight: 600,
                  flex: 1,
                  py: 1,
                  '&:hover': {
                    bgcolor: 'primary.dark'
                  }
                }}
              >
                Continue
              </Button>
            </Box>
          </Box>

          {/* Desktop Layout */}
          <Box 
            sx={{ 
              display: { xs: 'none', sm: 'flex' },
              alignItems: 'center',
              gap: 2
            }}
          >
            <Box 
              sx={{ 
                width: 48, 
                height: 48, 
                borderRadius: '12px',
                bgcolor: 'primary.main',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 700,
                fontSize: '1.25rem'
              }}
            >
              {selectedSkip?.size}
            </Box>
            <Box display="flex" flexDirection="column" gap={0.5}>
              <Box display="flex" alignItems="center" gap={1}>
                <Typography variant="subtitle1" fontWeight={700}>{selectedSkip?.size} Yard Skip</Typography>
                <Typography 
                  variant="caption" 
                  sx={{ 
                    bgcolor: 'rgba(255,255,255,0.1)',
                    px: 1,
                    py: 0.25,
                    borderRadius: '4px',
                    color: 'text.secondary'
                  }}
                >
                  {selectedSkip?.hire_period_days} day hire
                </Typography>
              </Box>
              <Typography variant="h6" fontWeight={700} color="primary">
                £{selectedSkip && (selectedSkip.price_before_vat + (selectedSkip.price_before_vat * selectedSkip.vat / 100)).toFixed(2)}
              </Typography>
            </Box>
          </Box>
          <Box 
            sx={{ 
              display: { xs: 'none', sm: 'flex' },
              gap: 1
            }}
          >
            <Button 
              variant="outlined" 
              color="inherit" 
              onClick={() => setSelectedSkipId(null)} 
              size="small"
              startIcon={<ArrowBackIcon />}
              sx={{ 
                fontWeight: 600,
                borderColor: 'rgba(255,255,255,0.2)',
                '&:hover': {
                  borderColor: 'rgba(255,255,255,0.3)',
                  bgcolor: 'rgba(255,255,255,0.05)'
                }
              }}
            >
              Back
            </Button>
            <Button 
              variant="contained" 
              color="primary" 
              onClick={() => {
                console.log('Selected skip:', selectedSkip);
              }}
              size="small"
              endIcon={<ArrowForwardIcon />}
              sx={{ 
                fontWeight: 600,
                '&:hover': {
                  bgcolor: 'primary.dark'
                }
              }}
            >
              Continue
            </Button>
          </Box>
        </Paper>
      </Slide>
      <StyledContainer>
        <Title variant="h5" sx={{ fontWeight: 700, marginBottom: '1rem!important' }}>
          Choose Your Skip Size
        </Title>
        <p style={{ marginBottom: '2rem', color: '#9ca3af' }}>
          Select the skip size that best suits your needs
        </p>
        <ControlsBox>
          <Autocomplete
            freeSolo
            options={Array.from(new Set(skips.map(s => `${s.size} Yard`))) as string[]}
            inputValue={search}
            onInputChange={(_, value) => setSearch(value)}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                size="small"
                placeholder="Search by size..."
                InputProps={{
                  ...params.InputProps,
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
                fullWidth
              />
            )}
            sx={{ 
              width: '100%',
              '& .MuiOutlinedInput-root': {
                height: { xs: '40px', sm: '48px' }
              }
            }}
          />
          <Box 
            display="flex" 
            alignItems="center" 
            gap={2} 
            width="100%"
            sx={{ 
              flexDirection: { xs: 'row', sm: 'row' },
              justifyContent: { xs: 'space-between', sm: 'flex-end' },
              minWidth: { xs: '100%', sm: 'auto' }
            }}
          >
            <Select
              value={sort}
              onChange={e => setSort(e.target.value)}
              size="small"
              sx={{ 
                minWidth: { xs: '80%', sm: '160px' },
                background: '#23272f',
                borderRadius: 2,
                fontWeight: 600,
                height: { xs: '40px', sm: '48px' }
              }}
              displayEmpty
              renderValue={selected => {
                const option = sortOptions.find(opt => opt.value === selected);
                return (
                  <Box display="flex" alignItems="center">
                    {option?.icon}
                    <Box>
                      {option?.label}
                    </Box>
                  </Box>
                );
              }}
            >
              {sortOptions.map(option => (
                <MenuItem key={option.value} value={option.value} sx={{ display: 'flex', alignItems: 'center', fontWeight: 600 }}>
                  {option.icon}
                  {option.label}
                </MenuItem>
              ))}
            </Select>
            <Tooltip title={sortDir === 'asc' ? 'Ascending' : 'Descending'}>
              <IconButton
                onClick={() => setSortDir(sortDir === 'asc' ? 'desc' : 'asc')}
                color={sortDir === 'asc' ? 'primary' : 'secondary'}
                sx={{ 
                  ml: 1,
                  width: { xs: '40px', sm: '48px' },
                  height: { xs: '40px', sm: '48px' }
                }}
              >
                {sortDir === 'asc' ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />}
              </IconButton>
            </Tooltip>
          </Box>
        </ControlsBox>
        <Grid container spacing={5} justifyContent="center">
          {filteredSkips.length === 0 ? (
            <Grid sx={{ gridColumn: 'span 12' }}>
              <Typography align="center" color="text.secondary">
                No skips found.
              </Typography>
            </Grid>
          ) : (
            filteredSkips.map((skip) => (
              <Grid sx={{ gridColumn: { xs: 'span 12', sm: 'span 6', md: 'span 4' } }} key={skip.id}>
                <SkipCard
                  skip={skip}
                  isSelected={selectedSkipId === skip.id}
                  onClick={() => handleSkipSelect(skip.id)}
                />
              </Grid>
            ))
          )}
        </Grid>
      </StyledContainer>
    </ThemeProvider>
  );
}

export default App; 