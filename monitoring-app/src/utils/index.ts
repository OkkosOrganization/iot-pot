export const forceLoginRefresh = () => {
  window.location.reload();
};
export const isValidEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const zeroFill = (digit: number) => {
  if (digit < 10) return `0${digit}`;
  else return digit;
};
