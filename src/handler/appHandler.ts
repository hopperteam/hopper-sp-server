import Handler from "./handler";
import * as express from 'express';
import App from "../types/app";
import * as utils from "../utils";
import * as appAPI from "../apis/appAPI";
import {Config} from "../config";

export default class AppHandler extends Handler {

    //private passphrase: string;
    //private baseUrl: string;
    //private spRequestUrl: string;

    constructor() {
        super();
        this.getRouter().get("/apps", this.getAll.bind(this));
        this.getRouter().post("/app", this.create.bind(this));
        this.getRouter().put("/app", this.update.bind(this));

        //this.passphrase = utils.getEnv(process.env.PASSPHRASE, "PASSPHRASE");
        //this.baseUrl = utils.getEnv(process.env.BASEURL, "BASEURL");
        //this.spRequestUrl = utils.getEnv(process.env.SPREQUESTURL, "SPREQUESTURL");
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
            const app = await this.createApp(req.body, req.query.token.toString(),
                Config.instance.passphrase, Config.instance.baseUrl, Config.instance.spRequestUrl);
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
            const update = this.updateApp(app, req.body, Config.instance.passphrase);
            const strippedApp = Object.assign({}, {
                name: update.name, imageUrl: update.imageUrl,
                isHidden: update.isHidden, manageUrl: update.manageUrl,
                contactEmail: update.contactEmail, cert: update.cert
            });

            const requestObject = utils.encryptVerify(strippedApp, Config.instance.passphrase, privatKeyBefore);
            const status = await appAPI.updateRequest(Config.instance.spRequestUrl, app.id, requestObject);
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

    private async createApp(body: object, userId: string,
                                    passphrase: string, baseUrl: string, spRequestUrl: string): Promise<object> {
        //create request object
        let requestObject = body;
        const {publicKey, privateKey} = utils.createRsaPair(passphrase);
        const cert = Buffer.from(publicKey).toString('base64');
        Object.assign(requestObject, {cert: cert, baseUrl: baseUrl});

        //register sp at hopper server
        let serviceProvider = Object.assign({},
            {publicKey: publicKey, privateKey: privateKey, userId: userId});
        return await appAPI.register(requestObject, spRequestUrl, serviceProvider);
    }

    private updateApp(app: object, update: any, passphrase: string): any {
        //update primative fields
        Object.assign(app, {
            name: update.name, imageUrl: update.imageUrl, isHidden: update.isHidden,
            manageUrl: update.manageUrl, contactEmail: update.contactEmail
        });

        //ceck for new cert
        if(update.newCert == true){
            const {publicKey, privateKey} = utils.createRsaPair(passphrase);
            const cert = Buffer.from(publicKey).toString('base64');
            Object.assign(app, {publicKey: publicKey, privateKey: privateKey, cert: cert});
        }

        return app;
    }
}