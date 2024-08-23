import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Box, TextField, Typography } from '@mui/material';
import { differenceInMilliseconds } from 'date-fns';

const fib = [3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377, 610, 987, 1597];

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
      mt={3}
      display="flex"
      width="300px"
      justifyContent="space-between"
      height="50px"
      alignItems="center"
    >
      <Typography variant="h3">{currentSum.firstOperand}</Typography>
      <Typography variant="h3">{currentSum.sign}</Typography>
      <Typography variant="h3">{currentSum.secondOperand}</Typography>
      <Typography variant="h3">=</Typography>
      <Box width="100px">
        <TextField
          fullWidth
          autoFocus
          autoComplete="off"
          type="number"
          onChange={(e) =>
            setUserAttempt({ value: e.target.value, timestamp: new Date() })
          }
          value={userAttempt.value}
          sx={{
            '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button':
              {
                display: 'none',
              },
            '& input[type=number]': {
              MozAppearance: 'textfield',
              fontSize: '30px',
              textAlign: 'center',
            },
          }}
        />
      </Box>
    </Box>
  );
};
