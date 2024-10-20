import { Router } from "express";
import { Request, Response } from "express";
import { PaymentMethod } from "../modules/PaymentMethod";

export const routePayentMethods = Router();

routePayentMethods.get("/getPaymentMethodsList", async function(req: Request, res: Response): Promise<Response> //PaymentAPI
{
    let databaseRows = await PaymentMethod.getPaymentMethodsList();
    
    if (databaseRows)
    {
        return res.status(200).json({success: true, databaseRows});
    }
    else if ("message" in databaseRows)
    {
        return res.status(404).json({success: false, message: "Não há métodos de pagamento cadastrados."});
    }
    else
    {
        return res.status(500).json({success: false, message: "Internal server error: ocorreu um erro ao solicitar informações no banco de dados."});
    }
});

routePayentMethods.get("/getPaymentMethodById/:id", async function(req: Request, res: Response): Promise<Response> //PaymentAPI
{
    let id = Number(req.params.id);
    let databaseRows = await PaymentMethod.getPaymentMethodById(id);

    if (databaseRows)
    {
        return res.status(200).json({success: true, databaseRows});
    }
    else if ("message" in databaseRows)
    {
        return res.status(404).json({success: false, message: "Não foram encontrados métodos de pagamento com esse ID."});
    }
    else
    {
        return res.status(500).json({success: false, message: "Internal server error: ocorreu um erro ao solicitar informações no banco de dados."});
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
        let addPaymentMethodReturn = await paymentMethod.addPaymentMethod();

        if (addPaymentMethodReturn.success)
        {
            return res.status(200).json({success: true, paymentMethod});
        }
        else
        {
            return res.status(500).json({success: false, message: "Internal server error, ocorreu um erro ao gravar no banco de dados."});
        }          
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
        let editPaymentMethodReturn = await paymentMethod.editPaymentMethod(id);

        if (editPaymentMethodReturn)
        {
            return res.status(200).json({success: true});
        }
        else if ("message" in editPaymentMethodReturn)
        {
            return res.status(404).json({success: false, message: "Falha ao editar método de pagamento. Id não encontrado no banco de dados"});
        }
        else
        {
            return res.status(500).json({success: false, message: "Internal server error, ocorreu um erro ao gravar no banco de dados."});
        }
    }
    else
    {
        return res.status(400).json({success: false, message: "Falha ao alterar método de pagamento. Preencha todos os campos."});
    }  
});

routePayentMethods.delete("/deletePaymentMethod/:id", async function(req: Request, res: Response): Promise<Response>
{
    let id = Number(req.params.id);
    let deletePaymentMethodReturn = await PaymentMethod.deletePaymentMethod(id);

    if (deletePaymentMethodReturn.success)
    {
        return res.status(200).json({id: id, success: true, message: "Sucesso ao excluir método de pagamento."});
    }
    else if ("message" in deletePaymentMethodReturn)
    {
        return res.status(404).json({"codigo": id, success: false, "message": "Ocorreu um erro ao excluir. Método de pagamento não encontrado."});
    }
    else
    {
        return res.status(500).json({success: false, message: "Internal server error: ocorreu um erro ao processar informações no banco de dados."});
    }
});