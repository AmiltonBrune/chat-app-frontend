import { createDecipheriv } from 'crypto';

export const decryptPassword = async (encryptedText: any): Promise<string> => {
   const decipher = createDecipheriv('aes-256-cbc', process.env.KEY_HASH, process.env.IV_HASH);
   const decrypted = decipher.update(encryptedText, 'base64', 'utf8');
   return (decrypted + decipher.final('utf8'));
}