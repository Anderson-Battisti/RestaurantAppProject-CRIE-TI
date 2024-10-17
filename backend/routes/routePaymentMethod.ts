import { Router } from "express";
import { Request, Response, NextFunction } from "express";
import { client, dbQuery } from '../database'; 
import { PaymentMethod } from "../modules/PaymentMethod";

export const routePayentMethods = Router();

routePayentMethods.get("/getPaymentMethodsList", async function(req: Request, res: Response): Promise<Response> //PaymentAPI
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

routePayentMethods.get("/getPaymentMethodById/:id", async function(req: Request, res: Response): Promise<Response> //PaymentAPI
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

routePayentMethods.post("/addPaymentMethod", async function(req: Request, res: Response): Promise<Response>
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

routePayentMethods.put("/editPaymentMethod", async function (req: Request, res: Response): Promise<Response>
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

routePayentMethods.delete("/deletePaymentMethod/:id", async function(req: Request, res: Response): Promise<Response>
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