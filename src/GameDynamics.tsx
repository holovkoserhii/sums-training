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
        // @ts-expect-error - last() return type may be undefined
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
      sx={{
        overflow: 'hidden',
        position: 'fixed',
        top: 0,
        left: 0
      }}
    >
      <Paper
        elevation={10}
        sx={{
          p: { xs: 3, sm: 4, md: 5 },
          borderRadius: 4,
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          minWidth: { xs: '90%', sm: '500px', md: '600px' },
          maxWidth: { xs: '95%', sm: '700px', md: '800px' },
          m: { xs: 2, sm: 0 },
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
              fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' },
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

        <Box 
          display="flex" 
          justifyContent="center" 
          gap={{ xs: 2, sm: 3 }} 
          mb={{ xs: 3, sm: 4 }}
          flexWrap={{ xs: 'wrap', sm: 'nowrap' }}
        >
          <Box
            sx={{
              px: { xs: 2, sm: 2.5 },
              py: { xs: 1.25, sm: 1.5 },
              borderRadius: 2,
              backgroundColor: 'rgba(0, 0, 0, 0.04)',
              border: '1px solid rgba(0, 0, 0, 0.08)',
              minWidth: { xs: '110px', sm: '120px' },
              textAlign: 'center',
            }}
          >
            <Typography 
              variant="caption" 
              sx={{ 
                color: '#666', 
                fontSize: { xs: '10px', sm: '11px' }, 
                textTransform: 'uppercase', 
                letterSpacing: '0.5px' 
              }}
            >
              {t('yourScore')}
            </Typography>
            <Typography 
              variant="h6" 
              sx={{ 
                color: '#333', 
                fontWeight: 600,
                fontSize: { xs: '1.125rem', sm: '1.25rem' }
              }}
            >
              {score}
            </Typography>
          </Box>

          <Box
            sx={{
              px: { xs: 2, sm: 2.5 },
              py: { xs: 1.25, sm: 1.5 },
              borderRadius: 2,
              backgroundColor: 'rgba(0, 0, 0, 0.04)',
              border: '1px solid rgba(0, 0, 0, 0.08)',
              minWidth: { xs: '110px', sm: '120px' },
              textAlign: 'center',
            }}
          >
            <Typography 
              variant="caption" 
              sx={{ 
                color: '#666', 
                fontSize: { xs: '10px', sm: '11px' }, 
                textTransform: 'uppercase', 
                letterSpacing: '0.5px' 
              }}
            >
              {t('yourLevel')}
            </Typography>
            <Typography 
              variant="h6" 
              sx={{ 
                color: '#333', 
                fontWeight: 600,
                fontSize: { xs: '1.125rem', sm: '1.25rem' }
              }}
            >
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
                fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
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
            <Typography 
              variant="h5" 
              color="text.secondary"
              sx={{
                fontSize: { xs: '1.25rem', sm: '1.5rem' }
              }}
            >
              {t('finalScore')}: <strong>{score}</strong>
            </Typography>
          </Box>
        )}
      </Paper>
    </Box>
  );
};
