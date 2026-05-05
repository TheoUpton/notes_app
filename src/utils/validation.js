/** @param {string} email  */
export const isValidEmail = (email) => {
  return (email.length <= 255) && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};
/** @param {string} password  */
export const isValidPassword = (password) => {
  if (typeof password !== 'string') return false;
  if(password.length > 127) return false;
  if(/\s/.test(password)) return false; //no spaces
  if(!/[a-z]/.test(password)) return false; //no lowercase chars
  if(!/[A-Z]/.test(password)) return false; //no uppercase chars
  if(!/\d/.test(password)) return false; //no digits
  if(!/[^A-Za-z0-9]/.test(password)) return false; //no special characters
  return true;
};