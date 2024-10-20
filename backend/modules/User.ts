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
}