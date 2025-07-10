import React from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Paper,
  Grid,
  Card,
  CardContent,
  Icon
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { PlayArrow, People, VideoCall } from '@mui/icons-material';

const Home = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%)',
          color: 'white',
          py: { xs: 12, md: 18 },
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at 20% 50%, rgba(120, 119, 198, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)',
            opacity: 0.8
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'url("data:image/svg+xml,%3Csvg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.03"%3E%3Cpath d="M20 20c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10zm10 0c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
            animation: 'float 20s ease-in-out infinite',
          },
          '@keyframes float': {
            '0%, 100%': { transform: 'translateY(0px)' },
            '50%': { transform: 'translateY(-20px)' }
          }
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Typography 
            variant="h1" 
            component="h1" 
            gutterBottom 
            sx={{ 
              fontWeight: 800,
              fontSize: { xs: '3rem', md: '4.5rem' },
              mb: 3,
              background: 'linear-gradient(45deg, #ffffff 30%, #f1f5f9 90%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              textShadow: '0 4px 8px rgba(0,0,0,0.3)',
              letterSpacing: '-0.02em'
            }}
          >
            StreamHub
          </Typography>
          <Typography 
            variant="h5" 
            sx={{ 
              mb: 6, 
              opacity: 0.95,
              fontSize: { xs: '1.3rem', md: '1.6rem' },
              maxWidth: '650px',
              mx: 'auto',
              lineHeight: 1.6,
              fontWeight: 400,
              color: 'rgba(255, 255, 255, 0.9)'
            }}
          >
            The next-generation streaming platform designed for creators who demand excellence
          </Typography>
            {!isAuthenticated ? (
            <Box sx={{ mt: 5 }}>
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate('/register')}
                sx={{
                  mr: 3,
                  mb: { xs: 3, sm: 0 },
                  background: 'linear-gradient(45deg, #ffffff 0%, #f8fafc 100%)',
                  color: '#1e293b',
                  fontWeight: 700,
                  fontSize: '1.1rem',
                  px: 6,
                  py: 2,
                  borderRadius: 3,
                  boxShadow: '0 8px 32px rgba(0,0,0,0.12), 0 4px 16px rgba(0,0,0,0.08)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  textTransform: 'none',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #f8fafc 0%, #e2e8f0 100%)',
                    transform: 'translateY(-3px)',
                    boxShadow: '0 12px 48px rgba(0,0,0,0.15), 0 6px 24px rgba(0,0,0,0.1)'
                  },
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
              >
                Get Started Free
              </Button>
              <Button
                variant="outlined"
                size="large"
                onClick={() => navigate('/streams')}
                sx={{
                  borderColor: 'rgba(255,255,255,0.4)',
                  color: 'white',
                  fontWeight: 600,
                  fontSize: '1.1rem',
                  px: 6,
                  py: 2,
                  borderRadius: 3,
                  borderWidth: 2,
                  textTransform: 'none',
                  backdropFilter: 'blur(10px)',
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  '&:hover': {
                    borderColor: 'rgba(255,255,255,0.6)',
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    transform: 'translateY(-3px)',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                    borderWidth: 2
                  },
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
              >
                Explore Streams
              </Button>
            </Box>
          ) : (
            <Box sx={{ mt: 5 }}>
              <Typography variant="h6" sx={{ mb: 4, opacity: 0.95, fontSize: '1.2rem', fontWeight: 500 }}>
                Welcome back, {user?.username}! 🎬
              </Typography>
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate('/dashboard')}
                sx={{
                  mr: 3,
                  mb: { xs: 3, sm: 0 },
                  background: 'linear-gradient(45deg, #ffffff 0%, #f8fafc 100%)',
                  color: '#1e293b',
                  fontWeight: 700,
                  fontSize: '1.1rem',
                  px: 6,
                  py: 2,
                  borderRadius: 3,
                  boxShadow: '0 8px 32px rgba(0,0,0,0.12), 0 4px 16px rgba(0,0,0,0.08)',
                  textTransform: 'none',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #f8fafc 0%, #e2e8f0 100%)',
                    transform: 'translateY(-3px)',
                    boxShadow: '0 12px 48px rgba(0,0,0,0.15), 0 6px 24px rgba(0,0,0,0.1)'
                  },
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
              >
                Creator Dashboard
              </Button>
              <Button
                variant="outlined"
                size="large"
                onClick={() => navigate('/streams')}
                sx={{
                  borderColor: 'rgba(255,255,255,0.4)',
                  color: 'white',
                  fontWeight: 600,
                  fontSize: '1.1rem',
                  px: 6,
                  py: 2,
                  borderRadius: 3,
                  borderWidth: 2,
                  textTransform: 'none',
                  backdropFilter: 'blur(10px)',
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  '&:hover': {
                    borderColor: 'rgba(255,255,255,0.6)',
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    transform: 'translateY(-3px)',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                    borderWidth: 2
                  },
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
              >
                Watch Streams
              </Button>
            </Box>
          )}
        </Container>
      </Box>

      {/* Features Section */}
      <Box sx={{ 
        py: 10, 
        background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)',
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '1px',
          background: 'linear-gradient(90deg, transparent 0%, #e2e8f0 50%, transparent 100%)'
        }
      }}>
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            component="h2"
            textAlign="center"
            sx={{
              mb: 3,
              fontWeight: 700,
              fontSize: { xs: '2rem', md: '2.5rem' },
              color: '#1e293b',
              letterSpacing: '-0.02em'
            }}
          >
            Why Creators Choose StreamHub
          </Typography>
          <Typography
            variant="h6"
            textAlign="center"
            sx={{
              mb: 8,
              color: '#64748b',
              fontSize: '1.1rem',
              fontWeight: 400,
              maxWidth: '600px',
              mx: 'auto'
            }}
          >
            Everything you need to build, grow, and monetize your streaming community
          </Typography>
          <Grid container spacing={5} justifyContent="center">
            <Grid item xs={12} sm={6} md={4}>
              <Card 
                sx={{ 
                  textAlign: 'center', 
                  p: 4, 
                  height: '100%',
                  borderRadius: 4,
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 4px 32px rgba(0,0,0,0.04), 0 2px 16px rgba(0,0,0,0.02)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                  position: 'relative',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '3px',
                    background: 'linear-gradient(90deg, #6366f1 0%, #8b5cf6 100%)',
                    transform: 'scaleX(0)',
                    transformOrigin: 'left',
                    transition: 'transform 0.3s ease'
                  },
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 12px 48px rgba(0,0,0,0.08), 0 6px 24px rgba(0,0,0,0.04)',
                    '&::before': {
                      transform: 'scaleX(1)'
                    }
                  }
                }}
              >
                <CardContent sx={{ p: 0 }}>
                  <Box sx={{ 
                    mb: 3,
                    p: 3,
                    borderRadius: 3,
                    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <PlayArrow sx={{ fontSize: 32, color: 'white' }} />
                  </Box>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, color: '#1e293b', mb: 2 }}>
                    Ultra-Low Latency
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#64748b', lineHeight: 1.6, fontSize: '0.95rem' }}>
                    Stream with industry-leading low latency technology for real-time audience interaction
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Card 
                sx={{ 
                  textAlign: 'center', 
                  p: 4, 
                  height: '100%',
                  borderRadius: 4,
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 4px 32px rgba(0,0,0,0.04), 0 2px 16px rgba(0,0,0,0.02)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                  position: 'relative',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '3px',
                    background: 'linear-gradient(90deg, #8b5cf6 0%, #ec4899 100%)',
                    transform: 'scaleX(0)',
                    transformOrigin: 'left',
                    transition: 'transform 0.3s ease'
                  },
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 12px 48px rgba(0,0,0,0.08), 0 6px 24px rgba(0,0,0,0.04)',
                    '&::before': {
                      transform: 'scaleX(1)'
                    }
                  }
                }}
              >
                <CardContent sx={{ p: 0 }}>
                  <Box sx={{ 
                    mb: 3,
                    p: 3,
                    borderRadius: 3,
                    background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <People sx={{ fontSize: 32, color: 'white' }} />
                  </Box>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, color: '#1e293b', mb: 2 }}>
                    Community Tools
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#64748b', lineHeight: 1.6, fontSize: '0.95rem' }}>
                    Built-in chat, moderation, and engagement features to grow your audience
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Card 
                sx={{ 
                  textAlign: 'center', 
                  p: 4, 
                  height: '100%',
                  borderRadius: 4,
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 4px 32px rgba(0,0,0,0.04), 0 2px 16px rgba(0,0,0,0.02)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                  position: 'relative',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '3px',
                    background: 'linear-gradient(90deg, #ec4899 0%, #f97316 100%)',
                    transform: 'scaleX(0)',
                    transformOrigin: 'left',
                    transition: 'transform 0.3s ease'
                  },
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 12px 48px rgba(0,0,0,0.08), 0 6px 24px rgba(0,0,0,0.04)',
                    '&::before': {
                      transform: 'scaleX(1)'
                    }
                  }
                }}
              >
                <CardContent sx={{ p: 0 }}>
                  <Box sx={{ 
                    mb: 3,
                    p: 3,
                    borderRadius: 3,
                    background: 'linear-gradient(135deg, #ec4899 0%, #f97316 100%)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <VideoCall sx={{ fontSize: 32, color: 'white' }} />
                  </Box>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, color: '#1e293b', mb: 2 }}>
                    One-Click Setup
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#64748b', lineHeight: 1.6, fontSize: '0.95rem' }}>
                    Get streaming in under 60 seconds with our intuitive setup wizard
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #1e293b 0%, #334155 50%, #475569 100%)',
          color: 'white',
          py: 12,
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at 30% 40%, rgba(99, 102, 241, 0.1) 0%, transparent 50%), radial-gradient(circle at 70% 60%, rgba(139, 92, 246, 0.1) 0%, transparent 50%)',
            opacity: 0.8
          }
        }}
      >
        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
          <Typography 
            variant="h2" 
            component="h2" 
            gutterBottom
            sx={{ 
              fontWeight: 800,
              fontSize: { xs: '2.2rem', md: '3rem' },
              mb: 3,
              background: 'linear-gradient(45deg, #ffffff 30%, #e2e8f0 90%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              letterSpacing: '-0.02em'
            }}
          >
            Ready to Go Live?
          </Typography>
          <Typography 
            variant="h6" 
            sx={{ 
              mb: 6, 
              opacity: 0.9,
              fontSize: { xs: '1.1rem', md: '1.3rem' },
              maxWidth: '550px',
              mx: 'auto',
              lineHeight: 1.6,
              color: '#cbd5e1'
            }}
          >
            Join thousands of creators already streaming on StreamHub
          </Typography>
          
          {!isAuthenticated ? (
            <Box>
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate('/register')}
                sx={{
                  mr: 3,
                  mb: { xs: 3, sm: 0 },
                  background: 'linear-gradient(45deg, #6366f1 0%, #8b5cf6 100%)',
                  color: 'white',
                  fontWeight: 700,
                  fontSize: '1.1rem',
                  px: 6,
                  py: 2,
                  borderRadius: 3,
                  boxShadow: '0 8px 32px rgba(99, 102, 241, 0.3), 0 4px 16px rgba(139, 92, 246, 0.2)',
                  textTransform: 'none',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #5855f6 0%, #7c3aed 100%)',
                    transform: 'translateY(-3px)',
                    boxShadow: '0 12px 48px rgba(99, 102, 241, 0.4), 0 6px 24px rgba(139, 92, 246, 0.3)'
                  },
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
              >
                Start Creating
              </Button>
              <Button
                variant="outlined"
                size="large"
                onClick={() => navigate('/login')}
                sx={{
                  borderColor: 'rgba(255,255,255,0.3)',
                  color: '#e2e8f0',
                  fontWeight: 600,
                  fontSize: '1.1rem',
                  px: 6,
                  py: 2,
                  borderRadius: 3,
                  borderWidth: 2,
                  textTransform: 'none',
                  '&:hover': {
                    borderColor: 'rgba(255,255,255,0.5)',
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    color: 'white',
                    transform: 'translateY(-3px)',
                    borderWidth: 2
                  },
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
              >
                Sign In
              </Button>
            </Box>
          ) : (
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/dashboard')}
              sx={{
                background: 'linear-gradient(45deg, #6366f1 0%, #8b5cf6 100%)',
                color: 'white',
                fontWeight: 700,
                fontSize: '1.1rem',
                px: 6,
                py: 2,
                borderRadius: 3,
                boxShadow: '0 8px 32px rgba(99, 102, 241, 0.3), 0 4px 16px rgba(139, 92, 246, 0.2)',
                textTransform: 'none',
                '&:hover': {
                  background: 'linear-gradient(45deg, #5855f6 0%, #7c3aed 100%)',
                  transform: 'translateY(-3px)',
                  boxShadow: '0 12px 48px rgba(99, 102, 241, 0.4), 0 6px 24px rgba(139, 92, 246, 0.3)'
                },
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
            >
              Back to Dashboard
            </Button>
          )}
        </Container>
      </Box>
    </Box>
  );
};

export default Home;
