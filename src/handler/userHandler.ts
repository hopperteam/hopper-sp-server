import * as express from 'express';
import Handler from './handler';
import User from '../types/user'

export default class UserHandler extends Handler {

    constructor() {
        super();
        this.getRouter().get("/users", this.getAllUsers.bind(this));
        this.getRouter().get("/user", this.getUser.bind(this));
        this.getRouter().post("/user", this.createUser.bind(this));
    }

    private async getAllUsers(req: express.Request, res: express.Response): Promise<void> {
        User.find((err: any, user: any) => {
            if (err) {
                res.send("Error!");
            } else {
                res.send(user);
            }
        });
    }

    private async getUser(req: express.Request, res: express.Response): Promise<void> {
        User.findOne({ email: req.query.email}, (err: any, user: any) => {
            if (err) {
                res.send(err);
            } else {
                res.send(user);
            }
        });
    }

    private async createUser(req: express.Request, res: express.Response): Promise<void> {
        const user = new User(req.body);

        user.save((err: any) => {
            if (err) {
                res.send(err);
            } else {
                res.send(user);
            }
        });
    }
}