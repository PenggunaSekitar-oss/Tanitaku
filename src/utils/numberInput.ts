export interface ParsedNumberInput {
  displayValue: string;
  value: number | null;
}
/**
 * Parses positive numbers typed with Indonesian or international separators.
 * The last comma/dot is treated as the decimal separator; earlier separators
 * are treated as grouping separators.
 */
export function parseLocalizedNumberInput(rawInput: string, allowDecimals: boolean): ParsedNumberInput {
  const raw = rawInput.trim();
  if (!raw) return { displayValue: '', value: null };

  if (!allowDecimals) {
    const digits = raw.replace(/\D/g, '');
    if (!digits) return { displayValue: '', value: null };

    const value = Number.parseInt(digits, 10);
    return {
      displayValue: new Intl.NumberFormat('id-ID').format(value),
      value,
    };
  }

  const sanitized = raw.replace(/[^0-9.,]/g, '');
  if (!sanitized) return { displayValue: '', value: null };

  const lastComma = sanitized.lastIndexOf(',');
  const lastDot = sanitized.lastIndexOf('.');
  const separatorIndex = Math.max(lastComma, lastDot);

  if (separatorIndex < 0) {
    const digits = sanitized.replace(/\D/g, '');
    return {
      displayValue: digits,
      value: digits ? Number.parseFloat(digits) : null,
    };
  }

  const integerDigits = sanitized.slice(0, separatorIndex).replace(/\D/g, '') || '0';
  const fractionDigits = sanitized.slice(separatorIndex + 1).replace(/\D/g, '');
  const displayValue = `${integerDigits},${fractionDigits}`;
  const numericText = fractionDigits ? `${integerDigits}.${fractionDigits}` : integerDigits;

  return {
    displayValue,
    value: Number.parseFloat(numericText),
  };
}
