import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import {
  Box, AppBar, Toolbar, IconButton, Typography,
  Drawer, List, ListItem, ListItemIcon, ListItemText,
  Avatar, Menu, MenuItem, CssBaseline, Divider,
  Badge, Collapse, Paper, Fade, Grow, useMediaQuery,
  Button, ButtonGroup, Breadcrumbs, Link, Skeleton
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Notifications as NotificationsIcon,
  Logout as LogoutIcon,
  AccountCircle as AccountCircleIcon,
  Settings as SettingsIcon,
  ExpandMore as ExpandMoreIcon,
  ChevronRight as ChevronRightIcon,
  Close as CloseIcon,
  People as PeopleIcon,
  Apartment as ApartmentIcon,
  Layers as LayersIcon,
  Receipt as ReceiptIcon,
  BarChart as BarChartIcon,
  Business as BusinessIcon,
  Home as HomeIcon,
  StarBorder as StarIcon,
  Payment as PaymentIcon,
  Assignment as AssignmentIcon,
  NavigateNext as NavigateNextIcon,
  VpnKey as VpnKeyIcon
} from '@mui/icons-material';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import { styled, useTheme, alpha } from '@mui/material/styles';
import { useAuth } from '../utils/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import ThemeSwitcher from '../components/ThemeSwitcher';
import HomeWorkIcon from '@mui/icons-material/HomeWork';

// Constants
const DRAWER_WIDTH = 280;
const COLLAPSED_DRAWER_WIDTH = 72;
const APP_BAR_HEIGHT = 64;
const SECONDARY_BAR_HEIGHT = 48;
const drawerWidth = 280;
const collapsedDrawerWidth = 80;

// Optimized styled components
const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    right: -4,
    top: 10,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: '0 5px',
    fontWeight: 700,
    fontSize: '0.7rem',
    backgroundColor: theme.palette.error.main,
    color: theme.palette.error.contrastText,
  },
}));

const SidebarListItem = styled(ListItem, {
  shouldForwardProp: (prop) => prop !== 'active',
})(({ theme, active }) => ({
  borderRadius: theme.shape.borderRadius,
  margin: theme.spacing(0.5, 1),
  paddingLeft: theme.spacing(2.5),
  backgroundColor: active ? alpha(theme.palette.primary.main, 0.1) : 'transparent',
   color: active ? theme.palette.primary.main : theme.palette.text.primary,
  fontWeight: active ? 600 : 400,
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.15),
    color: theme.palette.primary.dark,
  },
  transition: theme.transitions.create(['background-color', 'color', 'transform'], {
    duration: theme.transitions.duration.shorter,
    easing: theme.transitions.easing.easeInOut,
  }),
  '&:active': {
    transform: 'scale(0.98)',
  },
  justifyContent: 'flex-start',
}));

const SidebarSubListItem = styled(ListItem, {
  shouldForwardProp: (prop) => prop !== 'active',
})(({ theme, active }) => ({
  borderRadius: theme.shape.borderRadius,
  margin: theme.spacing(0.2, 1),
  paddingLeft: theme.spacing(5),
  backgroundColor: active ? alpha(theme.palette.secondary.main, 0.1) : 'transparent',
  color: active ? theme.palette.secondary.dark : theme.palette.text.secondary,
  fontWeight: active ? 600 : 400,
  '&:hover': {
    backgroundColor: alpha(theme.palette.secondary.main, 0.15),
    color: theme.palette.secondary.dark,
  },
  transition: theme.transitions.create(['background-color', 'color', 'transform'], {
    duration: theme.transitions.duration.shorter,
    easing: theme.transitions.easing.easeInOut,
  }),
  '&:active': {
    transform: 'scale(0.98)',
  },
}));

const DashboardLayout = ({ onModeChange, onColorChange, currentMode }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const mainContentRef = useRef(null);

  // State management
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationsAnchorEl, setNotificationsAnchorEl] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const [openSubmenus, setOpenSubmenus] = useState({});
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Memoized menu items
  const menuItems = useMemo(() => [
    {
      section: 'DASHBOARD',
      items: [
        {
          name: 'Dashboard',
          icon: <DashboardIcon />,
          path: '/dashboard',
        }
      ],
    },
    {
      section: 'MASTER MENU',
      items: [
        {
          name: 'Masters',
          icon: <SettingsIcon />,
          key: 'masters',
          submenu: [
            {
              name: 'Room Management',
              icon: <ApartmentIcon />,
              key: 'roommanagement',
              submenu: [
                { name: 'Block Master', path: '/dashboard/block-master', icon: <BusinessIcon /> },
                { name: 'Floor Master', path: '/dashboard/floor-master', icon: <LayersIcon /> },
                { name: 'Room Type Master', path: '/dashboard/room-type-master', icon: <HomeIcon /> },
                { name: 'Room Master', path: '/dashboard/room-master', icon: <HomeIcon /> },
                { name: 'Guest Master', path: '/dashboard/guest-master', icon: <HomeIcon /> },
                { name: 'Block Room', path: '/dashboard/block-room', icon: <VpnKeyIcon /> },
                { name: 'Un Block Room', path: '/dashboard/unblock-room', icon: <VpnKeyIcon /> },
              ],
            },
          ],
        },
      ],
    },
    {
      section: 'REPORT MENU',
      items: [
        {
          name: 'Reports',
          icon: <SettingsIcon />,
          key: 'reports',
          submenu: [
            {
              name: 'Non Revenue Reports',
              icon: <ApartmentIcon />,
              key: 'nonrevenuereports',
              submenu: [
                { name: 'Checkin/Out -Report', path: '/dashboard/checkinoout-report', icon: <BusinessIcon /> },
                { name: 'Police Report', path: '/dashboard/police-report', icon: <BusinessIcon /> },
                { name: 'Room Status Report', path: '/dashboard/rooms-report', icon: <BusinessIcon /> },
                { name: 'Occupancy Report', path: '/dashboard/occupancy-report', icon: <BusinessIcon /> },
                { name: 'HouseKeeping Status', path: '/dashboard/housekeeping-report', icon: <BusinessIcon /> },
                { name: 'Maintenance Track', path: '/dashboard/maintenance-report', icon: <BusinessIcon /> },
                { name: 'Room Blocking Report', path: '/dashboard/roomblock-report', icon: <BusinessIcon /> },
                { name: 'Guest Arrival/Departure Forecast', path: '/dashboard/guest-forecast-report', icon: <BusinessIcon /> },
              ],
            },
            {
              name: 'Revenue Reports',
              icon: <PeopleIcon />,
              key: 'revenuereports',
              submenu: [
                // { name: 'Talent Profiles', path: '/dashboard/talent-profiles', icon: <AccountCircleIcon /> },
              ],
            },
          ],
        },
      ],
    },
    {
      section: 'SYSTEM',
      items: [
        {
          name: 'Settings',
          icon: <SettingsIcon />,
          path: '/dashboard/settings',
        },
        {
          name: 'Logout',
          icon: <LogoutIcon />,
          action: () => handleLogout(),
        },
      ],
    },
  ], []);

  // Memoized notifications
  const notifications = useMemo(() => [
    { id: 1, text: 'New property added to your portfolio', time: '5 mins ago', icon: <ApartmentIcon color="primary" /> },
    { id: 2, text: 'Maintenance request completed', time: '2 hours ago', icon: <AssignmentIcon color="success" /> },
    { id: 3, text: 'Payment received from tenant', time: '1 day ago', icon: <PaymentIcon color="info" /> },
  ], []);

  // Scroll handler with debounce
  useEffect(() => {
    const handleScroll = () => {
      if (mainContentRef.current) {
        setIsScrolled(mainContentRef.current.scrollTop > 5);
      }
    };

    const contentElement = mainContentRef.current;
    if (contentElement) {
      contentElement.addEventListener('scroll', handleScroll, { passive: true });
      return () => contentElement.removeEventListener('scroll', handleScroll);
    }
  }, []);

  // Auto-close sidebar on mobile when navigating
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  }, [location.pathname, isMobile]);

  // Optimized handlers
  const toggleSidebar = useCallback(() => {
    setSidebarOpen(prev => !prev);
  }, []);

  const handleProfileMenuOpen = useCallback((event) => {
    setAnchorEl(event.currentTarget);
  }, []);

  const handleNotificationsMenuOpen = useCallback((event) => {
    setNotificationsAnchorEl(event.currentTarget);
  }, []);

  const handleMenuClose = useCallback(() => {
    setAnchorEl(null);
    setNotificationsAnchorEl(null);
  }, []);

  const handleLogout = useCallback(() => {
    setIsLoading(true);
    setTimeout(() => {
      logout();
      navigate('/login');
      handleMenuClose();
      setIsLoading(false);
    }, 300);
  }, [logout, navigate, handleMenuClose]);

  const toggleSubmenu = useCallback((menuKey) => {
    setOpenSubmenus(prev => ({
      ...prev,
      [menuKey]: !prev[menuKey]
    }));
  }, []);

  // Check if path is active
  const isActive = useCallback((path) => {
    return location.pathname === path;
  }, [location.pathname]);

  // Get current route name for breadcrumbs
  const getCurrentRouteName = useCallback(() => {
    const route = menuItems
      .flatMap(section => section.items)
      .flatMap(item => item.submenu ? item.submenu.flatMap(sub => sub.submenu ? sub.submenu : sub) : item)
      .find(item => item.path === location.pathname);
    
    return route ? route.name : location.pathname.split('/').pop().replace(/-/g, ' ');
  }, [location.pathname, menuItems]);

  // Render menu items
  const renderMenuItems = useCallback(() => (
    menuItems.map((section, sectionIndex) => (
      <React.Fragment key={sectionIndex}>
        {sidebarOpen && (
          <ListItem sx={{ py: 1.5 }}>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{
                fontWeight: '600',
                letterSpacing: 1.2,
                pl: 2,
                opacity: sidebarOpen ? 1 : 0,
                transition: theme.transitions.create('opacity', {
                  duration: theme.transitions.duration.standard,
                }),
              }}
            >
              {section.section}
            </Typography>
          </ListItem>
        )}
        {section.items.map((item, itemIndex) => (
          <React.Fragment key={itemIndex}>
            {item.submenu ? (
              <>
                <SidebarListItem
                  button
                  onClick={() => toggleSubmenu(item.key)}
                  active={openSubmenus[item.key]}
                  sx={{ px: 2.5 }}
                >
                  <ListItemIcon sx={{
                    minWidth: 36,
                    color: openSubmenus[item.key] ? theme.palette.primary.main : 'inherit',
                  }}>
                    {item.icon}
                  </ListItemIcon>
                  {sidebarOpen && (
                    <>
                      <ListItemText
                        primary={item.name}
                        primaryTypographyProps={{
                          fontWeight: openSubmenus[item.key] ? 600 : 400,
                        }}
                      />
                      {openSubmenus[item.key] ? <ExpandMoreIcon /> : <ChevronRightIcon />}
                    </>
                  )}
                </SidebarListItem>
                <Collapse in={openSubmenus[item.key] && sidebarOpen} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {item.submenu.map((subItem, subIndex) => (
                      <React.Fragment key={subIndex}>
                        {subItem.submenu ? (
                          <>
                            <SidebarSubListItem
                              button
                              onClick={() => toggleSubmenu(subItem.key)}
                              active={openSubmenus[subItem.key]}
                            >
                              <ListItemIcon sx={{ minWidth: 36 }}>
                                {subItem.icon}
                              </ListItemIcon>
                              <ListItemText
                                primary={subItem.name}
                                primaryTypographyProps={{
                                  fontWeight: openSubmenus[subItem.key] ? 600 : 400,
                                }}
                              />
                              {openSubmenus[subItem.key] ? <ExpandMoreIcon /> : <ChevronRightIcon />}
                            </SidebarSubListItem>
                            <Collapse in={openSubmenus[subItem.key] && sidebarOpen} timeout="auto" unmountOnExit>
                              <List component="div" disablePadding>
                                {subItem.submenu.map((subSubItem, subSubIndex) => (
                                  <SidebarSubListItem
                                    key={subSubIndex}
                                    button
                                    active={isActive(subSubItem.path)}
                                    onClick={() => navigate(subSubItem.path)}
                                    sx={{ pl: 6 }}
                                  >
                                    <ListItemIcon sx={{ minWidth: 36 }}>
                                      {subSubItem.icon}
                                    </ListItemIcon>
                                    <ListItemText
                                      primary={subSubItem.name}
                                      primaryTypographyProps={{
                                        fontWeight: isActive(subSubItem.path) ? 600 : 400,
                                      }}
                                    />
                                  </SidebarSubListItem>
                                ))}
                              </List>
                            </Collapse>
                          </>
                        ) : (
                          <SidebarSubListItem
                            button
                            active={isActive(subItem.path)}
                            onClick={() => navigate(subItem.path)}
                          >
                            <ListItemIcon sx={{ minWidth: 36 }}>
                              {subItem.icon}
                            </ListItemIcon>
                            <ListItemText
                              primary={subItem.name}
                              primaryTypographyProps={{
                                fontWeight: isActive(subItem.path) ? 600 : 400,
                              }}
                            />
                          </SidebarSubListItem>
                        )}
                      </React.Fragment>
                    ))}
                  </List>
                </Collapse>
              </>
            ) : (
              <SidebarListItem
                button
                active={item.path ? isActive(item.path) : false}
                onClick={() => {
                  if (item.action) {
                    item.action();
                  } else if (item.path) {
                    navigate(item.path);
                  }
                }}
                sx={{ px: 2.5 }}
              >
                <ListItemIcon sx={{ minWidth: 36 }}>
                  {item.icon}
                </ListItemIcon>
                {sidebarOpen && (
                  <ListItemText
                    primary={item.name}
                  />
                )}
              </SidebarListItem>
            )}
          </React.Fragment>
        ))}
      </React.Fragment>
    ))
  ), [menuItems, sidebarOpen, openSubmenus, isActive, navigate, theme, toggleSubmenu]);

  // Static footer component
  const StaticFooter = useMemo(() => styled('footer')(({ theme }) => ({
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    padding: theme.spacing(1.5),
    backgroundColor: theme.palette.background.paper,
    borderTop: `1px solid ${theme.palette.divider}`,
    textAlign: 'center',
    color: theme.palette.text.secondary,
    fontSize: '0.75rem',
    zIndex: theme.zIndex.drawer - 1,
    marginLeft: sidebarOpen ? `${DRAWER_WIDTH}px` : `${COLLAPSED_DRAWER_WIDTH}px`,
    transition: theme.transitions.create(['margin-left'], {
      duration: theme.transitions.duration.standard,
      easing: theme.transitions.easing.easeInOut,
    }),
  })), [sidebarOpen]);

  return (
    <Box sx={{
      display: 'flex',
      minHeight: '100vh',
      bgcolor: theme.palette.grey[50],
      overflow: 'hidden',
    }}>
      <CssBaseline />

      {/* Main AppBar */}
      <AppBar
        position="fixed"
        elevation={isScrolled ? 4 : 0}
        sx={{
          zIndex: theme.zIndex.drawer + 1,
          height: APP_BAR_HEIGHT,
          bgcolor: isScrolled 
            ? alpha(theme.palette.primary.main, 0.96) 
            : theme.palette.primary.main,
          color: theme.palette.primary.contrastText,
          backdropFilter: isScrolled ? 'blur(8px)' : 'none',
          transition: theme.transitions.create(
            ['background-color', 'box-shadow', 'backdrop-filter'], 
            {
              duration: theme.transitions.duration.standard,
              easing: theme.transitions.easing.easeInOut,
            }
          ),
          borderBottom: isScrolled 
            ? `1px solid ${alpha(theme.palette.primary.light, 0.2)}` 
            : 'none',
        }}
      >
        <Toolbar sx={{ 
          minHeight: APP_BAR_HEIGHT,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          px: { xs: 1, sm: 2 },
        }}>
          <Box sx={{ 
            display: 'flex',
            alignItems: 'center',
            flexGrow: 1,
          }}>
            <IconButton
              color="inherit"
              edge="start"
              onClick={toggleSidebar}
              sx={{
                mr: 2,
                transform: sidebarOpen ? 'rotate(0deg)' : 'rotate(90deg)',
                transition: theme.transitions.create('transform', {
                  duration: theme.transitions.duration.standard,
                }),
                '&:hover': {
                  backgroundColor: alpha(theme.palette.primary.contrastText, 0.1),
                },
              }}
              aria-label="toggle sidebar"
            >
              <MenuIcon />
            </IconButton>
            
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{
                fontWeight: 700,
                letterSpacing: 1.1,
                fontSize: { xs: '1rem', sm: '1.25rem' },
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                maxWidth: { xs: '160px', sm: 'none' },
              }}
            >
              <motion.span
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                {`${user?.property_name || 'Property'} - ${user?.city || 'Location'}`}
              </motion.span>
            </Typography>
          </Box>

          <Box sx={{ 
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          }}>
            <ThemeSwitcher 
              mode={currentMode} 
              onModeChange={onModeChange}
              onColorChange={onColorChange}
              compact={isMobile}
            />
            
            <IconButton
              color="inherit"
              onClick={handleNotificationsMenuOpen}
              aria-label="show notifications"
              sx={{
                '&:hover': {
                  bgcolor: alpha(theme.palette.primary.contrastText, 0.1),
                },
              }}
            >
              <StyledBadge 
                badgeContent={notifications.length} 
                color="error"
                overlap="circular"
              >
                <NotificationsIcon />
              </StyledBadge>
            </IconButton>
            
            <IconButton
              edge="end"
              onClick={handleProfileMenuOpen}
              color="inherit"
              aria-label="account of current user"
              sx={{
                '&:hover': {
                  bgcolor: alpha(theme.palette.primary.contrastText, 0.1),
                },
              }}
            >
              {isLoading ? (
                <Skeleton variant="circular" width={36} height={36} />
              ) : (
                <Avatar
                  sx={{
                    bgcolor: alpha(theme.palette.primary.contrastText, 0.2),
                    color: theme.palette.primary.contrastText,
                    width: 36,
                    height: 36,
                    fontWeight: 'bold',
                    transition: theme.transitions.create(
                      ['background-color', 'transform'], 
                      {
                        duration: theme.transitions.duration.shorter,
                      }
                    ),
                    '&:hover': {
                      transform: 'scale(1.05)',
                    },
                  }}
                >
                  {user?.user_name?.charAt(0).toUpperCase() || 'U'}
                </Avatar>
              )}
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Secondary Navigation Bar */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          top: APP_BAR_HEIGHT,
          zIndex: theme.zIndex.drawer,
          height: SECONDARY_BAR_HEIGHT,
          bgcolor: theme.palette.background.paper,
          color: theme.palette.text.primary,
          borderBottom: `1px solid ${theme.palette.divider}`,
          transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.easeInOut,
            duration: theme.transitions.duration.standard,
          }),
          marginLeft: sidebarOpen ? `${DRAWER_WIDTH}px` : `${COLLAPSED_DRAWER_WIDTH}px`,
          width: sidebarOpen ? `calc(100% - 280px)` : `calc(100% - 0px)`,
        }}
      >
        <Toolbar variant="dense" sx={{ minHeight: SECONDARY_BAR_HEIGHT, px: { xs: 1, sm: 2 } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', overflow: 'hidden' }}>
            <Breadcrumbs
              separator={<NavigateNextIcon fontSize="small" />}
              aria-label="breadcrumb"
              sx={{ mr: 2, overflow: 'hidden', whiteSpace: 'nowrap' }}
            >
              <Link
                underline="hover"
                color="inherit"
                href="#"
                onClick={() => navigate('/dashboard')}
                sx={{ display: 'flex', alignItems: 'center' }}
              >
                <DashboardIcon sx={{ mr: 0.5, fontSize: 'inherit' }} />
                <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>Dashboard</Box>
              </Link>
              {location.pathname !== '/dashboard' && (
                <Typography 
                  color="text.primary" 
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                >
                  {getCurrentRouteName()}
                </Typography>
              )}
            </Breadcrumbs>

            <Box sx={{ flexGrow: 1 }} />
            <ButtonGroup 
              variant="contained" 
              size="small" 
              sx={{ 
                ml: 'auto',
                display: { xs: 'none', sm: 'flex' } 
              }}
            >
              <Button
                startIcon={<ReceiptIcon />}
                onClick={() => navigate('/dashboard/check-in-room')}
                sx={{
                  textTransform: 'none',
                  bgcolor: isActive('/dashboard/check-in-room') ?
                    alpha(theme.palette.primary.main, 0.9) :
                    alpha(theme.palette.primary.main, 0.7),
                  '&:hover': {
                    bgcolor: alpha(theme.palette.primary.main, 0.9),
                  },
                }}
              >
                Check-In
              </Button>
              <Button
                startIcon={<HomeIcon />}
                onClick={() => navigate('/dashboard/checkin-list')}
                sx={{
                  textTransform: 'none',
                  bgcolor: isActive('/dashboard/checkin-list') ?
                    alpha(theme.palette.success.main, 0.9) :
                    alpha(theme.palette.success.main, 0.7),
                  '&:hover': {
                    bgcolor: alpha(theme.palette.success.main, 0.9),
                  },
                }}
              >
                Checkin-list
              </Button>
              <Button
                startIcon={<BarChartIcon />}
                onClick={() => console.log('Generate Report')}
                sx={{
                  textTransform: 'none',
                  bgcolor: isActive('/dashboard/floor-master') ?
                    alpha(theme.palette.warning.main, 0.9) :
                    alpha(theme.palette.warning.main, 0.7),
                  '&:hover': {
                    bgcolor: alpha(theme.palette.warning.main, 0.9),
                  },
                }}
              >
                Report
              </Button>
            </ButtonGroup>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Sidebar Drawer */}
      <Drawer
        variant={isMobile ? "temporary" : "persistent"}
        open={sidebarOpen}
        onClose={toggleSidebar}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          width: sidebarOpen ? DRAWER_WIDTH : COLLAPSED_DRAWER_WIDTH,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: sidebarOpen ? DRAWER_WIDTH : COLLAPSED_DRAWER_WIDTH,
            boxSizing: 'border-box',
            borderRight: 'none',
            boxShadow: theme.shadows[3],
            transition: theme.transitions.create(['width', 'transform'], {
              easing: theme.transitions.easing.easeInOut,
              duration: theme.transitions.duration.standard,
            }),
            overflowX: 'hidden',
            scrollbarWidth: 'thin',
          },
        }}
      >
        <Toolbar sx={{
          px: 2,
          bgcolor: theme.palette.primary.main,
          color: theme.palette.primary.contrastText,
          fontWeight: 700,
          minHeight: APP_BAR_HEIGHT,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          {sidebarOpen ? (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              PropertyPro
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              <BusinessIcon />
            </motion.div>
          )}
          {isMobile && (
            <IconButton onClick={toggleSidebar} sx={{ color: 'inherit' }}>
              <CloseIcon />
            </IconButton>
          )}
        </Toolbar>
        <Divider />
        <List sx={{
          mt: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
          height: `calc(100vh - ${APP_BAR_HEIGHT + SECONDARY_BAR_HEIGHT}px)`,
          '&::-webkit-scrollbar': {
            width: '6px',
          },
          '&::-webkit-scrollbar-track': {
            background: alpha(theme.palette.primary.main, 0.1),
          },
          '&::-webkit-scrollbar-thumb': {
            background: alpha(theme.palette.primary.main, 0.4),
            borderRadius: '3px',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            background: alpha(theme.palette.primary.main, 0.6),
          },
        }}>
          {renderMenuItems()}
        </List>
      </Drawer>

      {/* Main content area */}
      <Box
        component="main"
        ref={mainContentRef}
        sx={{
          flexGrow: 1,
          p: 3,
          pb: 10,
          transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.easeInOut,
            duration: theme.transitions.duration.standard,
          }),
          minHeight: '100vh',
          overflowY: 'auto',
          overflowX: 'hidden',
          marginLeft: {
            xs: 0,
            md: sidebarOpen ? `0px` : `-80px`
          },
          width: {
            xs: '100%',
            md: sidebarOpen ? `calc(100% - ${drawerWidth}px)` : `calc(100% - ${collapsedDrawerWidth}px)`
          },
          marginTop: 13, // Account for both AppBars
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
        <StaticFooter sidebarOpen={sidebarOpen}>
          © {new Date().getFullYear()} Goio Tech. All rights reserved.
        </StaticFooter>
      </Box>

      {/* Profile Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        keepMounted
        TransitionComponent={Fade}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          elevation: 4,
          sx: {
            mt: 1.5,
            minWidth: 200,
            borderRadius: 2,
            overflow: 'hidden',
            boxShadow: theme.shadows[10],
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
          },
        }}
      >
        <MenuItem
          onClick={() => {
            navigate('/dashboard/profile');
            handleMenuClose();
          }}
          sx={{
            '&:hover': {
              bgcolor: alpha(theme.palette.primary.main, 0.1),
            },
          }}
        >
          <ListItemIcon>
            <AccountCircleIcon fontSize="small" color="primary" />
          </ListItemIcon>
          <ListItemText primary="Profile" primaryTypographyProps={{ variant: 'body2' }} />
        </MenuItem>
        <MenuItem
          onClick={() => {
            navigate('/dashboard/property', { state: { propid: user?.propid } });
            handleMenuClose();
          }}
          sx={{
            '&:hover': {
              bgcolor: alpha(theme.palette.primary.main, 0.1),
            },
          }}
        >
          <ListItemIcon>
            <HomeWorkIcon fontSize="small" color="primary" />
          </ListItemIcon>
          <ListItemText primary="Property" primaryTypographyProps={{ variant: 'body2' }} />
        </MenuItem>
        <MenuItem
          onClick={() => {
            navigate('/dashboard/settings');
            handleMenuClose();
          }}
          sx={{
            '&:hover': {
              bgcolor: alpha(theme.palette.primary.main, 0.1),
            },
          }}
        >
          <ListItemIcon>
            <SettingsIcon fontSize="small" color="primary" />
          </ListItemIcon>
          <ListItemText primary="Settings" primaryTypographyProps={{ variant: 'body2' }} />
        </MenuItem>
        <Divider />
        <MenuItem
          onClick={handleLogout}
          sx={{
            '&:hover': {
              bgcolor: alpha(theme.palette.error.main, 0.1),
            },
          }}
        >
          <ListItemIcon>
            <LogoutIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText primary="Logout" primaryTypographyProps={{ variant: 'body2' }} />
        </MenuItem>
      </Menu>

      {/* Notifications Menu */}
      <Menu
        anchorEl={notificationsAnchorEl}
        open={Boolean(notificationsAnchorEl)}
        onClose={handleMenuClose}
        keepMounted
        TransitionComponent={Grow}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          elevation: 4,
          sx: {
            mt: 1.5,
            width: 320,
            maxWidth: '100%',
            borderRadius: 2,
            overflow: 'hidden',
            boxShadow: theme.shadows[10],
          },
        }}
      >
        <Paper sx={{ p: 2, bgcolor: 'background.paper' }}>
          <Box sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 1,
          }}>
            <Typography variant="subtitle1" fontWeight="bold" color="primary">
              Notifications
            </Typography>
            <StyledBadge badgeContent={notifications.length} color="error">
              <Typography variant="caption" color="text.secondary">
                {notifications.length} new
              </Typography>
            </StyledBadge>
          </Box>
          {notifications.length === 0 ? (
            <MenuItem
              disabled
              sx={{
                justifyContent: 'center',
                color: 'text.secondary',
                minHeight: 100,
              }}
            >
              <Typography variant="body2">No notifications</Typography>
            </MenuItem>
          ) : (
            <Box sx={{ maxHeight: 400, overflowY: 'auto' }}>
              {notifications.map((notification) => (
                <MenuItem
                  key={notification.id}
                  divider
                  sx={{
                    '&:hover': {
                      bgcolor: alpha(theme.palette.primary.main, 0.05),
                    },
                  }}
                >
                  <ListItemIcon>
                    {notification.icon}
                  </ListItemIcon>
                  <Box>
                    <Typography variant="body2">{notification.text}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {notification.time}
                    </Typography>
                  </Box>
                </MenuItem>
              ))}
            </Box>
          )}
        </Paper>
      </Menu>
    </Box>
  );
};

export default React.memo(DashboardLayout);