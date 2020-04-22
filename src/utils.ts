import * as express from 'express';
import * as crypto from 'crypto';

const SALT = "TL]{~eeo=u8J>j>@th8Psh4FQZ:^Wz)UMi;/vXst";

export function handleError(err: Error, res: express.Response, statusCode: number = 400) {
    console.log(err.message);
    res.status(statusCode);
    res.json({
        "status": "error",
        "reason": err.message
    });
}

export function hashPassword(password: string): string {
    const hash = crypto.createHash('sha256');
    hash.update(SALT);
    hash.update(password);
    return hash.digest('hex');
}

export function createRsaPair(passphrase: string): crypto.KeyPairSyncResult<string, string> {
    const { generateKeyPairSync } = crypto;
    return generateKeyPairSync('rsa', {
        modulusLength: 2048,
        publicKeyEncoding: {
            type: 'spki',
            format: 'pem'
        },
        privateKeyEncoding: {
            type: 'pkcs8',
            format: 'pem',
            cipher: 'aes-256-cbc',
            passphrase: passphrase
        }
    });
}