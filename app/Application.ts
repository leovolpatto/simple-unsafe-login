import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import { createServer } from 'http';
import compression from 'compression';
import { Context } from './Context';
import { json, urlencoded } from 'body-parser';
import path from 'path';
import {createConnection, Connection} from "typeorm";
import { AuthRoutes } from './routes/AuthRoutes';
import { AuthService } from './services';

interface IDbConfigs{    
    DB_TYPE: string;
    DB_HOST: string;
    DB_PORT: number;
    DB_USERNAME: string;
    DB_PASSWORD: string;
    DB_DATABASE_NAME: string;
    DB_TYPEORM_TRACE:boolean;
    DB_TYPEORM_LOGGING:boolean;
    DB_TYPEORM_SYNCRONIZE: boolean;
}
export class Application {

    private express: express.Express;
    private context: Context;
    private dbConnection: Connection;

    public static _Instance: Application;

    public get Context(): Context{
        return this.context;
    }

    public constructor(){
        Application._Instance = this;
        this.loadConfig();
    }

    private checkConfigFile(): boolean {
        if (!process.env.DB_HOST || !process.env.DB_DATABASE_NAME || !process.env.DB_PASSWORD) {
            return false;
        }

        return true;
    }

    private loadConfig(){
        dotenv.config({
            debug: false
        });

        if(this.checkConfigFile()){
            return;
        }

        dotenv.config({
            debug: false,
            path: "../"
        });

        if(this.checkConfigFile()){
            throw new Error("Arquivo de configuração sem configs de DB");
        }        
    }

    private async setDataBaseConnection(){
        const envConfigs: IDbConfigs = (process.env as unknown) as IDbConfigs;

        this.dbConnection = await createConnection({
            type: 'mysql',
            host: envConfigs.DB_HOST,
            port: envConfigs.DB_PORT,
            username: envConfigs.DB_USERNAME,
            password: envConfigs.DB_PASSWORD,
            database: envConfigs.DB_DATABASE_NAME,
            trace: envConfigs.DB_TYPEORM_TRACE as boolean,
            logging: envConfigs.DB_TYPEORM_LOGGING as boolean,
            synchronize: envConfigs.DB_TYPEORM_SYNCRONIZE,
            entities:[
                path.join(__dirname, 'models', '*'),
            ]
        });
    }

    private setRoutes() {
        this.express.get('/', function (req: express.Request, res: express.Response) {
            res.send("Api is running...");
        });

        new AuthRoutes(this.context);
    }

    private addErrorHandler(){
        this.express.use(function(err, req, res, next) {
            console.error(err);
            res.status(500).send(err.message);
          });
    }

    public async start() {
        dotenv.config();
        this.express = express();

        this.express.use(cors());

        this.express.use(urlencoded({ limit: '100kb', extended: true }));
        this.express.use(json({ limit: '100kb' }));
        this.express.use(compression());
        this.addErrorHandler();

        await this.setDataBaseConnection();        

        const authService = new AuthService(this.dbConnection);
        this.context = new Context(this.express, this.dbConnection, authService);
        
        this.setRoutes();
        
        const PORT = process.env.API_URL_LISTENING_PORT || 4443;

        this.express.listen(PORT, () => {
            console.log(`Backend rodando em http://127.0.0.1:${PORT}/`);
        });
    }
}