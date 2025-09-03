import { Box, Typography, Paper } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { last, orderBy, take } from 'lodash';
import { SumTrainer } from './SumTrainer.tsx';
import { Timer } from './Timer.tsx';
import { useLanguage } from './LanguageContext.tsx';

type Props = {
  onGameEnd: () => void;
  username: string;
};

const MAX_HIGH_SCORES_ITEMS = 10;

export const GameDynamics: React.FC<Props> = ({ onGameEnd, username }) => {
  const [isSumShown, setIsSumShown] = useState(true);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const { t } = useLanguage();

  useEffect(() => {
    if (!isSumShown) {
      const lsItem = localStorage.getItem('highScores');
      const prevHighScores = lsItem
        ? take(JSON.parse(lsItem), MAX_HIGH_SCORES_ITEMS)
        : [];
      const shouldAddNewItem =
        // @ts-expect-error
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
  }, [isSumShown, score, username]);

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      width="100vw"
      height="100vh"
    >
      <Paper
        elevation={10}
        sx={{
          p: 5,
          borderRadius: 4,
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          minWidth: '600px',
          maxWidth: '800px',
          animation: 'fadeIn 0.5s ease-out',
          '@keyframes fadeIn': {
            '0%': { opacity: 0, transform: 'scale(0.95)' },
            '100%': { opacity: 1, transform: 'scale(1)' },
          },
        }}
      >
        <Box textAlign="center" mb={4}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 600,
              color: '#333',
              mb: 2,
            }}
          >
            {t('challenge', { name: username })}
          </Typography>

          <Timer
            onGameEnd={onGameEnd}
            onUserTimeFinished={() => setIsSumShown(false)}
          />
        </Box>

        <Box display="flex" justifyContent="center" gap={3} mb={4}>
          <Box
            sx={{
              px: 2.5,
              py: 1.5,
              borderRadius: 2,
              backgroundColor: 'rgba(0, 0, 0, 0.04)',
              border: '1px solid rgba(0, 0, 0, 0.08)',
              minWidth: '120px',
              textAlign: 'center',
            }}
          >
            <Typography variant="caption" sx={{ color: '#666', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              {t('yourScore')}
            </Typography>
            <Typography variant="h6" sx={{ color: '#333', fontWeight: 600 }}>
              {score}
            </Typography>
          </Box>

          <Box
            sx={{
              px: 2.5,
              py: 1.5,
              borderRadius: 2,
              backgroundColor: 'rgba(0, 0, 0, 0.04)',
              border: '1px solid rgba(0, 0, 0, 0.08)',
              minWidth: '120px',
              textAlign: 'center',
            }}
          >
            <Typography variant="caption" sx={{ color: '#666', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              {t('yourLevel')}
            </Typography>
            <Typography variant="h6" sx={{ color: '#333', fontWeight: 600 }}>
              {level}
            </Typography>
          </Box>
        </Box>

        {isSumShown ? (
          <Box>
            <SumTrainer
              handleAddScore={(scoreIncrement: number) =>
                setScore(score + scoreIncrement)
              }
              level={level}
              setLevel={setLevel}
            />
          </Box>
        ) : (
          <Box
            textAlign="center"
            sx={{
              animation: 'bounceIn 0.5s ease-out',
              '@keyframes bounceIn': {
                '0%': { transform: 'scale(0.3)', opacity: 0 },
                '50%': { transform: 'scale(1.05)' },
                '70%': { transform: 'scale(0.9)' },
                '100%': { transform: 'scale(1)', opacity: 1 },
              },
            }}
          >
            <Typography
              variant="h3"
              sx={{
                fontWeight: 700,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 2,
              }}
            >
              {t('gameOver')}
            </Typography>
            <Typography variant="h5" color="text.secondary">
              {t('finalScore')}: <strong>{score}</strong>
            </Typography>
          </Box>
        )}
      </Paper>
    </Box>
  );
};
