import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Paper,
  Box,
  Button,
  Alert,
  IconButton,
  Tooltip,
  CircularProgress
} from '@mui/material';
import {
  ContentCopy as CopyIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon
} from '@mui/icons-material';
import { streamService } from '../services/streamService';

const StreamKey = () => {
  const [streamKey, setStreamKey] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  useEffect(() => {
    fetchStreamKey();
  }, []);

  const fetchStreamKey = async () => {
    try {
      const key = await streamService.getStreamKey();
      setStreamKey(key);
    } catch (err) {
      setError('Failed to load stream key');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyKey = async () => {
    try {
      await navigator.clipboard.writeText(streamKey);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      setError('Failed to copy stream key');
    }
  };

  const toggleShowKey = () => {
    setShowKey(!showKey);
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, mb: 4, textAlign: 'center' }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading stream key...
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom>
        Stream Key
      </Typography>
      
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Your personal stream key for broadcasting. Keep this secure and never share it publicly.
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {copySuccess && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Stream key copied to clipboard!
        </Alert>
      )}

      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom>
          Your Stream Key
        </Typography>
        
        <Alert severity="warning" sx={{ mb: 3 }}>
          <strong>Important:</strong> Never share your stream key with anyone. 
          Anyone with access to this key can stream to your channel.
        </Alert>

        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 2,
            p: 2,
            bgcolor: 'background.default',
            borderRadius: 1,
            border: '1px solid',
            borderColor: 'divider'
          }}
        >
          <Typography 
            variant="body1" 
            sx={{ 
              flex: 1, 
              fontFamily: 'monospace',
              fontSize: '1.1rem',
              wordBreak: 'break-all'
            }}
          >
            {showKey ? streamKey : '●'.repeat(streamKey.length)}
          </Typography>
          
          <Tooltip title={showKey ? 'Hide key' : 'Show key'}>
            <IconButton onClick={toggleShowKey}>
              {showKey ? <VisibilityOffIcon /> : <VisibilityIcon />}
            </IconButton>
          </Tooltip>
          
          <Tooltip title="Copy to clipboard">
            <IconButton onClick={handleCopyKey} color="primary">
              <CopyIcon />
            </IconButton>
          </Tooltip>
        </Box>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            How to use your stream key:
          </Typography>
          <Typography variant="body2" component="div" sx={{ ml: 2 }}>
            <ol>
              <li>Open your streaming software (OBS, XSplit, etc.)</li>
              <li>Go to Settings → Stream</li>
              <li>Set Server to: <code>rtmp://localhost:1935/live</code></li>
              <li>Set Stream Key to the key above</li>
              <li>Start streaming!</li>
            </ol>
          </Typography>
        </Box>

        <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
          <Button 
            variant="contained" 
            onClick={handleCopyKey}
            startIcon={<CopyIcon />}
          >
            Copy Stream Key
          </Button>
          <Button 
            variant="outlined" 
            onClick={fetchStreamKey}
          >
            Refresh Key
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default StreamKey;
