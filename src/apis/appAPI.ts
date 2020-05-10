const request = require('request');

export function register(requestObject: object, url: string, serviceProvider: object): Promise<object>{
    return new Promise((resolve, reject) => {
        request.post(url, {json: requestObject}, (error, res, body) => {
            if (error) {
                console.log(error);
                throw new Error("Request to lead to error");
            }
            console.log(`statusCode: ${res.statusCode}`);
            if (body.status === 'success'){
                Object.assign(serviceProvider, requestObject, {id: body.id});
                resolve(serviceProvider);
            } else {
                resolve(null);
            }
        });
    });
}

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