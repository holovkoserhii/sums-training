import React from 'react';
import { Box, Typography } from '@mui/material';
import { isEmpty } from 'lodash';

export const HighScores: React.FC = () => {
  const lsItem = localStorage.getItem('highScores');
  const highScores = lsItem ? JSON.parse(lsItem) : [];
  return (
    <Box mt={3}>
      <Typography>High scores</Typography>
      {!isEmpty(highScores) && (
        <table>
          <tr>
            <th>Score</th>
            <th>Username</th>
            <th>Timestamp</th>
          </tr>
          {/*@ts-ignore*/}
          {highScores.map((hs) => (
            <tr key={hs.timestamp}>
              <td>{hs.score}</td>
              <td>{hs.username}</td>
              <td>{hs.timestamp}</td>
            </tr>
          ))}
        </table>
      )}
    </Box>
  );
};
