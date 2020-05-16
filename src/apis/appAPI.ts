const request = require('request');

export function register(requestObject: object, url: string, serviceProvider: object): Promise<any>{
    return new Promise((resolve, reject) => {
        request.post(url, {json: requestObject}, (error, res, body) => {
            if (error) {
                console.log(error);
                throw new Error("Request lead to error");
            }
            console.log(`statusCode: ${res.statusCode}`);
            if (body.status === 'success'){
                Object.assign(serviceProvider, requestObject, {id: body.id});
                resolve({status: "success", message: serviceProvider});
            } else {
                resolve({status: "error", message: body.reason});
            }
        });
    });
}

export function updateRequest(url: string, id: string, requestStr: string): Promise<string> {
    return new Promise((resolve, reject) => {
        request.put(url, {json: {id: id, content: requestStr}},
            (error, res, body) => {
            if (error) {
                console.log(error);
                throw new Error("Request lead to error");
            }
            console.log(`statusCode: ${res.statusCode}`);
            if (body.status === 'success'){
                resolve("success");
            } else {
                resolve(body.reason);
            }
        });
    });
}
