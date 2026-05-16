/**
 * Utility to format currency values for display.
 * @param amount - The numerical value to format.
 * @param currency - The currency code (default: 'USD').
 * @param locale - The locale for formatting (default: 'en-US').
 */
export const formatCurrency = (
  amount: number,
  currency: string = 'USD',
  locale: string = 'en-US'
): string => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(amount);
};

/**
 * Utility to calculate stay duration in nights.
 */
export const calculateNights = (checkIn: Date, checkOut: Date): number => {
  const diffTime = Math.abs(checkOut.getTime() - checkIn.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};
