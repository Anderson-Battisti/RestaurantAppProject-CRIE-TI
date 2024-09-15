import { User } from "./classes/User";
import { PaymentMethod } from "./classes/PaymentMethod";
import express, {Express, Request, Response} from "express";
import cors from "cors";
import { client, dbQuery } from "./database";

let server: Express = express();
const serverPort = 4000;

server.use(cors());
server.use(express.json());

server.post("/checkLogin", async function(req: Request, res: Response): Promise<Response> //Login API
{
    let user = new User ();
    user.login = req.body.login.trim();
    user.password = req.body.password.trim();

    let sql = `select * from users where username = $1 and password = crypt($2, password);`;
    let result = await dbQuery(sql, [user.login, user.password]);
    
    if (result.rows.length > 0)
    {
        return res.status(200).json({success: true, message: "Usuário e senha batem. Login efetuado com sucesso!"});
    }
    else
    {
        return res.status(401).json({success: false, message: "Usuário ou senha incorretos. Falha ao efetuar login"});
    }   
});

server.get("/getPaymentMethodsList", async function(req: Request, res: Response): Promise<Response> //PaymentAPI
{
    let sql = "select * from payment_methods;"
    let result = await dbQuery(sql);

    if (result.rows.length > 0)
    {
        return res.status(200).json(result.rows);
    }
    else
    {
        return res.status(400).json({success: false, message: "Não há métodos cadastrados"});
    }
});

server.get("/getPaymentMethodById/:id", async function(req: Request, res: Response): Promise<Response> //PaymentAPI
{
    let id = req.params.id;
    let sql = "select * from payment_methods where id = $1;"
    let result = await dbQuery(sql, [id]);

    if (result.rows.length > 0)
    {
        return res.status(200).json(result.rows);
    }
    else
    {
        return res.status(400).json({success: false, message: "Não foram encontrados métodos de pagamento com esse ID."});
    }
});

server.post("/addPaymentMethod", async function(req: Request, res: Response): Promise<Response>
{
    let paymentMethod = new PaymentMethod();
    paymentMethod.name = req.body.name.trim();
    paymentMethod.method = req.body.method.trim();
    paymentMethod.type = req.body.type.trim();

    if (validRequisition(paymentMethod))
    {
        let sql = `insert into payment_methods (name, method, type) values ($1, $2, $3);`   
        let result = await dbQuery(sql, [paymentMethod.name, paymentMethod.method, paymentMethod.type]);
        return res.status(200).json(paymentMethod);          
    }
    else
    {
        return res.status(400).json({success: false, message: "Não foi possível adicionar método, preencha todos os campos solicitados"});
    }   
});

server.put("/editPaymentMethod", async function (req: Request, res: Response): Promise<Response>
{
    let paymentMethod = new PaymentMethod();
    let id = req.body.id;
    paymentMethod.name = req.body.name;
    paymentMethod.method = req.body.method;
    paymentMethod.type = req.body.type;

    if (validRequisition(paymentMethod))
    {
        let sql = `update payment_methods set name = $1, method = $2, type = $3 where id = $4;`
        let result = dbQuery(sql, [paymentMethod.name, paymentMethod.method, paymentMethod.type, id]);
        return res.status(200).json({success: true, message: "Método alterado com sucesso!"});
    }
    else
    {
        return res.status(400).json({success: false, message: "Falha ao alterar método. Preencha todos os campos."});
    }  
});

server.delete("/deletePaymentMethod/:id", async function(req: Request, res: Response): Promise<Response>
{
    let id = Number(req.params.id);
    let sql = `delete from payment_methods where id = $1;`
    let result = await dbQuery(sql, [id]);

    if (result.rowCount != null)
    {
        return res.status(200).json({id: id, success: true, message: "Sucesso ao excluir método de pagamento."});
    }
    else
    {
        return res.status(404).json({"codigo": id, success: false, "message": "Ocorreu um erro ao excluir. Método de pagamento não encontrado."});
    }
});

function validRequisition(paymentMethod:PaymentMethod)
{
    if (paymentMethod.name != null && paymentMethod.name != undefined && paymentMethod.name != "" &&
        paymentMethod.method != null && paymentMethod.method != undefined && paymentMethod.method != "" &&
        paymentMethod.type != null && paymentMethod.type != undefined && paymentMethod.type != "")
    {
        return true;
    }
    else
    {
        return false;
    }
}

server.listen(serverPort, () =>
{
    console.log("Server started on port " + serverPort);
});
