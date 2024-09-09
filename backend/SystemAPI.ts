import { Login } from "./classes/Login";
import { PaymentMethod } from "./classes/PaymentMethod";
import express, {Express, Request, Response} from "express";
import cors from "cors";
import { ExitStatus, resolveModuleName } from "typescript";

let server: Express = express();
const serverPort = 4000;

server.use(cors());
server.use(express.json());

let registeredUsers: Login[] = [];
registeredUsers[0] = {login : "admin", password : "admin"};

let paymentMethods: PaymentMethod[] = [];
let contId: number = 1;

server.post("/checkLogin", async function(req: Request, res: Response): Promise<Response> //Login API
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

server.get("/getPaymentMethodsList", async function(req: Request, res: Response): Promise<Response> //PaymentAPI
{
    if (paymentMethods.length > 0)
    {
        return res.status(200).json(paymentMethods);
    }
    else
    {
        return res.status(400).json({success: false, message: "Não há métodos cadastrados"});
    }
});

server.post("/addPaymentMethod", async function(req: Request, res: Response): Promise<Response>
{
    let name = req.body.name;
    let method = req.body.method;
    let type = req.body.type;

    if (validRequisition(name, method, type))
    {
        let paymentMethod = new PaymentMethod();
        paymentMethod.id = contId++;
        paymentMethod.name = name;
        paymentMethod.method = method;
        paymentMethod.type = type;

        paymentMethods.push(paymentMethod);
        
        return res.status(200).json(paymentMethod);
    }
    else
    {
        return res.status(400).json({success: false, message: "Não foi possível adicionar método, preencha todos os campos solicitados"});
    }   
});

server.put("/editPaymentMethod", async function (req: Request, res: Response): Promise<Response>
{
    let id = req.body.id;
    let name = req.body.name;
    let method = req.body.method;
    let type = req.body.type;

    if (validRequisition(name, method, type))
    {
        console.log(validRequisition(name, method, type))
        paymentMethods[id].name = name;
        paymentMethods[id].method = method;
        paymentMethods[id].type = type;
        
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

    if (id >= 0 && id < paymentMethods.length)
    {
        let paymentMethod = paymentMethods[id]
        delete paymentMethods[id];
        return res.status(200).json(paymentMethod);
    }
    else
    {
        let erro = {"codigo": id, "message": "Ocorreu um erro ao excluir. Método de pagamento não encontrado."};
        return res.status(404).json(erro);
    }
});

function validRequisition(name: string, method: string, type: string)
{
    if (name != null && name != undefined && name != "" &&
        method != null && method != undefined && method != "" &&
        type != null && type != undefined && type != "")
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
