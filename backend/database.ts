import { Client } from 'pg';
console.log("conexão");

export const client : Client = new Client(
    {
       user: "postgres",
       password: "postgres",
       host: "localhost",
       port: 5432,
       database: "restaurant_app"
    }
);

client.connect();

export async function dbQuery(sql:string, values?:any[])
{
    let resultado = await client.query(sql, values);

    return resultado;
}