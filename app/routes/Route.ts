import express from 'express';
import { Context } from '../Context';
import { Controller } from '../controllers';

export enum RouteType{
    GET,
    POST,
    PUT,
    DELETE,
    PATCH
}

export abstract class Route{

    public constructor(protected context: Context){
        this.setRoutes();
    }

    protected async handle(handler: any, req: express.Request, res: express.Response){        
        return handler(req, res).catch((err) => {
            console.error(err);
            res.sendStatus(500);
        });
    }

    protected addRoute(type: RouteType, path: string, controllerHandler: any){
        this.context.express.get(path, async (req: express.Request, res: express.Response) => {
            return this.handle(controllerHandler, req, res);
        });
    }

    protected addRouteWithAuth(type: RouteType, path: string, controllerInstance: Controller, controllerHandler: any){
        this.context.express.get(path, async (req: express.Request, res: express.Response) => {
            return this.handle(controllerHandler, req, res);
        });
    }    

    protected abstract setRoutes();
}