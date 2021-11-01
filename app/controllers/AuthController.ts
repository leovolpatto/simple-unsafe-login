import express from 'express';
import { Controller } from "./Controller";

export class AuthController extends Controller {

    public async login(req: express.Request, res: express.Response) {
        try {
            const usuario = await this.context.authService.login(req.body.userName, req.body.password);
            return res.json(usuario);
        }
        catch (e) {
            return res.status(404).json(e.message);
        }
    }

    public async createAccount(req: express.Request, res: express.Response) {
        try {
            const usuario = await this.context.authService.createUser(req.body.userName, req.body.password);
            return res.status(201).json(usuario);
        }
        catch (e) {
            return res.status(400).json(e.message);
        }
    }

}