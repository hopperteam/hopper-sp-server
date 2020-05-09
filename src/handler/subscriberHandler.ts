import Handler from "./handler";
import * as express from "express";
import * as utils from "../utils";
import Subscriber from "../types/subscriber";
import App from "../types/app";
const querystring = require('querystring');
import * as subscriberAPI from "../apis/subscriberAPI";
import {Config} from "../config";

export default class SubscriberHandler extends Handler {

    constructor() {
        super();
        this.getRouter().get("/subscribers", this.getAll.bind(this));
        this.getRouter().post("/subscriber", this.create.bind(this));
        this.getRouter().put("/subscriber", this.approve.bind(this));
    }

    private async getAll(req: express.Request, res: express.Response): Promise<void> {
        try {
            const subscriber = await Subscriber.find({userId: req.query.token}).populate('app');
            res.json(subscriber);
        } catch (e) {
            utils.handleError(e, res);
        }
    }

    private async create(req: express.Request, res: express. Response): Promise<void> {
        try {
            const app = await App.findOne({id: req.body.appId, userId: req.query.token});
            if (!app)
                throw new Error("Could not find app");
            const subscriptionRequest = await subscriberAPI.createSubscriber(req.body, req.query.token.toString(),
                Config.instance.passphrase, Config.instance.callbackUrl, app);

            const query = querystring.stringify({
                "id": app.id,
                "content": Buffer.from(JSON.stringify(subscriptionRequest)).toString('base64')
            });
            res.json({
                "status": "success",
                "redirect": Config.instance.redirectUrl + "?" + query
            });

        } catch (e) {
            utils.handleError(e, res);
        }
    }

    private async approve(req: express.Request, res: express. Response): Promise<void> {
        try {
            const subscriber = await Subscriber.findOne({_id: req.body.systemId, userId: req.query.token});
            if(!subscriber)
                throw new Error("Could not find subscriber");
            subscriber.id = req.body.id;
            await subscriber.updateOne(subscriber);
            res.json({
                "status": "success",
                "appId": subscriber.id
            });
        } catch (e) {
            utils.handleError(e, res);
        }
    }
}