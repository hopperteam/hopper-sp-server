const request = require('request');

export async function sendNotification(notification: object, url: string, subscriptionId: string): Promise<string>{
    return new Promise((resolve, reject) => {
        request.post(url, {json:{subscriptionId: subscriptionId, notification:notification}}, (error, res, body) => {
            if (error) {
                console.error(error)
                throw new Error("Request to lead to error");
            }
            console.log(`statusCode: ${res.statusCode}`);
            if (body.status === 'success'){
                resolve(body.id);
            } else {
                resolve(null);
            }
        });
    });
}