import React, { useRef, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Paper,
  Box,
  Button,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  Avatar,
  Chip,
  IconButton,
  Skeleton
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Person as PersonIcon,
  Schedule as ScheduleIcon,
  Refresh as RefreshIcon,
  Fullscreen as FullscreenIcon,
  VolumeUp as VolumeUpIcon,
  VolumeOff as VolumeOffIcon
} from '@mui/icons-material';
import { streamService } from '../services/streamService';

const StreamPlayer = () => {
  const { streamKey } = useParams();
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const hlsRef = useRef(null);
  const containerRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [streamInfo, setStreamInfo] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const fetchAndInitialize = async () => {
      await fetchStreamInfo();
      await initializePlayer();
    };
    
    fetchAndInitialize();
    
    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
      }
    };
  }, [streamKey]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchStreamInfo = async () => {
    try {
      const streams = await streamService.getActiveStreams();
      const stream = streams.find(s => s.streamKey === streamKey);
      
      if (!stream) {
        setError('Stream not found or is no longer live');
        setLoading(false);
        return;
      }
      
      setStreamInfo(stream);
      setLoading(false);
    } catch {
      setError('Failed to load stream information');
      setLoading(false);
    }
  };

  const initializePlayer = async () => {
    if (hlsRef.current) {
      hlsRef.current.destroy();
    }

    const streamUrl = `http://localhost:8000/live/${streamKey}/index.m3u8`;
    console.log('Initializing player with URL:', streamUrl);
    console.log('Video element:', videoRef.current);

    try {
      // Dinamik olarak HLS.js import et
      const HlsModule = await import('hls.js');
      const Hls = HlsModule.default;
      
      console.log('HLS.isSupported():', Hls.isSupported());

      if (Hls.isSupported() && videoRef.current) {
        const hls = new Hls({
          enableWorker: false,
          lowLatencyMode: true,
          backBufferLength: 90,
          maxBufferLength: 30,
          maxMaxBufferLength: 600,
          maxBufferSize: 60 * 1000 * 1000,
          maxBufferHole: 0.5,
          liveSyncDurationCount: 3,
          liveMaxLatencyDurationCount: 10,
        });
        
        hlsRef.current = hls;
        
        // HLS stream URL (assuming RTMP to HLS conversion)
        console.log('Loading HLS source:', streamUrl);
        
        hls.loadSource(streamUrl);
        hls.attachMedia(videoRef.current);
        
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          setLoading(false);
          setError('');
          videoRef.current?.play()?.then(() => {
            // Video started playing
          }).catch(playError => {
            console.log('Autoplay prevented:', playError);
          });
        });
        
        hls.on(Hls.Events.ERROR, (event, data) => {
          console.error('HLS Error:', data);
          
          if (data.fatal) {
            switch (data.type) {
              case Hls.ErrorTypes.NETWORK_ERROR:
                if (retryCount < 3) {
                  setTimeout(() => {
                    hls.startLoad();
                    setRetryCount(prev => prev + 1);
                  }, 1000 * (retryCount + 1));
                } else {
                  setError('Network error: Unable to load stream. Please check your connection.');
                }
                break;
              case Hls.ErrorTypes.MEDIA_ERROR:
                if (retryCount < 3) {
                  hls.recoverMediaError();
                  setRetryCount(prev => prev + 1);
                } else {
                  setError('Media error: Unable to play stream.');
                }
                break;
              default:
                setError('An unknown error occurred while loading the stream');
                break;
            }
          }
        });

        // Video event listeners
        if (videoRef.current) {
          const handleVolumeChange = () => {
            setIsMuted(videoRef.current?.muted || false);
          };
          
          videoRef.current.addEventListener('volumechange', handleVolumeChange);
        }

      } else if (videoRef.current?.canPlayType && videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
        // Native HLS support (Safari)
        console.log('Using native HLS support');
        videoRef.current.src = streamUrl;
        videoRef.current.addEventListener('loadeddata', () => {
          setLoading(false);
          setError('');
        });
        videoRef.current.addEventListener('error', (e) => {
          console.error('Native video error:', e);
          setError('Failed to load stream');
          setLoading(false);
        });
        videoRef.current.load();
      } else {
        console.log('No HLS support detected');
        setError('HLS is not supported in this browser. Please use a modern browser like Chrome, Firefox, or Safari.');
        setLoading(false);
      }
    } catch (error) {
      console.error('Failed to import HLS.js:', error);
      // Fallback: Native HLS denemesi
      if (videoRef.current?.canPlayType && videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
        console.log('Fallback to native HLS support');
        videoRef.current.src = streamUrl;
        videoRef.current.addEventListener('loadeddata', () => {
          setLoading(false);
          setError('');
        });
        videoRef.current.addEventListener('error', (e) => {
          console.error('Native video error:', e);
          setError('Failed to load stream');
          setLoading(false);
        });
        videoRef.current.load();
      } else {
        setError('HLS is not supported in this browser. Please use a modern browser like Chrome, Firefox, or Safari.');
        setLoading(false);
      }
    }
  };

  const handleRetry = async () => {
    setLoading(true);
    setError('');
    setRetryCount(0);
    await initializePlayer();
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
    }
  };

  const toggleFullscreen = async () => {
    if (!document.fullscreenElement) {
      await containerRef.current?.requestFullscreen();
    } else {
      await document.exitFullscreen();
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/streams')}
          sx={{ mb: 3 }}
        >
          Back to Streams
        </Button>
        
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
          <Box sx={{ flex: 1 }}>
            <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 2 }} />
            <Skeleton variant="text" height={60} sx={{ mt: 2 }} />
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
              <Skeleton variant="circular" width={40} height={40} sx={{ mr: 2 }} />
              <Box sx={{ flex: 1 }}>
                <Skeleton variant="text" height={30} />
                <Skeleton variant="text" height={20} />
              </Box>
            </Box>
          </Box>
          <Box sx={{ width: { xs: '100%', md: '300px' } }}>
            <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 2 }} />
          </Box>
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/streams')}
          sx={{ mb: 3 }}
        >
          Back to Streams
        </Button>
        <Alert 
          severity="error" 
          action={
            <Button color="inherit" size="small" onClick={handleRetry}>
              <RefreshIcon sx={{ mr: 1 }} />
              Retry
            </Button>
          }
        >
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate('/streams')}
        sx={{ mb: 3 }}
      >
        Back to Streams
      </Button>

      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
        {/* Video Player */}
        <Box sx={{ flex: 1 }}>
          <Paper 
            elevation={3} 
            sx={{ 
              overflow: 'hidden', 
              position: 'relative',
              backgroundColor: '#000',
              borderRadius: 2
            }}
            ref={containerRef}
          >
            <div className="video-container">
              <video
                ref={videoRef}
                controls
                autoPlay
                muted
                playsInline
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                }}
              />
            </div>
            
            {/* Custom video controls overlay */}
            <Box
              sx={{
                position: 'absolute',
                top: 16,
                right: 16,
                display: 'flex',
                gap: 1,
                opacity: 0.8,
                '&:hover': { opacity: 1 }
              }}
            >
              <IconButton
                onClick={toggleMute}
                sx={{ 
                  bgcolor: 'rgba(0,0,0,0.5)', 
                  color: 'white',
                  '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' }
                }}
              >
                {isMuted ? <VolumeOffIcon /> : <VolumeUpIcon />}
              </IconButton>
              <IconButton
                onClick={toggleFullscreen}
                sx={{ 
                  bgcolor: 'rgba(0,0,0,0.5)', 
                  color: 'white',
                  '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' }
                }}
              >
                <FullscreenIcon />
              </IconButton>
            </Box>
          </Paper>
          
          {streamInfo && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="h4" component="h1" gutterBottom>
                {streamInfo.title}
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar 
                  sx={{ 
                    mr: 2, 
                    width: 48, 
                    height: 48,
                    background: 'linear-gradient(45deg, #9c27b0, #e91e63)'
                  }}
                >
                  {streamInfo.user.username.charAt(0).toUpperCase()}
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6">
                    {streamInfo.user.username}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                    <Chip 
                      label="LIVE" 
                      color="error" 
                      size="small" 
                      sx={{ fontWeight: 'bold' }}
                    />
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <ScheduleIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary">
                        Started {new Date(streamInfo.startedAt).toLocaleString()}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Box>
          )}
        </Box>

        {/* Chat/Info Sidebar */}
        <Box sx={{ width: { xs: '100%', md: '300px' } }}>
          <Card sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Stream Information
              </Typography>
              {streamInfo && (
                <Box>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Streamer:</strong> {streamInfo.user.username}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Started:</strong> {new Date(streamInfo.startedAt).toLocaleString()}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Status:</strong> 
                    <Chip 
                      label={streamInfo.isLive ? 'Live' : 'Offline'} 
                      color={streamInfo.isLive ? 'success' : 'default'} 
                      size="small" 
                      sx={{ ml: 1 }}
                    />
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
          
          {/* Placeholder for future chat feature */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Live Chat
              </Typography>
              <Box 
                sx={{ 
                  height: 300, 
                  bgcolor: 'background.default', 
                  borderRadius: 1, 
                  p: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Typography variant="body2" color="text.secondary" align="center">
                  💬 Chat feature coming soon!<br />
                  Connect with other viewers and the streamer.
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Container>
  );
};

export default StreamPlayer;
