import Handler from "./handler";
import * as express from 'express';
import App from "../types/app";
import * as utils from "../utils";
import * as appService from "../services/appService";
const request = require('request');

export default class AppHandler extends Handler {

    private passphrase: string;
    private baseUrl: string;
    private spRequestUrl: string;

    constructor() {
        super();
        this.getRouter().get("/apps", this.getAll.bind(this));
        this.getRouter().post("/app", this.create.bind(this));
        this.getRouter().put("/app", this.update.bind(this));

        this.passphrase = "0adf5AD11A23adfAD524f8DFA9495sa7AD3DF6543";
        this.baseUrl = "http://localhost";
        this.spRequestUrl = "https://api-dev.hoppercloud.net/v1/app";
    }

    private async getAll(req: express.Request, res: express.Response): Promise<void> {
        try {
            const apps = await App.find({userId: req.query.token});
            res.json(apps);
        } catch (e) {
            utils.handleError(e, res);
        }
    }

    private async create(req: express.Request, res: express. Response): Promise<void> {
        try {
            const app = await appService.createApp(req.body, req.query.token.toString(),
                this.passphrase, this.baseUrl, this.spRequestUrl);
            if(app == null)
                throw new Error("Request to hopper server was not successful");
            const result = await App.create(app);
            res.json({
                "status": "success",
                "appId": result.id
            });
        } catch (e) {
            utils.handleError(e, res);
        }
    }

    private async update(req: express.Request, res: express. Response): Promise<void> {
        try {
            const app = await App.findOne({id: req.body.id, userId: req.query.token});
            if (!app)
                throw new Error("Could not find app");
            const privatKeyBefore = app.privateKey;
            const update = appService.updateApp(app, req.body, this.passphrase);
            const strippedApp = Object.assign({}, {
                name: update.name, imageUrl: update.imageUrl,
                isHidden: update.isHidden, manageUrl: update.manageUrl,
                contactEmail: update.contactEmail, cert: update.cert
            });

            const requestObject = utils.encryptVerify(strippedApp, this.passphrase, privatKeyBefore);
            const status = await appService.updateRequest(this.spRequestUrl, app.id, requestObject);
            if(status){
                await app.updateOne(update);
                res.json({
                    "status": "success",
                    "appId": app.id
                });
            } else{
                throw new Error("Request to hopper server was not successful");
            }
        } catch (e) {
            utils.handleError(e, res);
        }
    }
}