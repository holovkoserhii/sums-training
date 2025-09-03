import React, { useEffect, useRef, useState } from 'react';
import { Typography, Box, LinearProgress } from '@mui/material';
import { add, differenceInMilliseconds } from 'date-fns';
import { useLanguage } from './LanguageContext.tsx';

const GAME_DURATION_SEC = 60;
const GAME_RESULT_DISPLAY_DURATION_SEC = 10;

const calculateRemainingTime = (end: Date) =>
  Math.ceil(differenceInMilliseconds(end, new Date()) / 1000);

type Props = {
  onUserTimeFinished: () => void;
  onGameEnd: () => void;
};

export const Timer: React.FC<Props> = ({ onUserTimeFinished, onGameEnd }) => {
  const { t } = useLanguage();
  const gameEndTimeRef = useRef(
    add(new Date(), { seconds: GAME_DURATION_SEC }),
  );

  const intervalIdRef = useRef(NaN);
  const [timeRemaining, setTimeRemaining] = useState(
    calculateRemainingTime(gameEndTimeRef.current),
  );

  useEffect(() => {
    intervalIdRef.current = setInterval(() => {
      setTimeRemaining(calculateRemainingTime(gameEndTimeRef.current));
    }, 1000);

    return () => clearInterval(intervalIdRef.current);
  }, []);

  useEffect(() => {
    if (timeRemaining <= 0) {
      onUserTimeFinished();
      clearInterval(intervalIdRef.current);
      setTimeout(() => {
        onGameEnd();
      }, GAME_RESULT_DISPLAY_DURATION_SEC * 1000);
    }
  }, [timeRemaining]);
  
  const progress = (timeRemaining / GAME_DURATION_SEC) * 100;
  const isLowTime = timeRemaining <= 10;
  
  return (
    <Box sx={{ width: '100%', maxWidth: '400px', margin: '0 auto' }}>
      <Box display="flex" alignItems="center" justifyContent="center" mb={1}>
        <Typography 
          variant="h5" 
          sx={{ 
            fontWeight: 600,
            color: isLowTime ? '#f5576c' : '#333',
            animation: isLowTime ? 'pulse 1s infinite' : 'none',
            '@keyframes pulse': {
              '0%': { transform: 'scale(1)' },
              '50%': { transform: 'scale(1.05)' },
              '100%': { transform: 'scale(1)' },
            },
          }}
        >
          {t('timeLeft', { time: timeRemaining })}
        </Typography>
      </Box>
      <LinearProgress 
        variant="determinate" 
        value={progress}
        sx={{
          height: 10,
          borderRadius: 5,
          backgroundColor: 'rgba(0,0,0,0.1)',
          '& .MuiLinearProgress-bar': {
            borderRadius: 5,
            background: isLowTime 
              ? 'linear-gradient(90deg, #f5576c 0%, #f093fb 100%)'
              : 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
            transition: 'all 0.3s ease',
          },
        }}
      />
    </Box>
  );
};
