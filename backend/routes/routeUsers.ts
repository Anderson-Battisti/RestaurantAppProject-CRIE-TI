import { Router } from "express";
import { Request, Response } from "express";
import { dbQuery } from '../database'; 

export const routeUsers = Router();

routeUsers.get("/getUsersList", async function(req: Request, res: Response): Promise<Response>
{
    let sql = `select id, username, active from users order by id;`;
    let result = await dbQuery(sql);

    if (result.rows.length > 0)
    {
        return res.status(200).json(result.rows);
    }
    else
    {
        return res.status(400).json({success: false, message: "Erro. Não há usuários cadastrados"});
    }
});

routeUsers.get("/getUserById/:id", async (req: Request, res: Response): Promise<Response> =>
{
    let id = req.params.id;
    let sql = "select * from users where id = $1;"
    let result = await dbQuery(sql, [id]);

    if (result.rows.length > 0)
    {
        return res.status(200).json(result.rows);
    }
    else
    {
        return res.status(400).json({success: false, message: "Não foram encontrados usuários com esse ID."});
    }
});

routeUsers.post("/createUser", async (req: Request, res: Response): Promise<Response> =>
{
    let username = req.body.username;
    let password = req.body.password;

    let sql = `insert into users (username, password, active) values ($1, crypt($2, gen_salt('bf')), true) returning id`;
    let result = await dbQuery(sql, [username, password]);
    
    if (result.rows[0].id)
    {
        return res.status(200).json({success: true, message: "Usuário criado com sucesso."})
    }
    else
    {
        return res.status(500).json({success: false, message: "Erro interno. Não foi possível conectar ou inserir dados no banco de dados"});
    }
});

routeUsers.put("/updateUser", async (req: Request, res: Response): Promise<Response> =>
{
    let username = req.body.username;
    let password = req.body.password;
    let id = req.body.id;

    let sql = `update users set username = $1, password = crypt($2, gen_salt('bf')), active = true where id = $3 returning id`;
    let result = await dbQuery(sql, [username, password, id]);

    if (result.rows[0].id)
    {
        return res.status(200).json({success: true, message: "Usuário atualizado com sucesso!"});
    }
    else
    {
        return res.status(500).json({success: false, message: "Erro interno. Não foi possível conectar ou atualizar dados no banco de dados"});    
    }
});

routeUsers.delete("/deleteUser", async (req: Request, res: Response): Promise<Response> =>
{
    let id = req.body.id;
    let sql = `delete from users where id = $1;`;

    if (id)
    {
        try
        {
            let result = await dbQuery(sql, [id]);

            if (result.rowCount != null)
            {
                return res.status(200).json({success: true, message: "Usuário deletado com sucesso!"});
            }
            else
            {
                return res.status(404).json({success: false, message: "Ocorreu um erro ao excluir. Usuário não encontrado no banco de dados."});
            }
        }
        catch (error)
        {
            return res.status(500).json({success: false, message: "Ocorreu um erro ao tentar buscar dados no banco de dados. Internal server error"});
        }    
    }
    else
    {
        return res.status(400).json({success: false, error: "Não foi possível processar a exclusão. O parâmetro Id está faltando na requisição!"});
    }
});

