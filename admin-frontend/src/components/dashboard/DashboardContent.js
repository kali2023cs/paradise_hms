import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import RoomStatusCard from '../dashboard/RoomStatusCard';
import {
  Container,
  Typography,
  Paper,
  Grid,
  Box,
  Divider,
  Tooltip,
  IconButton,
  Stack,
  useMediaQuery,
  useTheme,
  ToggleButton,
  ToggleButtonGroup,
  Modal,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Badge,
  Avatar
} from '@mui/material';
import {
  Bed as BedIcon,
  Person as PersonIcon,
  PersonAdd as PersonAddIcon,
  Info as InfoIcon,
  Layers as FloorIcon,
  Category as RoomTypeIcon,
  Close as CloseIcon,
  Info as CheckInIcon,
  Block as BlockIcon,
  CleaningServices as CleaningIcon
} from '@mui/icons-material';
import api from '../../utils/axios';
import LogoutIcon from '@mui/icons-material/Logout';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import BuildIcon from '@mui/icons-material/Build';
import DoneIcon from '@mui/icons-material/Done';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import UILoader from '../common/UILoader';

const DashboardContent = () => {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [groupBy, setGroupBy] = useState('floor');
  const [openModal, setOpenModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const [statusSummary, setStatusSummary] = useState([]);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const fetchRooms = useCallback(async () => {
    try {
      const response = await api.get('/getAllActiveRooms');
      if (response.data.success) {
        setRooms(response.data.data);

        // Calculate status summary
        const summary = {};
        response.data.data.forEach(room => {
          if (!summary[room.status_name]) {
            summary[room.status_name] = {
              count: 0,
              color: room.color_code
            };
          }
          summary[room.status_name].count++;
        });
        setStatusSummary(Object.entries(summary).map(([status, data]) => ({
          status,
          count: data.count,
          color: data.color
        })));
      } else {
        setError('Failed to fetch rooms');
      }
    } catch (err) {
      setError('Error fetching rooms');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  const groupedRooms = useMemo(() => {
    return rooms.reduce((acc, room) => {
      const groupKey = groupBy === 'floor'
        ? room.floor_name || 'Unknown Floor'
        : room.room_type_name || 'Unknown Type';
      if (!acc[groupKey]) acc[groupKey] = [];
      acc[groupKey].push(room);
      return acc;
    }, {});
  }, [rooms, groupBy]);

  const statusColors = useMemo(() => {
    const colors = {};
    rooms.forEach(room => {
      if (!colors[room.status_name]) {
        colors[room.status_name] = room.color_code;
      }
    });
    return colors;
  }, [rooms]);

  const getStatusCount = useCallback((groupRooms, status) => {
    return groupRooms.filter(room => room.status_name === status).length;
  }, []);

  const handleGroupByChange = useCallback((event, newGroupBy) => {
    if (newGroupBy !== null) {
      setGroupBy(newGroupBy);
    }
  }, []);

  const handleOpenModal = useCallback((room) => {
    setSelectedRoom(room);
    setOpenModal(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setOpenModal(false);
    setSelectedRoom(null);
  }, []);

  const handleRoomClick = useCallback((room, event) => {
    const isInfoIconClick = event.target.closest('button') !== null;
    if (isInfoIconClick) {
      handleOpenModal(room);
      return;
    }
    event.preventDefault();
    setSelectedRoom(room);
    setMenuPosition({
      top: event.clientY,
      left: event.clientX,
    });
    setAnchorEl(event.currentTarget);
  }, [handleOpenModal]);

  const handleMenuClose = useCallback(() => {
    setAnchorEl(null);
    setSelectedRoom(null);
  }, []);

  const handleRoomAction = useCallback((action) => {
    if (!selectedRoom) return;

    console.log(`Action: ${action} for room ${selectedRoom.room_no}`);
    handleMenuClose();

    switch (action) {
      case 'checkin':
        navigate('/dashboard/check-in-room', {
          state: {
            preSelectedRoom: {
              roomTypeId: selectedRoom.room_type_id,
              roomTypeName: selectedRoom.room_type_name,
              roomId: selectedRoom.id,
              roomNo: selectedRoom.room_no
            }
          }
        });
        break;
      case 'info':
        navigate('/dashboard/checkin-info', {
          state: {
            preSelectedRoom: {
              roomId: selectedRoom.id,
              checkinId: selectedRoom.checkin_id,
            }
          }
        });
        break;
      case 'checkout':
        navigate(`/dashboard/checkout-room/${selectedRoom.checkin_id}/${selectedRoom.id}`);
        break;
      case 'folio':
        console.log('Guest folio action');
        break;
      case 'block':
        navigate('/dashboard/block-room', {
          state: {
            preSelectedRoom: {
              roomId: selectedRoom.id,
            }
          }
        });
        break;
      case 'clean':
        navigate('/dashboard/clean-room', {
          state: {
            preSelectedRoom: {
              roomId: selectedRoom.id,
            }
          }
        });
        break;
      case 'finish_cleaning':
        navigate('/dashboard/clean-room', {
          state: {
            preSelectedRoom: {
              roomId: selectedRoom.id,
              status: 'Finish'
            }
          }
        });
        break;
      case 'unblock':
        navigate('/dashboard/unblock-room', {
          state: {
            preSelectedRoom: {
              roomId: selectedRoom.id,
            }
          }
        });
        break;
      case 'maintenance':
        navigate('/dashboard/maintenance-room', {
          state: {
            preSelectedRoom: {
              roomId: selectedRoom.id,
            }
          }
        });
        break;
      case 'maintenance_over':
        navigate('/dashboard/maintenance-room', {
          state: {
            preSelectedRoom: {
              roomId: selectedRoom.id,
              status: 'resolved'
            }
          }
        });
        break;
      default:
        break;
    }
  }, [navigate, selectedRoom, handleOpenModal, handleMenuClose]);

  if (loading) {
    return (
      <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh'
      }}>
        <UILoader />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography variant="h6" color="error" align="center" sx={{ mt: 10 }}>
        {error}
      </Typography>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
          Room Dashboard
        </Typography>
        <Stack direction="row" spacing={2} alignItems="center">
          <ToggleButtonGroup
            value={groupBy}
            exclusive
            onChange={handleGroupByChange}
            size="small"
            sx={{ height: '36px' }}
          >
            <ToggleButton value="floor" aria-label="group by floor">
              <Tooltip title="Group by Floor">
                <Stack direction="row" alignItems="center" spacing={0.5}>
                  <FloorIcon fontSize="small" />
                  {!isMobile && <span>Floor</span>}
                </Stack>
              </Tooltip>
            </ToggleButton>
            <ToggleButton value="roomType" aria-label="group by room type">
              <Tooltip title="Group by Room Type">
                <Stack direction="row" alignItems="center" spacing={0.5}>
                  <RoomTypeIcon fontSize="small" />
                  {!isMobile && <span>Type</span>}
                </Stack>
              </Tooltip>
            </ToggleButton>
          </ToggleButtonGroup>
          <Badge
            badgeContent={rooms.length}
            color="primary"
            sx={{
              '& .MuiBadge-badge': {
                right: -10,
                top: -10,
                border: `2px solid ${theme.palette.background.paper}`,
                padding: '0 4px',
              },
            }}
          >
            <Avatar
              sx={{
                bgcolor: theme.palette.primary.main,
                width: 32,
                height: 32
              }}
            >
              <BedIcon fontSize="small" />
            </Avatar>
          </Badge>
        </Stack>
      </Box>

      {/* Room Status Summary Cards */}
      <Box sx={{ 
        display: 'flex', 
        gap: 2, 
        flexWrap: 'wrap',
        mb: 4,
        justifyContent: 'center',
        borderRadius: 10
      }}>
        {statusSummary.map(({ status, count, color }) => (
          <RoomStatusCard 
            key={status}
            status={status}
            count={count}
            color={color}
          />
        ))}
      </Box>

      {Object.entries(groupedRooms).map(([groupName, groupRooms]) => (
        <Box key={groupName} sx={{ mb: 4 }}>
          <Box sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 2
          }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
              {groupName.toUpperCase()}
              {groupBy === 'floor' && (
                <Typography component="span" variant="body2" sx={{ ml: 1, color: 'text.secondary' }}>
                  ({groupRooms.length} rooms)
                </Typography>
              )}
            </Typography>
            <Stack direction="row" spacing={1}>
              {Object.entries(statusColors).map(([status, color]) => {
                const count = getStatusCount(groupRooms, status);
                if (count === 0) return null;

                return (
                  <Tooltip key={status} title={`${status} Rooms`}>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        backgroundColor: theme.palette.mode === 'light' ? '#f5f5f5' : '#333',
                        borderRadius: 10,
                        px: 1,
                        py: 0.5,
                        cursor: 'pointer',
                        '&:hover': {
                          opacity: 0.9,
                          transform: 'scale(1.05)'
                        }
                      }}
                    >
                      <Box
                        sx={{
                          width: 10,
                          height: 10,
                          borderRadius: '50%',
                          backgroundColor: color,
                          mr: 1
                        }}
                      />
                      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                        {count}
                      </Typography>
                    </Box>
                  </Tooltip>
                );
              })}
            </Stack>
          </Box>
          <Divider sx={{ mb: 3 }} />

          <Grid container spacing={2}>
            {groupRooms.map((room) => (
              <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={room.id}>
                <Paper
                  elevation={3}
                  onClick={(e) => handleRoomClick(room, e)}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    handleRoomClick(room, e);
                  }}
                  sx={{
                    p: 2,
                    borderLeft: `6px solid ${room.color_code}`,
                    bgcolor: 'background.paper',
                    color: 'text.primary',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    transition: 'transform 0.2s',
                    cursor: 'pointer',
                    '&:hover': {
                      transform: 'scale(1.03)',
                      boxShadow: 6,
                    },
                  }}
                >
                  <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                        {room.room_no}
                      </Typography>
                      <Tooltip title="Room details">
                        <IconButton size="small" onClick={(e) => {
                          e.stopPropagation();
                          handleOpenModal(room);
                        }}>
                          <InfoIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                    {groupBy === 'roomType' && (
                      <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        mt: 1,
                        mb: 1,
                        color: 'text.secondary'
                      }}>
                        <FloorIcon fontSize="small" sx={{ mr: 1 }} />
                        <Typography variant="body2">{room.floor_name}</Typography>
                      </Box>
                    )}
                    <Box sx={{
                      display: 'flex',
                      alignItems: 'center',
                      mt: 1,
                      mb: 1,
                      color: 'text.secondary'
                    }}>
                      <BedIcon fontSize="small" sx={{ mr: 1 }} />
                      <Typography variant="body2">{room.room_type_name}</Typography>
                    </Box>
                  </Box>

                  <Box sx={{ mt: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <PersonIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        Max: {room.max_pax}
                      </Typography>
                      <PersonAddIcon fontSize="small" sx={{ ml: 2, mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        Extra: {room.max_extra_pax}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: room.color_code,
                        color: room.status_name.toUpperCase() === 'AVAILABLE' ? '#ffffff' : theme.palette.getContrastText(room.color_code),
                        padding: '4px 8px',
                        borderRadius: 1,
                        fontWeight: 'bold',
                        fontSize: isMobile ? '0.75rem' : '0.875rem',
                        textAlign: 'center',
                        width: '100%'
                      }}
                    >
                      {room.status_name.toUpperCase()}
                    </Box>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>
      ))}

      {/* Context Menu for Room Actions */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorReference="anchorPosition"
        anchorPosition={
          menuPosition.top !== 0 && menuPosition.left !== 0
            ? { top: menuPosition.top, left: menuPosition.left }
            : undefined
        }
        onClick={(e) => e.stopPropagation()}
        PaperProps={{
          elevation: 3,
          sx: {
            minWidth: 200,
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
          },
        }}
      >
        {selectedRoom && (() => {
          const status = selectedRoom.status_name?.toUpperCase();

          switch (status) {
            case 'OCCUPIED':
              return (
                <>
                  <MenuItem onClick={() => handleRoomAction('info')}>
                    <ListItemIcon><InfoIcon fontSize="small" /></ListItemIcon>
                    <ListItemText>Checkin Info</ListItemText>
                  </MenuItem>
                  <MenuItem onClick={() => handleRoomAction('checkout')}>
                    <ListItemIcon><LogoutIcon fontSize="small" /></ListItemIcon>
                    <ListItemText>Checkout</ListItemText>
                  </MenuItem>
                  <MenuItem onClick={() => handleRoomAction('folio')}>
                    <ListItemIcon><ReceiptLongIcon fontSize="small" /></ListItemIcon>
                    <ListItemText>Guest Folio</ListItemText>
                  </MenuItem>
                </>
              );
            case 'AVAILABLE':
              return (
                <>
                  <MenuItem onClick={() => handleRoomAction('checkin')}>
                    <ListItemIcon><CheckInIcon fontSize="small" /></ListItemIcon>
                    <ListItemText>Check In</ListItemText>
                  </MenuItem>
                  <MenuItem onClick={() => handleRoomAction('block')}>
                    <ListItemIcon><BlockIcon fontSize="small" /></ListItemIcon>
                    <ListItemText>Block Room</ListItemText>
                  </MenuItem>
                  <MenuItem onClick={() => handleRoomAction('maintenance')}>
                    <ListItemIcon><BuildIcon fontSize="small" /></ListItemIcon>
                    <ListItemText>Maintenance</ListItemText>
                  </MenuItem>
                </>
              );
            case 'DIRTY':
              return (
                <>
                  <MenuItem onClick={() => handleRoomAction('clean')}>
                    <ListItemIcon><CleaningIcon fontSize="small" /></ListItemIcon>
                    <ListItemText>Clean Room</ListItemText>
                  </MenuItem>
                  <MenuItem onClick={() => handleRoomAction('maintenance')}>
                    <ListItemIcon><BuildIcon fontSize="small" /></ListItemIcon>
                    <ListItemText>Maintenance</ListItemText>
                  </MenuItem>
                </>
              );
            case 'CLEANING':
              return (
                <MenuItem onClick={() => handleRoomAction('finish_cleaning')}>
                  <ListItemIcon><DoneIcon fontSize="small" /></ListItemIcon>
                  <ListItemText>Finish Cleaning</ListItemText>
                </MenuItem>
              );
            case 'BLOCKED':
              return (
                <MenuItem onClick={() => handleRoomAction('unblock')}>
                  <ListItemIcon><LockOpenIcon fontSize="small" /></ListItemIcon>
                  <ListItemText>Unblock Room</ListItemText>
                </MenuItem>
              );
            case 'MAINTENANCE':
              return (
                <MenuItem onClick={() => handleRoomAction('maintenance_over')}>
                  <ListItemIcon><CheckCircleIcon fontSize="small" /></ListItemIcon>
                  <ListItemText>Maintenance Over</ListItemText>
                </MenuItem>
              );
            case 'OUT OF ORDER':
              return (
                <MenuItem onClick={() => handleRoomAction('block')}>
                  <ListItemIcon><BlockIcon fontSize="small" /></ListItemIcon>
                  <ListItemText>Block Room</ListItemText>
                </MenuItem>
              );
            default:
              return null;
          }
        })()}
      </Menu>

      {/* Room Details Modal */}
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="room-details-modal"
        aria-describedby="room-details-description"
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: isMobile ? '90%' : '60%',
          maxWidth: 800,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
          outline: 'none'
        }}>
          {selectedRoom && (
            <>
              <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 3
              }}>
                <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold' }}>
                  Room {selectedRoom.room_no} Details
                </Typography>
                <IconButton onClick={handleCloseModal}>
                  <CloseIcon />
                </IconButton>
              </Box>

              <Divider sx={{ mb: 3 }} />

              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                    Basic Information
                  </Typography>
                  <Box sx={{
                    display: 'flex',
                    mb: 2,
                    alignItems: 'center'
                  }}>
                    <Typography variant="body1" sx={{ width: 120, color: 'text.secondary' }}>
                      Floor:
                    </Typography>
                    <Box sx={{
                      display: 'flex',
                      alignItems: 'center',
                      backgroundColor: theme.palette.mode === 'light' ? '#f5f5f5' : '#333',
                      px: 1.5,
                      py: 0.5,
                      borderRadius: 1,
                      flexGrow: 1
                    }}>
                      <FloorIcon fontSize="small" sx={{ mr: 1 }} />
                      <Typography variant="body1">{selectedRoom.floor_name}</Typography>
                    </Box>
                  </Box>
                  <Box sx={{
                    display: 'flex',
                    mb: 2,
                    alignItems: 'center'
                  }}>
                    <Typography variant="body1" sx={{ width: 120, color: 'text.secondary' }}>
                      Room Type:
                    </Typography>
                    <Box sx={{
                      display: 'flex',
                      alignItems: 'center',
                      backgroundColor: theme.palette.mode === 'light' ? '#f5f5f5' : '#333',
                      px: 1.5,
                      py: 0.5,
                      borderRadius: 1,
                      flexGrow: 1
                    }}>
                      <BedIcon fontSize="small" sx={{ mr: 1 }} />
                      <Typography variant="body1">{selectedRoom.room_type_name}</Typography>
                    </Box>
                  </Box>
                  <Box sx={{
                    display: 'flex',
                    mb: 2,
                    alignItems: 'center'
                  }}>
                    <Typography variant="body1" sx={{ width: 120, color: 'text.secondary' }}>
                      Status:
                    </Typography>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: selectedRoom.color_code,
                        color: selectedRoom.status_name.toUpperCase() === 'AVAILABLE' ? '#ffffff' : theme.palette.getContrastText(selectedRoom.color_code),
                        padding: '4px 8px',
                        borderRadius: 1,
                        fontWeight: 'bold',
                        flexGrow: 1
                      }}
                    >
                      {selectedRoom.status_name.toUpperCase()}
                    </Box>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                    Capacity
                  </Typography>
                  <Box sx={{
                    display: 'flex',
                    mb: 2,
                    alignItems: 'center'
                  }}>
                    <Typography variant="body1" sx={{ width: 120, color: 'text.secondary' }}>
                      Max Guests:
                    </Typography>
                    <Box sx={{
                      display: 'flex',
                      alignItems: 'center',
                      backgroundColor: theme.palette.mode === 'light' ? '#f5f5f5' : '#333',
                      px: 1.5,
                      py: 0.5,
                      borderRadius: 1,
                      flexGrow: 1
                    }}>
                      <PersonIcon fontSize="small" sx={{ mr: 1 }} />
                      <Typography variant="body1">{selectedRoom.max_pax}</Typography>
                    </Box>
                  </Box>
                  <Box sx={{
                    display: 'flex',
                    mb: 2,
                    alignItems: 'center'
                  }}>
                    <Typography variant="body1" sx={{ width: 120, color: 'text.secondary' }}>
                      Extra Guests:
                    </Typography>
                    <Box sx={{
                      display: 'flex',
                      alignItems: 'center',
                      backgroundColor: theme.palette.mode === 'light' ? '#f5f5f5' : '#333',
                      px: 1.5,
                      py: 0.5,
                      borderRadius: 1,
                      flexGrow: 1
                    }}>
                      <PersonAddIcon fontSize="small" sx={{ mr: 1 }} />
                      <Typography variant="body1">{selectedRoom.max_extra_pax}</Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>

              <Box sx={{ mt: 3, pt: 2, borderTop: '1px solid #eee' }}>
                <Typography variant="body2" color="text.secondary">
                  Last updated: {new Date(selectedRoom.updated_at).toLocaleString()}
                </Typography>
              </Box>
            </>
          )}
        </Box>
      </Modal>
    </Container>
  );
};

export default React.memo(DashboardContent);