import React from 'react';
import { Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip } from '@mui/material';
import { isEmpty } from 'lodash';
import { useLanguage } from './LanguageContext.tsx';

export const HighScores: React.FC = () => {
  const lsItem = localStorage.getItem('highScores');
  const highScores = lsItem ? JSON.parse(lsItem) : [];
  const { t } = useLanguage();
  return (
    <Box mt={4}>
      <Typography 
        variant="h5" 
        sx={{ 
          fontWeight: 600,
          mb: 2,
          textAlign: 'center',
          color: '#333'
        }}
      >
        {t('highScores')}
      </Typography>
      {!isEmpty(highScores) ? (
        <TableContainer 
          component={Paper} 
          elevation={0}
          sx={{
            borderRadius: 2,
            border: '1px solid rgba(0,0,0,0.08)',
            maxHeight: '300px',
            overflow: 'auto',
            '&::-webkit-scrollbar': {
              width: '8px',
            },
            '&::-webkit-scrollbar-track': {
              background: '#f1f1f1',
              borderRadius: '10px',
            },
            '&::-webkit-scrollbar-thumb': {
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: '10px',
            },
          }}
        >
          <Table size="small" stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell 
                  sx={{ 
                    fontWeight: 700,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    borderBottom: 'none',
                  }}
                >
                  {t('rank')}
                </TableCell>
                <TableCell 
                  sx={{ 
                    fontWeight: 700,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    borderBottom: 'none',
                  }}
                >
                  {t('player')}
                </TableCell>
                <TableCell 
                  align="center"
                  sx={{ 
                    fontWeight: 700,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    borderBottom: 'none',
                  }}
                >
                  {t('score')}
                </TableCell>
                <TableCell 
                  sx={{ 
                    fontWeight: 700,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    borderBottom: 'none',
                  }}
                >
                  {t('date')}
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {/*@ts-ignore*/}
              {highScores.map((hs, index) => (
                <TableRow 
                  key={hs.timestamp}
                  sx={{
                    '&:hover': {
                      backgroundColor: 'rgba(102, 126, 234, 0.05)',
                    },
                    '&:nth-of-type(odd)': {
                      backgroundColor: 'rgba(0, 0, 0, 0.02)',
                    },
                  }}
                >
                  <TableCell>
                    {index === 0 && '🥇'}
                    {index === 1 && '🥈'}
                    {index === 2 && '🥉'}
                    {index > 2 && `#${index + 1}`}
                  </TableCell>
                  <TableCell sx={{ fontWeight: 500 }}>
                    {hs.username}
                  </TableCell>
                  <TableCell align="center">
                    <Chip 
                      label={hs.score} 
                      size="small"
                      sx={{
                        background: index === 0 
                          ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                          : 'linear-gradient(135deg, #e0e0e0 0%, #bdbdbd 100%)',
                        color: index === 0 ? 'white' : '#333',
                        fontWeight: 600,
                      }}
                    />
                  </TableCell>
                  <TableCell sx={{ fontSize: '12px', color: '#666' }}>
                    {hs.timestamp}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Box 
          sx={{
            textAlign: 'center',
            py: 3,
            px: 2,
            borderRadius: 2,
            border: '1px dashed rgba(102, 126, 234, 0.3)',
            backgroundColor: 'rgba(102, 126, 234, 0.05)',
          }}
        >
          <Typography variant="body2" color="text.secondary">
            {t('noHighScores')}
          </Typography>
        </Box>
      )}
    </Box>
  );
};
