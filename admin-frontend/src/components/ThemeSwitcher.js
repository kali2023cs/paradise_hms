// src/components/ThemeSwitcher.js
import React from 'react';
import { Box, IconButton, Tooltip, Menu, MenuItem } from '@mui/material';
import {
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
  Palette as PaletteIcon
} from '@mui/icons-material';
import { ChromePicker } from 'react-color';

const ThemeSwitcher = ({ mode, onModeChange, onColorChange }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [color, setColor] = React.useState(mode === 'dark' ? '#616161' : '#1976d2'); // Gray for dark, blue for light

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleColorChange = (newColor) => {
    setColor(newColor.hex);
    onColorChange(newColor.hex);
  };

  // Reset color when mode changes
  React.useEffect(() => {
    setColor(mode === 'dark' ? '#616161' : '#1976d2');
    onColorChange(mode === 'dark' ? '#616161' : '#1976d2');
  }, [mode, onColorChange]);

  return (
    <Box>
      <Tooltip title="Toggle light/dark mode">
        <IconButton onClick={onModeChange} color="inherit">
          {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
        </IconButton>
      </Tooltip>
      
      <Tooltip title="Change primary color">
        <IconButton onClick={handleClick} color="inherit">
          <PaletteIcon />
        </IconButton>
      </Tooltip>
      
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{
          style: {
            padding: '16px',
            overflow: 'visible',
          },
        }}
      >
        <ChromePicker
          color={color}
          onChangeComplete={handleColorChange}
        />
        <MenuItem onClick={handleClose}>Close</MenuItem>
      </Menu>
    </Box>
  );
};

export default ThemeSwitcher;