import express from 'express';
import {createConnection, Connection} from "typeorm";
import { AuthService } from './services';

export class Context{
    
    public constructor(public express: express.Express, public dbConnection: Connection, public authService: AuthService){
        
    }

    public isProduction() : boolean{
        return process.env.ENVIRONMENT == 'production';
    }

}