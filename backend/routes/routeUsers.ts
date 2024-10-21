import { Router } from "express";
import { Request, Response } from "express";
import { User } from "../modules/User";

export const routeUsers = Router();

routeUsers.get("/getUsersList", async function(req: Request, res: Response): Promise<Response>
{
    let databaseRows = await User.getUsersList();

    if (databaseRows.data)
    {
        return res.status(200).json({success: true, databaseRows});
    }
    else if ("message" in databaseRows)
    {
        return res.status(404).json({success: false, message: "Erro. Não há usuários cadastrados"});
    }
    else
    {
        return res.status(500).json({success: false, message: "Internal server error: Ocorreu um erro ao processar requisição no banco de dados"});
    }
});

routeUsers.get("/getUserById/:id", async (req: Request, res: Response): Promise<Response> =>
{
    let id = Number(req.params.id);
    let databaseRows = await User.getUserById(id);

    if (databaseRows.data)
    {
        return res.status(200).json({success: true, databaseRows});
    }
    else
    {
        return res.status(400).json({success: false, message: "Não foram encontrados usuários com esse ID."});
    }
});

routeUsers.post("/createUser", async (req: Request, res: Response): Promise<Response> =>
{
    let user = new User();
    user.login = req.body.username;
    user.password = req.body.password;

    let createUserReturn = await user.createUser();
    
    if (createUserReturn.success)
    {
        return res.status(200).json({success: true, message: "Usuário criado com sucesso."});
    }
    else
    {
        return res.status(500).json({success: false, message: "Erro interno. Não foi possível conectar ou inserir dados no banco de dados"});
    }
});

routeUsers.put("/updateUser", async (req: Request, res: Response): Promise<Response> =>
{
    let user = new User();
    user.login = req.body.username;
    user.password = req.body.password;
    let id = req.body.id;
    
    let updateUserReturn = await user.updateUser(id);

    if (updateUserReturn.success)
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
    let id = Number(req.body.id);

    if (id)
    {
        let deleteUserReturn = await User.deleteUser(id);

        if (deleteUserReturn.success)
        {
            return res.status(200).json({success: true, message: "Usuário deletado com sucesso!"});
        }
        else if ("message" in deleteUserReturn)
        {
            return res.status(404).json({success: false, message: "Ocorreu um erro ao excluir. Usuário não encontrado no banco de dados."});
        }
        else
        {
            return res.status(500).json({success: false, message: "Ocorreu um erro ao tentar buscar dados no banco de dados. Internal server error"});
        }
    }
    else
    {
        return res.status(400).json({success: false, error: "Não foi possível processar a exclusão. O parâmetro Id está faltando na requisição!"});
    }
});

