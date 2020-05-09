import * as utils from '../utils';
const request = require('request');

// export async function createApp(body: object, userId: string,
//                                 passphrase: string, baseUrl: string, spRequestUrl: string): Promise<object> {
//     //create request object
//     let requestObject = body;
//     const {publicKey, privateKey} = utils.createRsaPair(passphrase);
//     const cert = Buffer.from(publicKey).toString('base64');
//     Object.assign(requestObject, {cert: cert, baseUrl: baseUrl});
//
//     //register sp at hopper server
//     let serviceProvider = Object.assign({},
//         {publicKey: publicKey, privateKey: privateKey, userId: userId});
//     return await register(requestObject, spRequestUrl, serviceProvider);
// }

export function register(requestObject: object, url: string, serviceProvider: object): Promise<object>{
    return new Promise((resolve, reject) => {
        request.post(url, {json: requestObject}, (error, res, body) => {
            if (error) {
                console.log(error);
                throw new Error("Request to lead to error");
            }
            console.log(`statusCode: ${res.statusCode}`)
            if (body.status === 'success'){
                Object.assign(serviceProvider, requestObject, {id: body.id});
                resolve(serviceProvider);
            } else {
                resolve(null);
            }
        });
    });
}

// export function updateApp(app: object, update: any, passphrase: string): any {
//     //update primative fields
//     Object.assign(app, {
//         name: update.name, imageUrl: update.imageUrl, isHidden: update.isHidden,
//         manageUrl: update.manageUrl, contactEmail: update.contactEmail
//     });
//
//     //ceck for new cert
//     if(update.newCert == true){
//         const {publicKey, privateKey} = utils.createRsaPair(passphrase);
//         const cert = Buffer.from(publicKey).toString('base64');
//         Object.assign(app, {publicKey: publicKey, privateKey: privateKey, cert: cert});
//     }
//
//     return app;
// }

export function updateRequest(url: string, id: string, requestObject: object): Promise<boolean> {
    return new Promise((resolve, reject) => {
        request.put(url, {json: {id: id, content: Buffer.from(JSON.stringify(requestObject)).toString('base64')}},
            (error, res, body) => {
            if (error) {
                console.log(error);
                throw new Error("Request lead to error");
            }
            console.log(`statusCode: ${res.statusCode}`);
            if (body.status === 'success'){
                resolve(true);
            } else {
                resolve(false);
            }
        });
    });
}