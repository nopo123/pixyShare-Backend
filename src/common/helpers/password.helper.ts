import {
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import * as argon2 from 'argon2';

// Password validation function
function validatePassword(password: string): boolean {
  const minLength = 6;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);

  if (password.length < minLength) {
    throw new BadRequestException(
      'Password must be at least 6 characters long',
    );
  }
  if (!hasUpperCase) {
    throw new BadRequestException(
      'Password must contain at least one uppercase letter',
    );
  }
  if (!hasLowerCase) {
    throw new BadRequestException(
      'Password must contain at least one lowercase letter',
    );
  }
  if (!hasNumbers) {
    throw new BadRequestException('Password must contain at least one number');
  }

  return true;
}

export async function passwordHash(password: string): Promise<string> {
  // Validate password before hashing
  validatePassword(password);

  try {
    // Argon2 options for increased security
    const options = {
      type: argon2.argon2id, // Use argon2id variant (recommended)
      memoryCost: 2 ** 16, // 64 MiB memory usage
      timeCost: 25, // Number of iterations
      parallelism: 1, // Degree of parallelism
      hashLength: 32, // Output hash length in bytes
    };

    const hash = await argon2.hash(password, options);
    return hash;
  } catch (err) {
    throw new InternalServerErrorException('Error hashing password');
  }
}

export async function verifyPassword(
  hash: string,
  password: string,
): Promise<boolean> {
  try {
    return await argon2.verify(hash, password);
  } catch (err) {
    throw new InternalServerErrorException('Error verifying password');
  }
}
