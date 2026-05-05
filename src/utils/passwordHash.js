import bcrypt from 'bcrypt';
const SALT_ROUNDS = Number(process.env.SALT_ROUNDS) || 12;

export async function hashPassword(plain) {
  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  return bcrypt.hash(plain, salt);
}

export async function verifyPassword(plain, hash) {
  return bcrypt.compare(plain, hash);
}