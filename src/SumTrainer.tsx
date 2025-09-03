import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Box, TextField, Typography } from '@mui/material';
import { differenceInMilliseconds } from 'date-fns';

const fib = [
  5, 8, 13, 21, 34, 55, 89, 144, 233, 377, 610, 987, 1597, 2584, 4181,
];

const getMaxNumberInSumByLevel = (level: number) => fib[level] ?? fib[0];

const generateCoreSign = (): '+' | '*' => {
  const signsOrder = ['+', '*'] as const;
  const index = Math.floor(Math.random() * signsOrder.length);
  return signsOrder[index] ?? '+';
};

const generateCoreSum = (
  sign: '+' | '*',
  maxNumber: number,
): { firstOperand: number; secondOperand: number; result: number } => {
  let firstOperand = 0;
  let secondOperand = 0;
  let result = Number.MAX_SAFE_INTEGER;
  while (result > maxNumber) {
    firstOperand = Math.floor(Math.random() * (maxNumber - 1)) + 1;
    secondOperand = Math.floor(Math.random() * (maxNumber - 1)) + 1;
    result =
      sign === '+'
        ? firstOperand + secondOperand
        : firstOperand * secondOperand;
  }
  return { firstOperand, secondOperand, result };
};

const generateFinalSum = (
  sign: '+' | '*',
  operands: {
    firstOperand: number;
    secondOperand: number;
    result: number;
  },
): {
  firstOperand: number;
  secondOperand: number;
  result: number;
  sign: string;
} => {
  const shouldRevert = Boolean(Math.round(Math.random()));
  if (!shouldRevert) {
    return { sign, ...operands };
  }
  return {
    firstOperand: operands.result,
    secondOperand: operands.secondOperand,
    result: operands.firstOperand,
    sign: sign === '+' ? '-' : '/',
  };
};

const generateSum = (
  level: number,
): {
  firstOperand: number;
  secondOperand: number;
  result: number;
  sign: string;
} => {
  const maxNumber = getMaxNumberInSumByLevel(level);
  const sign = generateCoreSign();
  const operands = generateCoreSum(sign, maxNumber);
  return generateFinalSum(sign, operands);
};

// To promote the level, user needs to correctly resolve the sum within 2 seconds.
// To demote the level, user needs to fail OR spend more than 10 seconds on one sum.

type Props = {
  handleAddScore: (score: number) => void;
  level: number;
  setLevel: Dispatch<SetStateAction<number>>;
};

export const SumTrainer: React.FC<Props> = ({
  handleAddScore,
  level,
  setLevel,
}) => {
  const [userAttempt, setUserAttempt] = useState({
    value: '',
    timestamp: new Date(),
  });
  const [sumCreationTimestamp, setSumCreationTimestamp] = useState(new Date());
  const [currentSum, setCurrentSum] = useState(generateSum(level));

  const createNewSum = () => {
    setCurrentSum(generateSum(level));
    setSumCreationTimestamp(new Date());
  };

  useEffect(() => {
    let timerId = NaN;
    if (userAttempt.value) {
      timerId = setTimeout(() => {
        const isCorrect = Number(userAttempt.value) === currentSum.result;
        const userTime = differenceInMilliseconds(
          userAttempt.timestamp,
          sumCreationTimestamp,
        );
        if (isCorrect) {
          const shouldPromote = userTime < 2000;
          const shouldDemote = userTime > 10000;
          if (shouldPromote) {
            setLevel((prevLevel) => prevLevel + 1);
          }
          if (shouldDemote) {
            setLevel((prevLevel) => (prevLevel === 1 ? 1 : prevLevel - 1));
          }
          handleAddScore(
            Math.max(
              currentSum.firstOperand,
              currentSum.secondOperand,
              currentSum.result,
            ),
          );
          createNewSum();
        } else {
          setLevel((prevLevel) => (prevLevel === 1 ? 1 : prevLevel - 1));
        }
        setUserAttempt({ value: '', timestamp: new Date() });
      }, 500);
    }

    return () => clearTimeout(timerId);
  }, [userAttempt]);

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      sx={{
        mt: 4,
        animation: 'slideUp 0.3s ease-out',
        '@keyframes slideUp': {
          '0%': { transform: 'translateY(20px)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 },
        },
      }}
    >
      <Box
        display="flex"
        alignItems="center"
        gap={3}
        sx={{
          p: 4,
          borderRadius: 3,
          background: 'linear-gradient(135deg, #f6f8fb 0%, #e9ecef 100%)',
          boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: -2,
            left: -2,
            right: -2,
            bottom: -2,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: 3,
            zIndex: -1,
            opacity: 0.8,
          },
        }}
      >
        <Typography 
          variant="h2" 
          sx={{ 
            fontWeight: 700,
            color: '#2d3436',
            minWidth: '80px',
            textAlign: 'center',
            textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
          }}
        >
          {currentSum.firstOperand}
        </Typography>
        
        <Typography 
          variant="h2" 
          sx={{ 
            fontWeight: 600,
            color: '#667eea',
            minWidth: '50px',
            textAlign: 'center',
          }}
        >
          {currentSum.sign}
        </Typography>
        
        <Typography 
          variant="h2" 
          sx={{ 
            fontWeight: 700,
            color: '#2d3436',
            minWidth: '80px',
            textAlign: 'center',
            textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
          }}
        >
          {currentSum.secondOperand}
        </Typography>
        
        <Typography 
          variant="h2" 
          sx={{ 
            fontWeight: 600,
            color: '#667eea',
            mx: 1,
          }}
        >
          =
        </Typography>
        
        <Box>
          <TextField
            autoFocus
            autoComplete="off"
            type="number"
            onChange={(e) =>
              setUserAttempt({ value: e.target.value, timestamp: new Date() })
            }
            value={userAttempt.value}
            sx={{
              width: '140px',
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                background: 'white',
                '&:hover fieldset': {
                  borderColor: '#667eea',
                  borderWidth: '2px',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#667eea',
                  borderWidth: '2px',
                },
                '& fieldset': {
                  borderWidth: '2px',
                },
              },
              '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button':
                {
                  display: 'none',
                },
              '& input[type=number]': {
                MozAppearance: 'textfield',
                fontSize: '36px',
                fontWeight: 700,
                textAlign: 'center',
                padding: '12px',
                color: '#2d3436',
              },
            }}
          />
        </Box>
      </Box>
    </Box>
  );
};
