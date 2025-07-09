import React, { useState } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Box, 
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useMediaQuery,
  useTheme,
  Divider
} from '@mui/material';
import { 
  LiveTv as LiveTvIcon,
  AccountCircle as AccountIcon,
  Dashboard as DashboardIcon,
  Key as KeyIcon,
  Menu as MenuIcon,
  Home as HomeIcon,
  ExitToApp as LogoutIcon
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { isAuthenticated, user, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleMenuClose();
    navigate('/');
  };

  const toggleMobileDrawer = () => {
    setMobileDrawerOpen(!mobileDrawerOpen);
  };

  const isActive = (path) => location.pathname === path;

  const menuItems = [
    { label: 'Home', path: '/', icon: <HomeIcon />, public: true },
    { label: 'Live Streams', path: '/streams', icon: <LiveTvIcon />, public: true },
    { label: 'Dashboard', path: '/dashboard', icon: <DashboardIcon />, protected: true },
  ];

  if (user?.isStreamer) {
    menuItems.push({ label: 'Stream Key', path: '/stream-key', icon: <KeyIcon />, protected: true });
  }

  const handleNavigation = (path) => {
    navigate(path);
    setMobileDrawerOpen(false);
  };

  const MobileDrawer = () => (
    <Drawer
      anchor="left"
      open={mobileDrawerOpen}
      onClose={toggleMobileDrawer}
      sx={{
        '& .MuiDrawer-paper': {
          width: 280,
          backgroundColor: 'background.paper',
        },
      }}
    >
      <Box sx={{ p: 2 }}>
        <Typography 
          variant="h5" 
          sx={{ 
            fontWeight: 'bold',
            background: 'linear-gradient(45deg, #9c27b0, #e91e63)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            color: 'transparent',
            mb: 2
          }}
        >
          StreamHub
        </Typography>
      </Box>
      
      <Divider />
      
      <List>
        {menuItems.map((item) => {
          if (item.protected && !isAuthenticated) return null;
          if (!item.public && !item.protected) return null;
          
          return (
            <ListItem
              button
              key={item.path}
              onClick={() => handleNavigation(item.path)}
              selected={isActive(item.path)}
              sx={{
                '&.Mui-selected': {
                  backgroundColor: 'rgba(156, 39, 176, 0.1)',
                  borderRight: '3px solid #9c27b0',
                },
                '&:hover': {
                  backgroundColor: 'rgba(156, 39, 176, 0.05)',
                },
              }}
            >
              <ListItemIcon sx={{ color: isActive(item.path) ? '#9c27b0' : 'inherit' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.label} 
                sx={{ 
                  '& .MuiListItemText-primary': {
                    fontWeight: isActive(item.path) ? 600 : 400,
                    color: isActive(item.path) ? '#9c27b0' : 'inherit',
                  }
                }}
              />
            </ListItem>
          );
        })}
      </List>
      
      {isAuthenticated && (
        <>
          <Divider sx={{ mt: 'auto' }} />
          <Box sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Avatar sx={{ bgcolor: '#9c27b0', mr: 2, width: 40, height: 40 }}>
                {user?.username?.charAt(0).toUpperCase()}
              </Avatar>
              <Box>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                  {user?.username}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {user?.isStreamer ? 'Streamer' : 'Viewer'}
                </Typography>
              </Box>
            </Box>
            <Button
              fullWidth
              startIcon={<AccountIcon />}
              onClick={() => handleNavigation('/profile')}
              sx={{ mb: 1 }}
            >
              Profile
            </Button>
            <Button
              fullWidth
              startIcon={<LogoutIcon />}
              onClick={handleLogout}
              color="error"
              variant="outlined"
            >
              Logout
            </Button>
          </Box>
        </>
      )}
      
      {!isAuthenticated && (
        <>
          <Divider sx={{ mt: 'auto' }} />
          <Box sx={{ p: 2 }}>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => handleNavigation('/login')}
              sx={{ mb: 1 }}
            >
              Login
            </Button>
            <Button
              fullWidth
              variant="contained"
              onClick={() => handleNavigation('/register')}
              sx={{
                background: 'linear-gradient(45deg, #9c27b0, #e91e63)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #7b1fa2, #c2185b)',
                },
              }}
            >
              Sign Up
            </Button>
          </Box>
        </>
      )}
    </Drawer>
  );

  return (
    <>
      <AppBar position="static" elevation={0} sx={{ 
        bgcolor: 'rgba(10, 10, 10, 0.95)', 
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(156, 39, 176, 0.2)'
      }}>
        <Toolbar>
          {/* Mobile Menu Button */}
          {isMobile && (
            <IconButton
              edge="start"
              color="inherit"
              onClick={toggleMobileDrawer}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}
          
          {/* Logo */}
          <Typography 
            variant="h5" 
            component="div" 
            sx={{ 
              flexGrow: isMobile ? 1 : 0, 
              mr: isMobile ? 0 : 4, 
              fontWeight: 'bold',
              cursor: 'pointer',
              background: 'linear-gradient(45deg, #9c27b0, #e91e63)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent'
            }}
            onClick={() => navigate('/')}
          >
            StreamHub
          </Typography>
          
          {/* Desktop Navigation */}
          {!isMobile && isAuthenticated && (
            <Box sx={{ flexGrow: 1, display: 'flex', ml: 2 }}>
              {menuItems.filter(item => !item.public || item.protected).map((item) => (
                <Button
                  key={item.path}
                  color="inherit"
                  startIcon={item.icon}
                  onClick={() => navigate(item.path)}
                  sx={{
                    mr: 2,
                    borderBottom: isActive(item.path) ? '2px solid #9c27b0' : 'none',
                    borderRadius: 0,
                    color: isActive(item.path) ? '#9c27b0' : 'inherit',
                    fontWeight: isActive(item.path) ? 600 : 400,
                    '&:hover': {
                      backgroundColor: 'rgba(156, 39, 176, 0.1)'
                    }
                  }}
                >
                  {item.label}
                </Button>
              ))}
            </Box>
          )}
          
          {!isMobile && !isAuthenticated && <Box sx={{ flexGrow: 1 }} />}
          
          {/* Desktop Auth Section */}
          {!isMobile && (
            <>
              {isAuthenticated ? (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography variant="body2" sx={{ mr: 2, color: '#b0b0b0' }}>
                    Welcome, {user?.username}
                    {user?.isStreamer && (
                      <Box component="span" sx={{ 
                        ml: 1, 
                        px: 1, 
                        py: 0.5, 
                        bgcolor: '#9c27b0', 
                        borderRadius: 1, 
                        fontSize: '0.75rem',
                        fontWeight: 'bold'
                      }}>
                        STREAMER
                      </Box>
                    )}
                  </Typography>
                  <IconButton
                    size="large"
                    edge="end"
                    onClick={handleProfileMenuOpen}
                    color="inherit"
                  >
                    <Avatar sx={{ bgcolor: '#9c27b0', width: 32, height: 32 }}>
                      {user?.username?.charAt(0).toUpperCase()}
                    </Avatar>
                  </IconButton>
                  <Menu
                    anchorEl={anchorEl}
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'right',
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                    sx={{
                      '& .MuiPaper-root': {
                        backgroundColor: 'background.paper',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(156, 39, 176, 0.2)',
                      }
                    }}
                  >
                    <MenuItem onClick={() => { navigate('/profile'); handleMenuClose(); }}>
                      <AccountIcon sx={{ mr: 2 }} />
                      Profile
                    </MenuItem>
                    <MenuItem onClick={handleLogout}>
                      <LogoutIcon sx={{ mr: 2 }} />
                      Logout
                    </MenuItem>
                  </Menu>
                </Box>
              ) : (
                <Box>
                  <Button 
                    color="inherit" 
                    onClick={() => navigate('/login')}
                    sx={{ mr: 1 }}
                  >
                    Login
                  </Button>
                  <Button 
                    variant="contained" 
                    onClick={() => navigate('/register')}
                    sx={{ 
                      background: 'linear-gradient(45deg, #9c27b0, #e91e63)',
                      '&:hover': {
                        background: 'linear-gradient(45deg, #7b1fa2, #c2185b)',
                      }
                    }}
                  >
                    Sign Up
                  </Button>
                </Box>
              )}
            </>
          )}
        </Toolbar>
      </AppBar>
      
      {/* Mobile Drawer */}
      <MobileDrawer />
    </>
  );
};

export default Navbar;
