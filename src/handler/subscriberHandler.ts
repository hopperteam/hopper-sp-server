import Handler from "./handler";
import * as express from "express";
import * as utils from "../utils";
import Subscriber from "../types/subscriber";
import App from "../types/app";
const querystring = require('querystring');
import * as subscriberService from "../services/subscriberService";

export default class SubscriberHandler extends Handler {

    private callbackUrl: string;
    private passphrase: string;
    private redirectUrl: string;

    constructor() {
        super();
        this.getRouter().get("/subscribers", this.getAll.bind(this));
        this.getRouter().post("/subscriber", this.create.bind(this));
        this.getRouter().put("/subscriber", this.approve.bind(this));

        this.callbackUrl = utils.getEnv(process.env.CALLBACKURL, "CALLBACKURL");
        this.redirectUrl = utils.getEnv(process.env.REDIRECTURL, "REDIRECTURL");
        this.passphrase = utils.getEnv(process.env.PASSPHRASE, "PASSPHRASE");
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
            const subscriptionRequest = await subscriberService.createSubscriber(req.body, req.query.token.toString(),
                this.passphrase, this.callbackUrl, app);

            const query = querystring.stringify({
                "id": app.id,
                "content": Buffer.from(JSON.stringify(subscriptionRequest)).toString('base64')
            });
            res.json({
                "status": "success",
                "redirect": this.redirectUrl + "?" + query
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