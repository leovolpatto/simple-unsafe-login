import { Route } from "./Route";
import express from 'express';
import { AuthController } from "../controllers";

export class AuthRoutes extends Route{

    protected setRoutes() {
        const controller = new AuthController(this.context);

        this.context.express.post('/api/login', async (req: express.Request, res: express.Response) => {
            return controller.login(req, res).catch((err) => {
                console.error(err);
                res.sendStatus(500);
            });
        });

        this.context.express.post('/api/user', async (req: express.Request, res: express.Response) => {
            return controller.createAccount(req, res).catch((err) => {
                console.error(err);
                res.sendStatus(500);
            });
        });        
    }
}