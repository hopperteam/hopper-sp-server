const request = require('request');

export async function sendNotification(notification: object, url: string, subscriptionId: string): Promise<any>{
    return new Promise((resolve, reject) => {
        request.post(url, {json:{subscriptionId: subscriptionId, notification:notification}}, (error, res, body) => {
            if (error) {
                console.error(error)
                throw new Error("Request to lead to error");
            }
            console.log(`statusCode: ${res.statusCode}`);
            if (body.status === 'success'){
                resolve({status: "success", message: body.id});
            } else {
                resolve({status: "error", message: body.reason});
            }
        });
    });
}