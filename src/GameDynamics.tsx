import { Box, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { last, orderBy, take } from 'lodash';
import { SumTrainer } from './SumTrainer.tsx';
import { Timer } from './Timer.tsx';

type Props = {
  onGameEnd: () => void;
  username: string;
};

const MAX_HIGH_SCORES_ITEMS = 10;

export const GameDynamics: React.FC<Props> = ({ onGameEnd, username }) => {
  const [isSumShown, setIsSumShown] = useState(true);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);

  useEffect(() => {
    if (!isSumShown) {
      const lsItem = localStorage.getItem('highScores');
      const prevHighScores = lsItem
        ? take(JSON.parse(lsItem), MAX_HIGH_SCORES_ITEMS)
        : [];
      const shouldAddNewItem =
        // @ts-ignore
        (last(prevHighScores)?.score ?? 0) < score ||
        prevHighScores.length < MAX_HIGH_SCORES_ITEMS;
      if (!shouldAddNewItem) {
        return;
      }
      localStorage.setItem(
        'highScores',
        JSON.stringify(
          take(
            orderBy(
              [
                ...prevHighScores,
                {
                  timestamp: new Date().toLocaleString(),
                  username,
                  score,
                },
              ],
              ['score'],
              ['desc'],
            ),
            MAX_HIGH_SCORES_ITEMS,
          ),
        ),
      );
    }
  }, [isSumShown]);

  return (
    <Box>
      <Typography variant="h3">{`${username}'s challenge`}</Typography>
      <Timer
        onGameEnd={onGameEnd}
        onUserTimeFinished={() => setIsSumShown(false)}
      />
      <Typography>{`Your score: ${score}`}</Typography>
      <Typography>{`Your level: ${level}`}</Typography>

      {isSumShown ? (
        <SumTrainer
          handleAddScore={(scoreIncrement: number) =>
            setScore(score + scoreIncrement)
          }
          level={level}
          setLevel={setLevel}
        />
      ) : (
        <Typography>{`The game is finished. Your final score is ${score}`}</Typography>
      )}
    </Box>
  );
};
