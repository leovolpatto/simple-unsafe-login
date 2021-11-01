import { Connection, Repository } from "typeorm";
import * as jwt from 'jsonwebtoken';
import { Usuario } from "../models";

export class AuthService {

    private usuarioRepository: Repository<Usuario>;

    public constructor(private dbCon: Connection) {
        this.usuarioRepository = this.dbCon.getRepository(Usuario);
    }

    public async getAuthUser(userName: string): Promise<Usuario> {
        const u = await this.usuarioRepository.findOne({
            where: {
                userName: userName
            }
        });

        return u;
    }

    public async createUser(userName: string, pass: string): Promise<Usuario> {
        const user = await this.getAuthUser(userName);
        if (user != null) {
            throw Error("Usuario ja cadastrado");
        }

        if (!userName || !pass) {
            throw Error("Dados invalidos");
        }

        const usuario = new Usuario();
        usuario.password = pass;
        usuario.userName = userName;
        const res = await this.usuarioRepository.save(usuario);
        return res;
    }    

    public async login(userName: string, pass: string): Promise<Usuario> {
        const user = await this.getAuthUser(userName);
        if (!user) {
            return null;
        }

        if (user.password != pass) {
            throw Error("Usuario/senha invalidos"); 
        }

        const dbUser = {
            id: user.id
        };

        const secret = process.env.JWT_USER_TOKEN;
        const token = jwt.sign(dbUser, secret, {
            expiresIn: 999999999//300 //5min
        });

        (user as any).jwtToken = token;

        return user;
    }
}