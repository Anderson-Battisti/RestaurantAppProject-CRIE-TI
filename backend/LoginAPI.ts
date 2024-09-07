import {Login} from "./classes/Login";
import express, {Express, Request, Response} from "express";
import cors from "cors";
import { ExitStatus } from "typescript";

let server: Express = express();
const serverPort = 4000;

server.use(cors());
server.use(express.json());

let registeredUsers: Login[] = [];
registeredUsers[0] = {login : "admin", password : "admin"};

server.post("/checkLogin", async function(req: Request, res: Response): Promise<Response>
{
    let login = req.body.login;
    let password = req.body.password

    for (let i = 0; i < registeredUsers.length; i++)
    {
        let registeredLogin: Login = registeredUsers[i];

        if (login === registeredLogin.login && password === registeredLogin.password)
        {
            return res.status(200).json({success: true, message: "Usuário e senha batem. Login efetuado com sucesso!"});
        }
    }
    return res.status(401).json({success: false, message: "Usuário ou senha incorretos. Falha ao efetuar login"});
});

server.listen(serverPort, () =>
{
    console.log("Server started on port " + serverPort);
});
