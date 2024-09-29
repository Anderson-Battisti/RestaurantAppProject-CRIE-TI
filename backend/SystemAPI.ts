import { User } from "./modules/User";
import { PaymentMethod } from "./modules/PaymentMethod";
import { UnitOfMeasurement } from "./modules/UnitOfMeasurement";
import express, {Express, NextFunction, Request, Response} from "express";
import cors from "cors";
import { client, dbQuery } from "./database";

let server: Express = express();
const serverPort = 4000;

server.use(cors());
server.use(express.json());

server.use(async (req: Request, res: Response, next: NextFunction) =>
{
    let user = req.get("user");
    let password = req.get("password");
    let sql = `select * from users where username = $1 and password = crypt($2, password) and active = true;`
    let result = await dbQuery(sql, [user, password]);

    if (result.rows.length > 0)
    {
        next();
        return;
    }
 
    return res.status(401).json({"error": "Falha na autenticação!"});
});

server.get("/checkLogin", async function(req: Request, res: Response): Promise<Response> //Login API
{
    return res.status(200).json({success: true, message: "Usuário e senha batem. Login efetuado com sucesso!"});   
});

server.get("/getPaymentMethodsList", async function(req: Request, res: Response): Promise<Response> //PaymentAPI
{
    let sql = "select * from payment_methods order by id;"
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

    if (paymentMethod.validRequisition())
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

    if (paymentMethod.validRequisition())
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


server.get("/getUnitsOfMeasurementList", async function(req: Request, res: Response): Promise<Response>
{
    let sql = `select * from units_of_measurement order by id;`
    let result = await dbQuery(sql);
    
    if (result.rows.length > 0)
    {
        return res.status(200).json(result.rows);
    }
    else
    {
        return res.status(200).json({success: false, message: "Não há unidades de medida cadastradas."})
    }
});

server.get("/getUnitsOfMeasurementListById/:id", async function(req: Request, res: Response): Promise<Response> //PaymentAPI
{
    let id = req.params.id;
    let sql = "select * from units_of_measurement where id = $1;"
    let result = await dbQuery(sql, [id]);

    if (result.rows.length > 0)
    {
        return res.status(200).json(result.rows);
    }
    else
    {
        return res.status(400).json({success: false, message: "Não foram encontradas Unidades de Medida com esse ID."});
    }
});

server.post("/addUnitOfMeasurement", async function(req: Request, res: Response): Promise<Response>
{
    let unitOfMeasurement = new UnitOfMeasurement();
    unitOfMeasurement.name = req.body.name;
    unitOfMeasurement.abbreviation = req.body.abbreviation;

    if (unitOfMeasurement.validUnitOfMeasurement())
    {
        let sql = `insert into units_of_measurement (name, abbreviation) values ($1, $2);`;
        let result = await dbQuery(sql, [unitOfMeasurement.name, unitOfMeasurement.abbreviation]);
        
        if (result.rowCount != null)
        {
            return res.status(200).json({success: true, unitOfMeasurement});
        }
        else
        {
            return res.status(400).json({success: false, message: "Ocorreu um erro no banco de dados ao tentar inserir dados. Tente novamente ou contate o administrador"});
        }
    }
    else
    {
        return res.status(400).json({success: false, message: "Não foi possível adicionar unidade de medida, preencha todos os campos solicitados"});
    }
});

server.put("/editUnitOfMeasurement", async function (req: Request, res: Response): Promise<Response>
{
    let unitOfMeasurement = new UnitOfMeasurement();
    let id = req.body.id;
    unitOfMeasurement.name = req.body.name;
    unitOfMeasurement.abbreviation = req.body.abbreviation;

    if (unitOfMeasurement.validUnitOfMeasurement())
    {
        let sql = `update units_of_measurement set name = $1, abbreviation = $2 where id = $3;`
        let result = dbQuery(sql, [unitOfMeasurement.name, unitOfMeasurement.abbreviation, id]);
        return res.status(200).json({success: true, message: "Unidade de medida alterada com sucesso!"});
    }
    else
    {
        return res.status(400).json({success: false, message: "Falha ao alterar unidade de medida. Preencha todos os campos."});
    }  
});

server.delete("/deleteUnitOfMeasurement/:id", async function(req: Request, res: Response): Promise<Response>
{
    let id = Number(req.params.id);
    let sql = `delete from units_of_measurement where id = $1;`
    let result = await dbQuery(sql, [id]);

    if (result.rowCount != null)
    {
        return res.status(200).json({id: id, success: true, message: "Sucesso ao excluir unidade de medida."});
    }
    else
    {
        return res.status(404).json({"codigo": id, success: false, "message": "Ocorreu um erro ao excluir. Unidade de medida não encontrada."});
    }
});

server.listen(serverPort, () =>
{
    console.log("Server started on port " + serverPort);
});
