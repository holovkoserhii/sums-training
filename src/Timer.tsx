import React, { useEffect, useRef, useState } from 'react';
import { Typography } from '@mui/material';
import { add, differenceInMilliseconds } from 'date-fns';

const GAME_DURATION_SEC = 10;
const GAME_RESULT_DISPLAY_DURATION_SEC = 10;

const calculateRemainingTime = (end: Date) =>
  Math.ceil(differenceInMilliseconds(end, new Date()) / 1000);

type Props = {
  onUserTimeFinished: () => void;
  onGameEnd: () => void;
};

export const Timer: React.FC<Props> = ({ onUserTimeFinished, onGameEnd }) => {
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
  return <Typography>{`Time left: ${timeRemaining} seconds`}</Typography>;
};
