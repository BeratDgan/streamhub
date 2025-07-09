import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Box,
  Alert,
  Avatar,
  TextField,
  Fade,
  Paper
} from '@mui/material';
import {
  LiveTv as LiveIcon,
  Person as PersonIcon,
  Schedule as ScheduleIcon,
  VideoCall as VideoCallIcon,
  Settings as SettingsIcon,
  Edit as EditIcon,
  Visibility as ViewIcon
} from '@mui/icons-material';
import { useAuth } from '../hooks/useAuth';
import { streamService } from '../services/streamService';

const StatCard = ({ title, value, icon, color, description }) => (
  <Fade in timeout={300}>
    <Card 
      sx={{ 
        height: '100%',
        background: `linear-gradient(135deg, ${color}15, ${color}05)`,
        border: `1px solid ${color}30`,
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: `0 8px 25px ${color}40`,
        },
        transition: 'all 0.3s ease'
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar sx={{ bgcolor: color, mr: 2 }}>
            {icon}
          </Avatar>
          <Box>
            <Typography variant="h4" component="div" sx={{ fontWeight: 700 }}>
              {value}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {title}
            </Typography>
          </Box>
        </Box>
        {description && (
          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>
        )}
      </CardContent>
    </Card>
  </Fade>
);

const QuickActionCard = ({ title, description, icon, onClick, color, disabled }) => (
  <Card 
    sx={{ 
      height: '100%',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.6 : 1,
      background: 'linear-gradient(135deg, rgba(26, 26, 26, 0.8), rgba(42, 42, 42, 0.8))',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(156, 39, 176, 0.2)',
      '&:hover': disabled ? {} : {
        transform: 'translateY(-4px)',
        border: '1px solid rgba(156, 39, 176, 0.5)',
        boxShadow: '0 8px 25px rgba(156, 39, 176, 0.3)',
      },
      transition: 'all 0.3s ease'
    }}
    onClick={disabled ? undefined : onClick}
  >
    <CardContent sx={{ textAlign: 'center', py: 4 }}>
      <Avatar 
        sx={{ 
          bgcolor: color, 
          width: 64, 
          height: 64, 
          mx: 'auto', 
          mb: 2,
          fontSize: '2rem'
        }}
      >
        {icon}
      </Avatar>
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {description}
      </Typography>
    </CardContent>
  </Card>
);

const Dashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [userStreams, setUserStreams] = useState([]);
  const [isLive, setIsLive] = useState(false);
  const [streamTitle, setStreamTitle] = useState('');

  useEffect(() => {
    fetchUserStreams();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchUserStreams = async () => {
    try {
      const streams = await streamService.getActiveStreams();
      const myStreams = streams.filter(stream => stream.user._id === user.id);
      setUserStreams(myStreams);
      setIsLive(myStreams.some(stream => stream.isLive));
    } catch {
      setError('Failed to load streams');
    }
  };

  const handleUpdateStreamTitle = async () => {
    if (!streamTitle.trim()) {
      setError('Please enter a title for your stream');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      // Update stream title via streamService
      await streamService.updateStreamTitle(streamTitle);
      setSuccess('Stream title updated successfully!');
      await fetchUserStreams();
      setStreamTitle(''); // Clear the input
    } catch (err) {
      setError(err.message || 'Failed to update stream title');
    } finally {
      setLoading(false);
    }
  };

  // Calculate stats
  const totalStreams = userStreams.length;
  const accountAge = user?.createdAt ? 
    Math.floor((Date.now() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24)) : 0;

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
          Dashboard
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Welcome back, <span className="gradient-text">{user?.username}</span>!
        </Typography>
      </Box>

      {/* Alerts */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess('')}>
          {success}
        </Alert>
      )}

      <Grid container spacing={4}>
        {/* Stats Cards */}
        <Grid item xs={12} md={3}>
          <StatCard
            title="Account Type"
            value={user?.isStreamer ? 'Streamer' : 'Viewer'}
            icon={<PersonIcon />}
            color="#9c27b0"
            description={user?.isStreamer ? 'You can broadcast live' : 'Upgrade to stream'}
          />
        </Grid>
        
        <Grid item xs={12} md={3}>
          <StatCard
            title="Stream Status"
            value={isLive ? 'LIVE' : 'Offline'}
            icon={<LiveIcon />}
            color={isLive ? "#f44336" : "#757575"}
            description={isLive ? 'Currently broadcasting' : 'Ready to go live'}
          />
        </Grid>

        {user?.isStreamer && (
          <>
            <Grid item xs={12} md={3}>
              <StatCard
                title="Total Streams"
                value={totalStreams}
                icon={<VideoCallIcon />}
                color="#2196f3"
                description="Streams this session"
              />
            </Grid>
            
            <Grid item xs={12} md={3}>
              <StatCard
                title="Days Active"
                value={accountAge}
                icon={<ScheduleIcon />}
                color="#4caf50"
                description="Since account creation"
              />
            </Grid>
          </>
        )}

        {/* Stream Controls */}
        {user?.isStreamer && (
          <Grid item xs={12}>
            <Paper 
              sx={{ 
                p: 4, 
                background: 'linear-gradient(135deg, rgba(26, 26, 26, 0.8), rgba(42, 42, 42, 0.8))',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(156, 39, 176, 0.2)',
              }}
            >
              <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 600 }}>
                Stream Status
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <LiveIcon color={isLive ? 'error' : 'disabled'} sx={{ mr: 2, fontSize: 32 }} />
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6">
                    Status: {isLive ? 'LIVE' : 'Offline'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {isLive ? 'Your stream is currently broadcasting from OBS' : 'Start streaming from your OBS software'}
                  </Typography>
                </Box>
              </Box>
              
              {isLive && (
                <Box sx={{ mb: 3 }}>
                  <TextField
                    fullWidth
                    label="Stream Title"
                    value={streamTitle}
                    onChange={(e) => setStreamTitle(e.target.value)}
                    sx={{ mb: 2 }}
                  />
                  <Button
                    variant="contained"
                    startIcon={<EditIcon />}
                    onClick={handleUpdateStreamTitle}
                    disabled={loading}
                    sx={{ mr: 2 }}
                  >
                    Update Title
                  </Button>
                </Box>
              )}
              
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button
                  variant="outlined"
                  size="large"
                  startIcon={<SettingsIcon />}
                  onClick={() => window.location.href = '/stream-key'}
                  sx={{ minWidth: 150 }}
                >
                  Get Stream Key
                </Button>
                
                <Button
                  variant="outlined"
                  size="large"
                  startIcon={<ViewIcon />}
                  onClick={() => window.location.href = '/streams'}
                  sx={{ minWidth: 150 }}
                >
                  View All Streams
                </Button>
              </Box>
            </Paper>
          </Grid>
        )}

        {/* Quick Actions */}
        <Grid item xs={12}>
          <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
            Quick Actions
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={4}>
              <QuickActionCard
                title="Browse Streams"
                description="Discover live content from streamers around the world"
                icon={<ViewIcon />}
                onClick={() => window.location.href = '/streams'}
                color="#9c27b0"
              />
            </Grid>
            
            <Grid item xs={12} sm={6} md={4}>
              <QuickActionCard
                title="Profile Settings"
                description="Manage your account settings and preferences"
                icon={<PersonIcon />}
                onClick={() => window.location.href = '/profile'}
                color="#2196f3"
              />
            </Grid>
            
            {user?.isStreamer && (
              <Grid item xs={12} sm={6} md={4}>
                <QuickActionCard
                  title="Stream Key"
                  description="Get your private key for streaming software"
                  icon={<SettingsIcon />}
                  onClick={() => window.location.href = '/stream-key'}
                  color="#ff9800"
                />
              </Grid>
            )}
          </Grid>
        </Grid>

        {/* Recent Streams */}
        {user?.isStreamer && (
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 600 }}>
                Recent Activity
              </Typography>
              
              {userStreams.length > 0 ? (
                <Grid container spacing={2}>
                  {userStreams.map((stream) => (
                    <Grid item xs={12} sm={6} md={4} key={stream._id}>
                      <Card variant="outlined" sx={{ height: '100%' }}>
                        <CardContent>
                          <Typography variant="h6" noWrap gutterBottom>
                            {stream.title}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            Started: {new Date(stream.startedAt).toLocaleString()}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Chip
                              label={stream.isLive ? 'LIVE' : 'Ended'}
                              color={stream.isLive ? 'error' : 'default'}
                              size="small"
                            />
                            {stream.isLive && (
                              <Chip
                                label={`${Math.floor(Math.random() * 50) + 5} viewers`}
                                size="small"
                                variant="outlined"
                              />
                            )}
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <VideoCallIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="h6" gutterBottom>
                    No Recent Streams
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Start streaming from OBS to see your content here!
                  </Typography>
                </Box>
              )}
            </Paper>
          </Grid>
        )}
      </Grid>
    </Container>
  );
};

export default Dashboard;
