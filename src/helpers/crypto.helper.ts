import bcrypt from 'bcryptjs';
import config from '../config/config';

const { SALT_ROUNDS } = config;


export const hashPassword = (password: string): string => {
    const salt = bcrypt.genSaltSync(+SALT_ROUNDS!);
    return bcrypt.hashSync(password, salt);
}

export const compare = (password: string, hash: string): boolean => bcrypt.compareSync(password, hash);

const hasLowercase = (password: string) => /.*[a-z].*/.test(password);
const hasUppercase = (password: string) => /.*[A-Z].*/.test(password);
const hasNumber = (password: string) => /.*[0-9].*/.test(password);
const hasSpecialCharacter = (password: string) => /[^a-zA-Z0-9]/.test(password);

export const validPassword = (password: string): boolean =>
    hasLowercase(password) && hasUppercase(password) && hasNumber(password) && hasSpecialCharacter(password);