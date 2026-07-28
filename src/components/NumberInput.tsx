import React, { useState, useEffect } from 'react';
import { parseLocalizedNumberInput } from '../utils/numberInput';

interface NumberInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'> {
  value: number;
  onNumberChange: (val: number) => void;
  allowDecimals?: boolean;
}

export function NumberInput({ value, onNumberChange, allowDecimals = false, className, ...props }: NumberInputProps) {
  const [displayValue, setDisplayValue] = useState('');

  useEffect(() => {
    if (value === 0) {
      setDisplayValue('');
    } else if (value) {
      if (allowDecimals) {
        setDisplayValue(value.toString().replace('.', ','));
      } else {
        setDisplayValue(new Intl.NumberFormat('id-ID').format(value));
      }
    } else {
      setDisplayValue('');
    }
  }, [value, allowDecimals]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const parsed = parseLocalizedNumberInput(e.target.value, allowDecimals);
    setDisplayValue(parsed.displayValue);
    onNumberChange(parsed.value ?? 0);
  };

  return (
    <input
      type="text"
      inputMode={allowDecimals ? 'decimal' : 'numeric'}
      value={displayValue}
      onChange={handleChange}
      className={className}
      {...props}
    />
  );
}
