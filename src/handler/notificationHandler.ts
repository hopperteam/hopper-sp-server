import Handler from "./handler";
import * as express from "express";
import * as utils from "../utils";
import Notification from "../types/notification";
import Subscriber from "../types/subscriber";
import * as notificationService from "../services/notificationService";
import {Config} from "../config";

export default class NotificationHandler extends Handler {

    // private notificationUrl: string;

    constructor() {
        super();
        this.getRouter().get("/notifications", this.getAll.bind(this));
        this.getRouter().post("/notification", this.create.bind(this));

        // this.notificationUrl = utils.getEnv(process.env.NOTIFICATIONURL, "NOTIFICATIONURL");
    }

    private async getAll(req: express.Request, res: express.Response): Promise<void> {
        try {
            const notifications = await Notification.find({userId: req.query.token}).populate('subscriber');
            res.json(notifications);
        } catch (e) {
            utils.handleError(e, res);
        }
    }

    private async create(req: express.Request, res: express.Response): Promise<void> {
        try {
            const subscriber = await Subscriber.findOne({id: req.body.subscriberId, userId: req.query.token});
            if (!subscriber)
                throw new Error("Could not find subscriber");

            delete req.body.subscriberId;
            req.body.timestamp = Date.now();
            let notification = Object.assign({}, req.body, {actions: []});

            const result = await notificationService.sendNotification(notification, Config.instance.notificationUrl, subscriber.id);

            if(result == null)
                throw new Error("Request to hopper server was not successful");

            notification.id = result;
            notification.subscriber = subscriber;
            notification.userId = req.query.token;

            const save = await Notification.create(notification);

            res.json({
                "status": "success",
                "redirect": save.id
            });
        } catch (e) {
            utils.handleError(e, res);
        }
    }

}