import React, { useState, useEffect } from 'react';
import {
  Button,
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
  Snackbar,
  Alert,
  IconButton,
  Fade,
} from '@mui/material';
import {
  GetApp as InstallIcon,
  Close as CloseIcon,
  Smartphone as PhoneIcon,
  DesktopWindows as DesktopIcon,
  TabletMac as TabletIcon,
} from '@mui/icons-material';
import useServiceWorker from '../../hooks/useServiceWorker';

interface InstallPromptProps {
  show?: boolean;
}

const InstallPrompt: React.FC<InstallPromptProps> = ({ show = true }) => {
  const {
    canInstall,
    promptInstall,
    isInstalled,
    isSupported,
  } = useServiceWorker();

  const [isVisible, setIsVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [installing, setInstalling] = useState(false);
  const [installStatus, setInstallStatus] = useState<'success' | 'error' | null>(null);

  useEffect(() => {
    // Show prompt after user has been on the site for a while
    if (!show || !canInstall || isInstalled || dismissed) {
      setIsVisible(false);
      return;
    }

    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 10000); // Show after 10 seconds

    // Check if user has previously dismissed
    const previouslyDismissed = localStorage.getItem('pwa-install-dismissed');
    if (previouslyDismissed) {
      const dismissedTime = parseInt(previouslyDismissed);
      const daysSinceDismissed = (Date.now() - dismissedTime) / (1000 * 60 * 60 * 24);

      // Show again after 30 days
      if (daysSinceDismissed < 30) {
        setIsVisible(false);
      }
    }

    return () => clearTimeout(timer);
  }, [canInstall, isInstalled, dismissed, show]);

  const handleInstall = async () => {
    setInstalling(true);
    setInstallStatus(null);

    try {
      const accepted = await promptInstall();

      if (accepted) {
        setInstallStatus('success');
        setIsVisible(false);
        // Track installation event
        if (typeof gtag !== 'undefined') {
          gtag('event', 'pwa_install', {
            event_category: 'PWA',
            event_label: 'install_accepted',
          });
        }
      } else {
        setInstallStatus('error');
      }
    } catch (error) {
      console.error('Installation failed:', error);
      setInstallStatus('error');
      // Track installation error
      if (typeof gtag !== 'undefined') {
        gtag('event', 'pwa_install_error', {
          event_category: 'PWA',
          event_label: 'install_failed',
        });
      }
    } finally {
      setInstalling(false);
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    setDismissed(true);
    localStorage.setItem('pwa-install-dismissed', Date.now().toString());

    // Track dismissal event
    if (typeof gtag !== 'undefined') {
      gtag('event', 'pwa_install_dismiss', {
        event_category: 'PWA',
        event_label: 'install_dismissed',
      });
    }
  };

  const handleCloseSnackbar = () => {
    setInstallStatus(null);
  };

  const getDeviceIcon = () => {
    const userAgent = navigator.userAgent.toLowerCase();

    if (/mobile|android|iphone|ipad|ipod/.test(userAgent)) {
      if (/tablet|ipad/.test(userAgent)) {
        return <TabletIcon />;
      }
      return <PhoneIcon />;
    }

    return <DesktopIcon />;
  };

  const getInstallMessage = () => {
    const userAgent = navigator.userAgent.toLowerCase();

    if (/android/.test(userAgent)) {
      return 'Install our app for easy access to Serbian data visualization on your Android device.';
    }

    if (/iphone|ipad|ipod/.test(userAgent)) {
      return 'Add our app to your home screen for quick access to Serbian data visualization.';
    }

    return 'Install our app for the best Serbian data visualization experience with offline access.';
  };

  if (!isSupported || !isVisible || dismissed) {
    return null;
  }

  return (
    <>
      {/* Install Prompt Card */}
      <Box
        sx={{
          position: 'fixed',
          bottom: 20,
          left: 20,
          right: 20,
          zIndex: 1300,
          maxWidth: 400,
          margin: '0 auto',
        }}
      >
        <Fade in={isVisible} timeout={500}>
          <Card
            elevation={8}
            sx={{
              background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
              color: 'white',
              borderRadius: 2,
            }}
          >
            <CardContent sx={{ pb: 1 }}>
              <Box display="flex" alignItems="center" mb={1}>
                {getDeviceIcon()}
                <Typography variant="h6" sx={{ ml: 1, flexGrow: 1 }}>
                  Install Vizualni Admin
                </Typography>
                <IconButton
                  size="small"
                  onClick={handleDismiss}
                  sx={{ color: 'white' }}
                >
                  <CloseIcon />
                </IconButton>
              </Box>

              <Typography variant="body2" sx={{ mb: 2, opacity: 0.9 }}>
                {getInstallMessage()}
              </Typography>

              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1 }}>
                <Chip
                  label="Offline Access"
                  size="small"
                  variant="outlined"
                  sx={{
                    borderColor: 'rgba(255,255,255,0.5)',
                    color: 'white',
                    fontSize: '0.75rem',
                  }}
                />
                <Chip
                  label="Fast Loading"
                  size="small"
                  variant="outlined"
                  sx={{
                    borderColor: 'rgba(255,255,255,0.5)',
                    color: 'white',
                    fontSize: '0.75rem',
                  }}
                />
                <Chip
                  label="Native Experience"
                  size="small"
                  variant="outlined"
                  sx={{
                    borderColor: 'rgba(255,255,255,0.5)',
                    color: 'white',
                    fontSize: '0.75rem',
                  }}
                />
              </Box>
            </CardContent>

            <CardActions sx={{ px: 2, pb: 2 }}>
              <Button
                variant="contained"
                color="secondary"
                onClick={handleInstall}
                disabled={installing}
                startIcon={<InstallIcon />}
                sx={{
                  flexGrow: 1,
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 'bold',
                }}
              >
                {installing ? 'Installing...' : 'Install'}
              </Button>

              <Button
                variant="text"
                onClick={handleDismiss}
                sx={{
                  color: 'rgba(255,255,255,0.8)',
                  borderRadius: 2,
                }}
              >
                Later
              </Button>
            </CardActions>
          </Card>
        </Fade>
      </Box>

      {/* Success/Error Snackbar */}
      <Snackbar
        open={!!installStatus}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={installStatus === 'success' ? 'success' : 'error'}
          sx={{ width: '100%' }}
        >
          {installStatus === 'success'
            ? 'App installed successfully! You can now launch it from your home screen.'
            : 'Installation failed. You can try again later or continue using the browser version.'
          }
        </Alert>
      </Snackbar>
    </>
  );
};

export default InstallPrompt;