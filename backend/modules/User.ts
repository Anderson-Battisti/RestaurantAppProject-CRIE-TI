import { dbQuery } from "../database";

export class User
{
    login : string = "";
    password : string = "";
    active: boolean = true;

    static async authenticate(username: string, password: string): Promise<boolean>
    {
        let sql = `select * from users where username = $1 and password = crypt($2, password) and active = true;`
        let result = await dbQuery(sql, [username, password]);

        if (result.rows.length > 0)
        {
            return true;
        }
        else
        {
            return false;     
        }
    }

    static async getUsersList()
    {
        let sql = `select id, username, active from users order by id;`;

        try
        {
            let result = await dbQuery(sql);

            if (result.rows.length > 0)
            {
                return {success: true, data: result.rows};
            }
            else
            {
                return {success: false, message: "Não há unidades de medida cadastradas."};
            }
        }
        catch (error)
        {
            return {success: false, error: (error as Error).message};
        }  
    }

    static async getUserById(id: number)
    {
        let sql = "select * from users where id = $1;";

        try
        {
            let result = await dbQuery(sql, [id]);

            if (result.rows.length > 0)
            {
                return {success: true, data: result.rows};
            }
            else
            {
                return {success: false, message: "Não foram encontrados usuários com esse ID."};
            }
        }
        catch (error)
        {
            return {success: false, error: (error as Error).message};
        }
    }

    async createUser()
    {
        let sql = `insert into users (username, password, active) values ($1, crypt($2, gen_salt('bf')), true) returning id`;
        
        try
        {
            let result = await dbQuery(sql, [this.login, this.password]);

            if (result.rows[0].id)
            {
                return {success: true};
            }
            else
            {
                return {success: false, message: "Internal server error. Não foi possível conectar ou inserir dados no banco de dados"};
            }
        }
        catch (error)
        {
            return {success: false, error: (error as Error).message};
        } 
    }

    async updateUser(id: number)
    {
        try
        {
            let sql = `update users set username = $1, password = crypt($2, gen_salt('bf')), active = true where id = $3 returning id`;
            let result = await dbQuery(sql, [this.login, this.password, id]);

            if (result.rows[0].id)
            {
                return {success: true, message: "Usuário atualizado com sucesso!"};
            }
            else
            {
                return {success: false, message: "Erro interno. Não foi possível conectar ou atualizar dados no banco de dados"};    
            }
        }
        catch (error)
        {
            return {success: false, error: (error as Error).message};
        }
    }

    static async deleteUser(id: number)
    {
        let sql = `delete from users where id = $1;`;

        try
        {
            let result = await dbQuery(sql, [id]);

            if (result.rowCount != null)
            {
                return {success: true, message: "Usuário deletado com sucesso!"};
            }
            else
            {
                return {success: false, message: "Ocorreu um erro ao excluir. Usuário não encontrado no banco de dados."};
            }
        }
        catch (error)
        {
            return {success: false, error: (error as Error).message};
        }
    }
}