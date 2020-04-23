import Addresser from "../types/addresser";
import * as utils from "../utils";

export async function createAddresser(body: any, userId: string, passphrase: string, callbackUrl: string, app: any):
    Promise<object> {
    const addresser = Object.assign({}, {app: app}, {accountName: body.accountName},
        {userId: userId});
    const result = await Addresser.create(addresser);

    const callback = callbackUrl + "?internalId=" + result._id;
    const subscribtion = {
        id: app.id, callback: callback,
        accountName: addresser.accountName, requestedInfos: []
    };

    return utils.encryptVerify(subscribtion, passphrase, app.privateKey);
}