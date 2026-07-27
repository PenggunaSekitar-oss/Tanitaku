import React, { useState, useEffect } from 'react';

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
    let rawValue = e.target.value;
    
    if (rawValue === '') {
      setDisplayValue('');
      onNumberChange(0);
      return;
    }

    if (allowDecimals) {
      // allow numbers and comma
      rawValue = rawValue.replace(/[^0-9,]/g, '');
      setDisplayValue(rawValue);
      const floatVal = parseFloat(rawValue.replace(',', '.'));
      if (!isNaN(floatVal)) {
        onNumberChange(floatVal);
      }
    } else {
      rawValue = rawValue.replace(/\./g, '').replace(/[^0-9]/g, '');
      const num = parseInt(rawValue, 10);
      if (!isNaN(num)) {
        setDisplayValue(new Intl.NumberFormat('id-ID').format(num));
        onNumberChange(num);
      } else {
        setDisplayValue('');
        onNumberChange(0);
      }
    }
  };

  return (
    <input
      type="text"
      value={displayValue}
      onChange={handleChange}
      className={className}
      {...props}
    />
  );
}
