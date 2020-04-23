import Handler from "./handler";
import * as express from "express";
import * as utils from "../utils";
import Addresser from "../types/addresser";
import App from "../types/app";
const querystring = require('querystring');
import * as addresserService from "../services/addresserService";

export default class AddresserHandler extends Handler {

    private callbackUrl: string;
    private passphrase: string;
    private redirectUrl: string;

    constructor() {
        super();
        this.getRouter().get("/addressers", this.getAll.bind(this));
        this.getRouter().post("/addresser", this.create.bind(this));
        this.getRouter().put("/addresser", this.approve.bind(this));

        this.callbackUrl = "http://localhost:3000";
        this.passphrase = "0adf5AD11A23adfAD524f8DFA9495sa7AD3DF6543";
        this.redirectUrl = "https://dev.hoppercloud.net/subscribe";
    }

    private async getAll(req: express.Request, res: express.Response): Promise<void> {
        try {
            const addresser = await Addresser.find({userId: req.query.token});
            res.json(addresser);
        } catch (e) {
            utils.handleError(e, res);
        }
    }

    private async create(req: express.Request, res: express. Response): Promise<void> {
        try {
            const app = await App.findOne({id: req.body.appId, userId: req.query.token});
            if (!app)
                throw new Error("Could not find app");
            const subscriptionRequest = await addresserService.createAddresser(req.body, req.query.token.toString(),
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
            const addresser = await Addresser.findOne({_id: req.body.systemId, userId: req.query.token});
            if(!addresser)
                throw new Error("Could not find addresser");
            addresser.id = req.body.id;
            await addresser.updateOne(addresser);
            res.json({
                "status": "success",
                "appId": addresser.id
            });
        } catch (e) {
            utils.handleError(e, res);
        }
    }
}