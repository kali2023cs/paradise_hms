import React, { useCallback, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  IconButton,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Divider,
  styled
} from '@mui/material';
import { Add, Delete } from '@mui/icons-material';

// Styled components for better customization
const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  maxWidth: '100%',
  overflowX: 'auto',
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[1],
  transition: 'box-shadow 0.3s ease-in-out',
  '&:hover': {
    boxShadow: theme.shadows[4]
  }
}));

const StyledTable = styled(Table)(({ theme }) => ({
  '& .MuiTableCell-root': {
    fontSize: '0.75rem',
    padding: theme.spacing(0.5, 1),
    transition: 'background-color 0.2s ease'
  },
  '& .MuiTableRow-root:hover .MuiTableCell-root': {
    backgroundColor: theme.palette.action.hover
  }
}));

const StyledSelect = styled(Select)(({ theme }) => ({
  fontSize: '0.75rem',
  padding: theme.spacing(0.5, 0),
  '& .MuiSelect-select': {
    padding: theme.spacing(0.75, 1)
  }
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiInputBase-root': {
    fontSize: '0.75rem',
    padding: theme.spacing(0.5, 0),
    '& input': {
      padding: theme.spacing(0.75, 1)
    }
  }
}));

const AddButton = styled(Button)(({ theme }) => ({
  textTransform: 'none',
  borderRadius: theme.shape.borderRadius,
  boxShadow: 'none',
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    boxShadow: 'none',
    backgroundColor: theme.palette.success.dark,
    transform: 'translateY(-1px)'
  }
}));

const DeleteButton = styled(IconButton)(({ theme }) => ({
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    color: theme.palette.error.main,
    transform: 'scale(1.1)'
  }
}));

const RoomDetailsForm = React.memo(({
  roomDetails,
  dropdowns,
  isMobile,
  cache,
  onRoomTypeChange,
  onRoomNoChange,
  onRatePlanChange,
  onPaxChange,
  onDiscTypeChange,
  onDiscValChange,
  onAddRoom,
  onRemoveRoom,
  onRoomFieldChange
}) => {
  const getAvailableRoomsForRow = useCallback((index) => {
    const roomTypeId = roomDetails[index].roomTypeId;
    if (!roomTypeId) return [];

    const rooms = cache.roomsByType[roomTypeId] || [];
    const selectedRoomNumbers = roomDetails
      .filter((_, i) => i !== index)
      .map(room => room.roomNo)
      .filter(Boolean);

    return rooms.filter(room => !selectedRoomNumbers.includes(room.room_no));
  }, [cache.roomsByType, roomDetails]);

  const memoizedRoomTypes = useMemo(() => dropdowns.roomTypes || [], [dropdowns.roomTypes]);

  // Column configuration for responsive design
  const columns = useMemo(() => [
    { id: 'roomType', label: 'Room Type *', minWidth: 140, align: 'left' },
    { id: 'roomNo', label: 'Room No. *', minWidth: 100, align: 'left' },
    { id: 'ratePlan', label: 'Rate Plan *', minWidth: 120, align: 'left' },
    { id: 'mealPlan', label: 'Meal Plan', minWidth: 100, align: 'left' },
    { id: 'guestName', label: 'Guest Name *', minWidth: 150, align: 'left' },
    { id: 'contact', label: 'Contact', minWidth: 120, align: 'left' },
    { id: 'male', label: 'Male', minWidth: 70, align: 'center' },
    { id: 'female', label: 'Female', minWidth: 70, align: 'center' },
    { id: 'extra', label: 'Extra', minWidth: 70, align: 'center' },
    { id: 'netRate', label: 'Net Rate', minWidth: 90, align: 'right' },
    { id: 'discType', label: 'Disc. Type', minWidth: 110, align: 'left' },
    { id: 'discVal', label: 'Disc. Val', minWidth: 90, align: 'right' },
    { id: 'total', label: 'Total', minWidth: 90, align: 'right' },
    { id: 'action', label: 'Action', minWidth: 60, align: 'center' }
  ], []);

  return (
    <Box sx={{ mb: 4 }}>
      <Box 
        display="flex" 
        justifyContent="space-between" 
        alignItems="center" 
        mb={2}
        sx={{
          padding: 2,
          backgroundColor: 'background.paper',
          borderRadius: 1,
          boxShadow: 1
        }}
      >
        <Typography variant="h6" fontWeight="bold" color="primary">
          Room Details
        </Typography>
        <AddButton
          variant="contained"
          color="success"
          startIcon={<Add />}
          onClick={onAddRoom}
          size="small"
        >
          Add Room
        </AddButton>
      </Box>

      <StyledTableContainer component={Paper}>
        <StyledTable size="small" stickyHeader aria-label="room details table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  sx={{ 
                    minWidth: column.minWidth,
                    fontWeight: 'bold',
                    backgroundColor: 'background.default'
                  }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {roomDetails.map((row, index) => (
              <TableRow 
                key={index}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                {/* Room Type */}
                <TableCell>
                  <FormControl fullWidth size="small">
                    <StyledSelect
                      value={row.roomType}
                      onChange={(e) => onRoomTypeChange(index, e.target.value)}
                      displayEmpty
                      required
                    >
                      <MenuItem value="" sx={{ fontSize: '0.75rem' }}>
                        <em>Select Room Type</em>
                      </MenuItem>
                      {memoizedRoomTypes.map((type) => (
                        <MenuItem key={type.id} value={type.room_type_name} sx={{ fontSize: '0.75rem' }}>
                          {type.room_type_name}
                        </MenuItem>
                      ))}
                    </StyledSelect>
                  </FormControl>
                </TableCell>

                {/* Room No */}
                <TableCell>
                  <FormControl fullWidth size="small">
                    <StyledSelect
                      value={row.roomNo}
                      onChange={(e) => onRoomNoChange(index, e.target.value)}
                      displayEmpty
                      required
                      disabled={!row.roomTypeId}
                    >
                      <MenuItem value="" sx={{ fontSize: '0.75rem' }}>
                        <em>Select Room</em>
                      </MenuItem>
                      {getAvailableRoomsForRow(index).map((room) => (
                        <MenuItem key={room.id} value={room.room_no} sx={{ fontSize: '0.75rem' }}>
                          {room.room_no}
                        </MenuItem>
                      ))}
                    </StyledSelect>
                  </FormControl>
                </TableCell>

                {/* Rate Plan */}
                <TableCell>
                  <FormControl fullWidth size="small">
                    <StyledSelect
                      value={row.ratePlan}
                      onChange={(e) => onRatePlanChange(index, e.target.value)}
                      displayEmpty
                      required
                      disabled={!row.roomTypeId}
                    >
                      <MenuItem value="" sx={{ fontSize: '0.75rem' }}>
                        <em>Select Plan</em>
                      </MenuItem>
                      {row.roomTypeId && cache.plansByType[row.roomTypeId]?.map((plan) => (
                        <MenuItem key={plan.id} value={plan.plan_name} sx={{ fontSize: '0.75rem' }}>
                          {plan.plan_name}
                        </MenuItem>
                      ))}
                    </StyledSelect>
                  </FormControl>
                </TableCell>

                {/* Meal Plan */}
                <TableCell>
                  <StyledTextField
                    value={row.mealPlan}
                    size="small"
                    fullWidth
                    InputProps={{ readOnly: true }}
                  />
                </TableCell>

                {/* Guest Name */}
                <TableCell>
                  <StyledTextField
                    value={row.guestName}
                    onChange={(e) => onRoomFieldChange(index, 'guestName', e.target.value)}
                    size="small"
                    fullWidth
                  />
                </TableCell>

                {/* Contact */}
                <TableCell>
                  <StyledTextField
                    value={row.contact}
                    onChange={(e) => onRoomFieldChange(index, 'contact', e.target.value)}
                    size="small"
                    fullWidth
                  />
                </TableCell>

                {/* Male */}
                <TableCell align="center">
                  <StyledTextField
                    type="number"
                    value={row.male}
                    onChange={(e) => onPaxChange(index, 'male', e.target.value)}
                    size="small"
                    inputProps={{ min: 0, max: row.maxPax }}
                    fullWidth
                  />
                </TableCell>

                {/* Female */}
                <TableCell align="center">
                  <StyledTextField
                    type="number"
                    value={row.female}
                    onChange={(e) => onPaxChange(index, 'female', e.target.value)}
                    size="small"
                    inputProps={{ min: 0, max: row.maxPax }}
                    fullWidth
                  />
                </TableCell>

                {/* Extra */}
                <TableCell align="center">
                  <StyledTextField
                    type="number"
                    value={row.extra}
                    onChange={(e) => onPaxChange(index, 'extra', e.target.value)}
                    size="small"
                    inputProps={{ min: 0, max: row.maxExtraPax }}
                    fullWidth
                  />
                </TableCell>

                {/* Net Rate */}
                <TableCell align="right">
                  <StyledTextField
                    value={row.netRate}
                    size="small"
                    fullWidth
                    InputProps={{ readOnly: true }}
                  />
                </TableCell>

                {/* Disc. Type */}
                <TableCell>
                  <FormControl fullWidth size="small">
                    <StyledSelect
                      value={row.discType}
                      onChange={(e) => onDiscTypeChange(index, e.target.value)}
                      disabled={!row.netRate}
                    >
                      <MenuItem value="No Disc" sx={{ fontSize: '0.75rem' }}>No Disc</MenuItem>
                      <MenuItem value="Amount" sx={{ fontSize: '0.75rem' }}>Amount</MenuItem>
                      <MenuItem value="Percentage" sx={{ fontSize: '0.75rem' }}>Percentage</MenuItem>
                    </StyledSelect>
                  </FormControl>
                </TableCell>

                {/* Disc. Val */}
                <TableCell align="right">
                  <StyledTextField
                    value={row.discVal}
                    onChange={(e) => onDiscValChange(index, e.target.value)}
                    size="small"
                    fullWidth
                    disabled={row.discType === 'No Disc' || !row.netRate}
                    InputProps={{
                      endAdornment: row.discType === 'Percentage' ? '%' : null
                    }}
                  />
                </TableCell>

                {/* Total */}
                <TableCell align="right">
                  <StyledTextField
                    value={row.total}
                    size="small"
                    fullWidth
                    InputProps={{ readOnly: true }}
                  />
                </TableCell>

                {/* Delete Action */}
                <TableCell align="center">
                  <DeleteButton
                    size="small"
                    color="default"
                    onClick={() => onRemoveRoom(index)}
                    disabled={roomDetails.length <= 1}
                  >
                    <Delete fontSize="small" />
                  </DeleteButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </StyledTable>
      </StyledTableContainer>
    </Box>
  );
});

export default RoomDetailsForm;