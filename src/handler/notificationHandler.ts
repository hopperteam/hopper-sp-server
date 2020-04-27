import Handler from "./handler";
import * as express from "express";
import * as utils from "../utils";
import Notification from "../types/notification";
import Addresser from "../types/addresser";
import * as notificationService from "../services/notificationService";

export default class NotificationHandler extends Handler {

    private notificationUrl: string;

    constructor() {
        super();
        this.getRouter().get("/notifications", this.getAll.bind(this));
        this.getRouter().post("/notification", this.create.bind(this));

        this.notificationUrl = "https://api-dev.hoppercloud.net/v1/notification"
    }

    private async getAll(req: express.Request, res: express.Response): Promise<void> {
        try {
            const notifications = await Notification.find({userId: req.query.token}).populate('addresser');
            res.json(notifications);
        } catch (e) {
            utils.handleError(e, res);
        }
    }

    private async create(req: express.Request, res: express.Response): Promise<void> {
        try {
            const addresser = await Addresser.findOne({id: req.body.addresserId, userId: req.query.token});
            if (!addresser)
                throw new Error("Could not find addresser");

            delete req.body.addresserId;
            req.body.timestamp = Date.now();
            let notification = Object.assign({}, req.body, {actions: []});

            const result = await notificationService.sendNotification(notification, this.notificationUrl, addresser.id);

            if(result == null)
                throw new Error("Request to hopper server was not successful");

            notification.id = result;
            notification.addresser = addresser;
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