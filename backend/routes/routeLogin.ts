import { Router } from "express";
import { Request, Response, NextFunction } from "express";
import { client, dbQuery } from '../database'; 
import { User } from "../modules/User";

export const routeLogin = Router();

routeLogin.use(async (req: Request, res: Response, next: NextFunction) =>
    {
        let authorization = req.get("Authorization")?.replace("Basic ", "");
    
        if (authorization)
        {
            let decoded = Buffer.from(authorization, "base64").toString("utf8");
            let loginSplitted: string[] = decoded.split(":");
            let username = loginSplitted[0];
            let password = loginSplitted[1];
    
            let successfulAuthentication = await User.authenticate(username, password);
    
            if (successfulAuthentication)
            {
                next();
                return;
            }
            else
            {
                return res.status(401).json({"error": "Falha na autenticação! O banco de dados não retornou um usuário compatível com as credenciais enviadas."});     
            }
        }
        return res.status(401).json({"error": "Falha na autenticação! O servidor não recebeu a 'Authorization' corretamente."});
    });
    
    routeLogin.get("/checkLogin", async function(req: Request, res: Response): Promise<Response> //Login API
    {
        return res.status(200).json({success: true, message: "Usuário e senha batem. Login efetuado com sucesso!"});   
    });
