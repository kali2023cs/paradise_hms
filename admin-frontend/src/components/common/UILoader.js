// src/components/common/UILoader.js
import React from 'react';
import styled from '@emotion/styled';
import { Box, useTheme } from '@mui/material';

const LoaderWrapper = styled.div(({ theme }) => ({
  width: '48px',
  height: '48px',
  position: 'relative',

  '&:before': {
    content: '""',
    width: '48px',
    height: '5px',
    background: theme.palette.mode === 'dark' ? '#555' : '#999',
    position: 'absolute',
    top: '60px',
    left: 0,
    borderRadius: '50%',
    animation: 'shadow324 0.5s linear infinite',
  },

  '&:after': {
    content: '""',
    width: '100%',
    height: '100%',
    background: theme.palette.primary.main,
    position: 'absolute',
    top: 0,
    left: 0,
    borderRadius: '4px',
    animation: 'jump7456 0.5s linear infinite',
  },

  '@keyframes jump7456': {
    '15%': {
      borderBottomRightRadius: '3px',
    },
    '25%': {
      transform: 'translateY(9px) rotate(22.5deg)',
    },
    '50%': {
      transform: 'translateY(18px) scale(1, 0.9) rotate(45deg)',
      borderBottomRightRadius: '40px',
    },
    '75%': {
      transform: 'translateY(9px) rotate(67.5deg)',
    },
    '100%': {
      transform: 'translateY(0) rotate(90deg)',
    },
  },

  '@keyframes shadow324': {
    '0%, 100%': {
      transform: 'scale(1, 1)',
    },
    '50%': {
      transform: 'scale(1.2, 1)',
    },
  },
}));

const UILoader = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        height: '60vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <LoaderWrapper theme={theme} />
    </Box>
  );
};

export default UILoader;