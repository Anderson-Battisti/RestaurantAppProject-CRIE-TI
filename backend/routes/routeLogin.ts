import { Router } from "express";
import { Request, Response, NextFunction } from "express";
import { client, dbQuery } from '../database'; 

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
    
            let sql = `select * from users where username = $1 and password = crypt($2, password) and active = true;`
            let result = await dbQuery(sql, [username, password]);
    
            if (result.rows.length > 0)
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