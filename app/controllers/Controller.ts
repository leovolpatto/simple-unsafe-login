import express from 'express';
import { Context } from "../Context";
import { Usuario } from '../models';

export interface AuthRequest extends express.Request{
    _usuario: Usuario;    
}

export abstract class Controller{

    public constructor(public context: Context) {

    }

    protected handleError(e, res: express.Response){
        if(e.name == 'EntityNotFound' || e.name == 'ObjectNotFoundError'){
            res.statusCode = 404;
            res.json(e)
            return;
        }

        res.statusCode = 400;
        res.json(e);
    }

}