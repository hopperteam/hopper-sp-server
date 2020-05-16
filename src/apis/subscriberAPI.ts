import Subscriber from "../types/subscriber";
import * as utils from "../utils";

export async function createSubscriber(body: any, userId: string, passphrase: string, callbackUrl: string, app: any): Promise<string> {
    const subscriber = Object.assign({}, {app: app}, {accountName: body.accountName},
        {userId: userId});
    const result = await Subscriber.create(subscriber);

    const callback = callbackUrl + "?internalId=" + result._id + "&token=" + userId;
    const subscribtion = {
        id: app.id, callback: callback,
        accountName: subscriber.accountName, requestedInfos: []
    };

    return utils.encryptVerify(subscribtion, passphrase, app.privateKey);
}
