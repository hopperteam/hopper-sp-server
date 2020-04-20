import * as express from 'express';
import Handler from './handler';
import User from '../types/user'

export default class UserHandler extends Handler {

    constructor() {
        super();
        this.router.get("/", this.getAll.bind(this));
    }

    private async getAll(req: express.Request, res: express.Response): Promise<void> {
        try {
            const users = await User.getAll();
            res.json(users);
        } catch (e) {
            console.log(e)
        }
    }
}