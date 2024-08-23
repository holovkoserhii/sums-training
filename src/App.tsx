import React, { useState } from 'react';
import { Box, Button, TextField } from '@mui/material';
import { GameDynamics } from './GameDynamics.tsx';
import { HighScores } from './HighScores.tsx';

export const App: React.FC = () => {
  const [isGameInProgress, setIsGameInProgress] = useState(false);
  const [username, setUsername] = useState('');
  return (
    <Box width="100vw" height="100vh">
      {isGameInProgress ? (
        <GameDynamics
          onGameEnd={() => setIsGameInProgress(false)}
          username={username}
        />
      ) : (
        <>
          <Box>
            <TextField
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Type your name"
              sx={{
                '& input': {
                  fontSize: '14px',
                },
                width: 300,
              }}
            />
            <Button
              disabled={!username}
              onClick={() => setIsGameInProgress(true)}
              sx={{
                display: 'block',
              }}
            >
              Start
            </Button>
          </Box>

          <HighScores />
        </>
      )}
    </Box>
  );
};
