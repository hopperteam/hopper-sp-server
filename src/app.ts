import express from 'express';
import UserHandler from "./handler/userHandler";
import mongoose = require("mongoose");
import bodyParser = require('body-parser');
import AppHandler from "./handler/appHandler";
import SubscriberHandler from "./handler/subscriberHandler";
import NotificationHandler from "./handler/notificationHandler";
import {Config} from "./config";

class SPServer {
    private readonly server: express.Application;

    constructor() {
        this.server = express();

        Config.loadConfig();

        this.server.use(bodyParser.json());
        this.server.set("query parser", "simple");

    }
    public async start(): Promise<void> {
        mongoose.connect(Config.instance.mongoUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false
        }, (err: any) => {
            if (err) {
                console.log(err.message);
            } else {
                console.log("Successfully Connected!");
            }
        });

        this.server.use(new UserHandler().getRouter());
        this.server.use(new AppHandler().getRouter());
        this.server.use(new SubscriberHandler().getRouter());
        this.server.use(new NotificationHandler().getRouter());

        this.server.listen(Config.instance.port, err => {
            if (err) {
                return console.error(err);
            }
            return console.log(`server is listening on ${Config.instance.port}`);
        });
    }
}

const app = new SPServer();
app.start();