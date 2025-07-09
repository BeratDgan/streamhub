import React, { useState, useEffect, useCallback } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Button,
  Box,
  Chip,
  Alert,
  CircularProgress,
  Avatar,
  Skeleton,
  Fade,
  IconButton
} from '@mui/material';
import {
  PlayArrow as PlayIcon,
  Person as PersonIcon,
  Schedule as ScheduleIcon,
  Refresh as RefreshIcon,
  LiveTv as LiveTvIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { streamService } from '../services/streamService';

const StreamCard = ({ stream, onWatch }) => (
  <Fade in timeout={300}>
    <Grid item xs={12} sm={6} md={4}>
      <Card 
        className="stream-card"
        sx={{ 
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: 'linear-gradient(145deg, rgba(26, 26, 26, 0.9), rgba(42, 42, 42, 0.9))',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(156, 39, 176, 0.2)',
          '&:hover': {
            border: '1px solid rgba(156, 39, 176, 0.5)',
            transform: 'translateY(-8px)',
            boxShadow: '0 20px 40px rgba(156, 39, 176, 0.2)',
          }
        }}
      >
        {/* Stream Thumbnail */}
        <CardMedia
          sx={{
            height: 200,
            background: 'linear-gradient(135deg, #9c27b0, #e91e63, #ff9800)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <PlayIcon sx={{ fontSize: 60, color: 'white', opacity: 0.9, zIndex: 2 }} />
          
          {/* Animated background effect */}
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.1) 0%, transparent 70%)',
              animation: 'pulse 3s ease-in-out infinite',
            }}
          />
          
          <Chip
            label="LIVE"
            color="error"
            size="small"
            sx={{
              position: 'absolute',
              top: 12,
              left: 12,
              fontWeight: 'bold',
              boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
              zIndex: 3
            }}
          />
          
          {/* Viewer count placeholder */}
          <Box
            sx={{
              position: 'absolute',
              bottom: 12,
              right: 12,
              bgcolor: 'rgba(0,0,0,0.7)',
              color: 'white',
              px: 1,
              py: 0.5,
              borderRadius: 1,
              fontSize: '0.75rem',
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              zIndex: 3
            }}
          >
            <PersonIcon sx={{ fontSize: 14 }} />
            {Math.floor(Math.random() * 500) + 10}
          </Box>
        </CardMedia>
        
        <CardContent sx={{ flexGrow: 1, p: 2 }}>
          <Typography variant="h6" component="h2" gutterBottom noWrap sx={{ fontWeight: 600 }}>
            {stream.title}
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Avatar 
              sx={{ 
                width: 32, 
                height: 32, 
                mr: 1, 
                fontSize: '0.875rem',
                background: 'linear-gradient(45deg, #9c27b0, #e91e63)'
              }}
            >
              {stream.user.username.charAt(0).toUpperCase()}
            </Avatar>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="body2" color="text.primary" noWrap sx={{ fontWeight: 500 }}>
                {stream.user.username}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                Streamer
              </Typography>
            </Box>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <ScheduleIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
            <Typography variant="body2" color="text.secondary">
              {new Date(stream.startedAt).toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </Typography>
          </Box>
        </CardContent>
        
        <CardActions sx={{ px: 2, pb: 2 }}>
          <Button
            variant="contained"
            fullWidth
            startIcon={<PlayIcon />}
            onClick={() => onWatch(stream.streamKey)}
            sx={{
              background: 'linear-gradient(45deg, #9c27b0, #e91e63)',
              '&:hover': {
                background: 'linear-gradient(45deg, #7b1fa2, #c2185b)',
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 16px rgba(156, 39, 176, 0.4)',
              },
              fontWeight: 600
            }}
          >
            Watch Stream
          </Button>
        </CardActions>
      </Card>
    </Grid>
  </Fade>
);

const LoadingSkeleton = () => (
  <Grid container spacing={3}>
    {[1, 2, 3, 4, 5, 6].map((item) => (
      <Grid item xs={12} sm={6} md={4} key={item}>
        <Card sx={{ height: '100%' }}>
          <Skeleton variant="rectangular" height={200} />
          <CardContent>
            <Skeleton variant="text" height={40} />
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
              <Skeleton variant="circular" width={32} height={32} />
              <Box sx={{ ml: 1, flex: 1 }}>
                <Skeleton variant="text" width="60%" />
                <Skeleton variant="text" width="40%" />
              </Box>
            </Box>
            <Skeleton variant="text" width="50%" sx={{ mt: 1 }} />
          </CardContent>
        </Card>
      </Grid>
    ))}
  </Grid>
);

const StreamList = () => {
  const navigate = useNavigate();
  const [streams, setStreams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const fetchStreams = useCallback(async (showRefreshing = false) => {
    try {
      if (showRefreshing) setRefreshing(true);
      else setLoading(true);
      
      const activeStreams = await streamService.getActiveStreams();
      setStreams(activeStreams);
      setError('');
    } catch {
      setError('Failed to load live streams. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchStreams();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      fetchStreams(true);
    }, 30000);
    
    return () => clearInterval(interval);
  }, [fetchStreams]);

  const handleWatchStream = (streamKey) => {
    navigate(`/watch/${streamKey}`);
  };

  const handleRefresh = () => {
    fetchStreams(true);
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Box>
            <Typography variant="h3" component="h1" gutterBottom>
              Live Streams
            </Typography>
            <Skeleton variant="text" width={200} />
          </Box>
        </Box>
        <LoadingSkeleton />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
            Live Streams
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="h6" color="text.secondary">
              {streams.length} stream{streams.length !== 1 ? 's' : ''} currently live
            </Typography>
            <Chip 
              icon={<LiveTvIcon />} 
              label="LIVE" 
              color="error" 
              variant="outlined" 
              size="small" 
            />
          </Box>
        </Box>
        
        <IconButton
          onClick={handleRefresh}
          disabled={refreshing}
          sx={{
            bgcolor: 'background.paper',
            '&:hover': { bgcolor: 'action.hover' }
          }}
        >
          <RefreshIcon 
            sx={{ 
              animation: refreshing ? 'spin 1s linear infinite' : 'none',
              '@keyframes spin': {
                '0%': { transform: 'rotate(0deg)' },
                '100%': { transform: 'rotate(360deg)' }
              }
            }} 
          />
        </IconButton>
      </Box>

      {error && (
        <Alert 
          severity="error" 
          sx={{ mb: 3 }} 
          onClose={() => setError('')}
          action={
            <Button color="inherit" size="small" onClick={handleRefresh}>
              Retry
            </Button>
          }
        >
          {error}
        </Alert>
      )}

      {streams.length === 0 ? (
        <Box
          sx={{
            textAlign: 'center',
            py: 8,
            px: 4,
            background: 'linear-gradient(135deg, rgba(26, 26, 26, 0.8), rgba(42, 42, 42, 0.8))',
            backdropFilter: 'blur(20px)',
            borderRadius: 3,
            border: '1px solid rgba(156, 39, 176, 0.2)',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {/* Background decoration */}
          <Box
            sx={{
              position: 'absolute',
              top: -50,
              right: -50,
              width: 200,
              height: 200,
              background: 'radial-gradient(circle, rgba(156, 39, 176, 0.1) 0%, transparent 70%)',
              borderRadius: '50%',
            }}
          />
          
          <LiveTvIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
            No Live Streams
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 400, mx: 'auto' }}>
            There are currently no active streams. Check back later or become a streamer yourself and be the first to go live!
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              onClick={() => navigate('/dashboard')}
              sx={{
                background: 'linear-gradient(45deg, #9c27b0, #e91e63)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #7b1fa2, #c2185b)',
                },
              }}
            >
              Go to Dashboard
            </Button>
            <Button
              variant="outlined"
              onClick={handleRefresh}
              disabled={refreshing}
              startIcon={refreshing ? <CircularProgress size={16} /> : <RefreshIcon />}
            >
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </Button>
          </Box>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {streams.map((stream) => (
            <StreamCard 
              key={stream._id} 
              stream={stream} 
              onWatch={handleWatchStream}
            />
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default StreamList;
