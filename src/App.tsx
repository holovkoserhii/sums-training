import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Paper, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { GameDynamics } from './GameDynamics.tsx';
import { HighScores } from './HighScores.tsx';
import { useLanguage } from './LanguageContext.tsx';
import { Language } from './translations.ts';

export const App: React.FC = () => {
  const [isGameInProgress, setIsGameInProgress] = useState(false);
  const [username, setUsername] = useState('');
  const { language, setLanguage, t } = useLanguage();
  return (
    <Box 
      width="100vw" 
      height="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      sx={{
        overflow: 'hidden',
        position: 'fixed',
        top: 0,
        left: 0
      }}
    >
      {isGameInProgress ? (
        <GameDynamics
          onGameEnd={() => setIsGameInProgress(false)}
          username={username}
        />
      ) : (
        <Paper
          elevation={10}
          sx={{
            p: { xs: 3, sm: 4, md: 5 },
            borderRadius: 4,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            minWidth: { xs: '90%', sm: '400px', md: '500px' },
            maxWidth: { xs: '95%', sm: '500px', md: '600px' },
            m: { xs: 2, sm: 0 },
            animation: 'slideIn 0.5s ease-out',
            '@keyframes slideIn': {
              '0%': { transform: 'translateY(-30px)', opacity: 0 },
              '100%': { transform: 'translateY(0)', opacity: 1 },
            },
          }}
        >
          <Box display="flex" justifyContent="center" mb={3}>
            <ToggleButtonGroup
              value={language}
              exclusive
              onChange={(_, newLang: Language) => newLang && setLanguage(newLang)}
              aria-label="language"
              size="small"
              sx={{
                flexWrap: { xs: 'wrap', sm: 'nowrap' },
                '& .MuiToggleButton-root': {
                  px: { xs: 2, sm: 3 },
                  py: 1,
                  fontSize: { xs: '0.875rem', sm: '1rem' },
                  borderRadius: 2,
                  border: '1px solid rgba(102, 126, 234, 0.3)',
                  '&.Mui-selected': {
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #5a72e0 0%, #6a4298 100%)',
                    },
                  },
                },
              }}
            >
              <ToggleButton value="uk">🇺🇦 Українська</ToggleButton>
              <ToggleButton value="en">🇬🇧 English</ToggleButton>
            </ToggleButtonGroup>
          </Box>
          
          <Box textAlign="center" mb={4}>
            <Typography 
              variant="h3" 
              sx={{ 
                fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                fontWeight: 700,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 2
              }}
            >
              {t('title')}
            </Typography>
            <Typography 
              variant="body1" 
              color="text.secondary"
              sx={{
                fontSize: { xs: '0.875rem', sm: '1rem' },
                px: { xs: 2, sm: 0 }
              }}
            >
              {t('subtitle')}
            </Typography>
          </Box>
          
          <Box display="flex" flexDirection="column" alignItems="center" gap={3}>
            <TextField
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder={t('enterName')}
              variant="outlined"
              sx={{
                width: '100%',
                maxWidth: { xs: '100%', sm: 350 },
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  '&:hover fieldset': {
                    borderColor: '#667eea',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#667eea',
                  },
                },
                '& input': {
                  fontSize: { xs: '14px', sm: '16px' },
                  padding: { xs: '12px', sm: '14px' },
                },
              }}
            />
            <Button
              disabled={!username}
              onClick={() => setIsGameInProgress(true)}
              variant="contained"
              size="large"
              sx={{
                borderRadius: 2,
                px: { xs: 4, sm: 6 },
                py: { xs: 1.25, sm: 1.5 },
                fontSize: { xs: '16px', sm: '18px' },
                fontWeight: 600,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  background: 'linear-gradient(135deg, #5a72e0 0%, #6a4298 100%)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 20px rgba(102, 126, 234, 0.5)',
                },
                '&:disabled': {
                  background: '#ccc',
                  boxShadow: 'none',
                },
              }}
            >
              {t('startGame')}
            </Button>
          </Box>

          <HighScores />
        </Paper>
      )}
    </Box>
  );
};
