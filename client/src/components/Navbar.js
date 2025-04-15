import React from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
} from '@mui/material';
import HowToVoteIcon from '@mui/icons-material/HowToVote';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleClose();
    navigate('/login');
  };

  return (
    <AppBar position="static" color="default" elevation={1}>
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          <HowToVoteIcon sx={{ mr: 2, color: 'primary.main' }} />
          <Typography
            variant="h6"
            component={RouterLink}
            to="/"
            sx={{
              flexGrow: 1,
              textDecoration: 'none',
              color: 'text.primary',
              fontWeight: 600,
            }}
          >
            Blockchain Voting
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            {isAuthenticated ? (
              <>
                <Button
                  component={RouterLink}
                  to="/"
                  color="inherit"
                  sx={{ '&:hover': { color: 'primary.main' } }}
                >
                  Home
                </Button>
                <Button
                  component={RouterLink}
                  to="/vote"
                  color="inherit"
                  sx={{ '&:hover': { color: 'primary.main' } }}
                >
                  Vote
                </Button>
                <Button
                  component={RouterLink}
                  to="/results"
                  color="inherit"
                  sx={{ '&:hover': { color: 'primary.main' } }}
                >
                  Results
                </Button>
                <IconButton
                  onClick={handleMenu}
                  sx={{ ml: 2 }}
                >
                  <Avatar sx={{ bgcolor: 'primary.main' }}>
                    {user?.name?.charAt(0) || 'U'}
                  </Avatar>
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                >
                  <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </Menu>
              </>
            ) : (
              <>
                <Button
                  component={RouterLink}
                  to="/login"
                  color="inherit"
                  sx={{ '&:hover': { color: 'primary.main' } }}
                >
                  Login
                </Button>
                <Button
                  component={RouterLink}
                  to="/register"
                  variant="contained"
                  color="primary"
                >
                  Register
                </Button>
              </>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar; 