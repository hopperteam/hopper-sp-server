import * as express from 'express';
import Handler from './handler';
import User from '../types/user';
import * as utils from '../utils';

export default class UserHandler extends Handler {

    constructor() {
        super();
        this.getRouter().post("/signUp", this.signUp.bind(this));
        this.getRouter().post("/signIn", this.signIn.bind(this));
    }

    private async signUp(req: express.Request, res: express. Response): Promise<void> {
        try {
            if (await User.findOne({ email: req.body.email }))
                throw new Error("Email is already in use");
            req.body.password = utils.hashPassword(req.body.password);
            const user = await User.create(req.body);
            res.json({
                "status": "success",
                "token": user._id
            });
        } catch (e) {
            utils.handleError(e, res);
        }
    }

    private async signIn(req: express.Request, res: express. Response): Promise<void> {
        try {
            const user = await User.findOne({ email: req.body.email, password: utils.hashPassword(req.body.password) });
            if (!user)
                throw new Error("Invalid login data");
            res.json({
                "status": "success",
                "token": user._id
            });
        } catch (e) {
            utils.handleError(e, res);
        }
    }
}