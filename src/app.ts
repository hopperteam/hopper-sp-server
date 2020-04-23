import express from 'express';
import UserHandler from "./handler/userHandler";
import mongoose = require("mongoose");
import bodyParser = require('body-parser');
import AppHandler from "./handler/appHandler";
import AddresserHandler from "./handler/addresserHandler";
import NotificationHandler from "./handler/notificationHandler";

class SPTest {
    private readonly server: express.Application;
    private readonly port: number;
    private readonly mongoUri: string;

    constructor() {
        this.server = express();
        this.port = 3000;
        this.mongoUri = "mongodb://127.0.0.1:27017/local";
        this.server.use(bodyParser.json());
        this.server.set("query parser", "simple");

    }
    public async start(): Promise<void> {
        mongoose.connect(this.mongoUri, (err: any) => {
            if (err) {
                console.log(err.message);
            } else {
                console.log("Successfully Connected!");
            }
        });
        this.server.use(new UserHandler().getRouter());
        this.server.use(new AppHandler().getRouter());
        this.server.use(new AddresserHandler().getRouter());
        this.server.use(new NotificationHandler().getRouter());

        this.server.listen(this.port, err => {
            if (err) {
                return console.error(err);
            }
            return console.log(`server is listening on ${this.port}`);
        });
    }
}

const app = new SPTest();
app.start();