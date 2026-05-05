/** @param {string} email  */
export const isValidEmail = (email) => {
  return (email.length <= 255) && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};