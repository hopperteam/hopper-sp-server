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

export function encryptVerify(toEncrypt: object, passphrase: string, privateKey: string): object{
    const sha = crypto.createHash('sha256');
    sha.update(JSON.stringify(toEncrypt));
    const hash = sha.digest('hex');
    const buffer = Buffer.from(hash);
    const encrypted = crypto.privateEncrypt(
        {
            key : privateKey,
            passphrase: passphrase
        },
        buffer);

    return {"verify":encrypted.toString('base64'), "data": toEncrypt};
}

export function getEnv(key: any, name: string): any{
    if(!key){
        console.log("Missing " + name + " in environment definition");
        process.exit();
    }

    return key;
}