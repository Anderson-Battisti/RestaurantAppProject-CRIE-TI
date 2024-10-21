import { Router } from "express";
import { Request, Response } from "express";
import { UnitOfMeasurement } from "../modules/UnitOfMeasurement";

export const routeUnitsOfMeasurement = Router();

routeUnitsOfMeasurement.get("/getUnitsOfMeasurementList", async function(req: Request, res: Response): Promise<Response>
{
    let databaseRows = await UnitOfMeasurement.getUnitsOfMeasurementList();
    
    if (databaseRows.data)
    {
        return res.status(200).json({success: true, databaseRows});
    }
    else if ("message" in databaseRows)
    {
        return res.status(404).json({success: false, message: "Não há unidades de medida cadastradas."});
    }
    else
    {
        return res.status(500).json({success: false, message: "Internal server error: ocorreu um erro ao solicitar informações no banco de dados."});
    }
});

routeUnitsOfMeasurement.get("/getUnitsOfMeasurementListById/:id", async function(req: Request, res: Response): Promise<Response> //PaymentAPI
{
    let id = Number(req.params.id);
    let databaseRows = await UnitOfMeasurement.getUnitsOfMeasurementListById(id);

    if (databaseRows)
    {
        return res.status(200).json({success: true, databaseRows});
    }
    else if ("message" in databaseRows)
    {
        return res.status(404).json({success: false, message: "Não foram encontradas Unidades de Medida com esse ID."});
    }
    else
    {
        return res.status(500).json({success: false, message: "Internal server error: ocorreu um erro ao solicitar informações no banco de dados."});
    }
});

routeUnitsOfMeasurement.post("/addUnitOfMeasurement", async function(req: Request, res: Response): Promise<Response>
{
    let unitOfMeasurement = new UnitOfMeasurement();
    unitOfMeasurement.name = req.body.name;
    unitOfMeasurement.abbreviation = req.body.abbreviation;

    if (unitOfMeasurement.validUnitOfMeasurement())
    {
        let addUnitOfMeasurementReturn = await unitOfMeasurement.addUnitOfMeasurement();
        
        if (addUnitOfMeasurementReturn.success)
        {
            return res.status(200).json({success: true, unitOfMeasurement});
        }
        else
        {
            return res.status(500).json({success: false, message: "Internal server error: Ocorreu um erro no banco de dados ao tentar inserir dados. Tente novamente ou contate o administrador"});
        }
    }
    else
    {
        return res.status(400).json({success: false, message: "Não foi possível adicionar unidade de medida, preencha todos os campos solicitados"});
    }
});

routeUnitsOfMeasurement.put("/editUnitOfMeasurement", async function (req: Request, res: Response): Promise<Response>
{
    let unitOfMeasurement = new UnitOfMeasurement();
    let id = req.body.id;
    unitOfMeasurement.name = req.body.name;
    unitOfMeasurement.abbreviation = req.body.abbreviation;

    if (unitOfMeasurement.validUnitOfMeasurement())
    {
        let editUnitOfMeasurementReturn = await unitOfMeasurement.editUnitOfMeasurement(id);

        if (editUnitOfMeasurementReturn.success)
        {
            return res.status(200).json({success: true, message: "Unidade de medida alterada com sucesso!"});
        }
        else if ("message" in editUnitOfMeasurementReturn)
        {
            return res.status(404).json({success: false, message: "Falha ao editar unidade de medida. Id não encontrado no banco de dados"});
        }
        else
        {
            return res.status(500).json({success: false, message: "Internal server error, ocorreu um erro ao gravar no banco de dados."});
        }  
    }
    else
    {
        return res.status(400).json({success: false, message: "Falha ao alterar unidade de medida. Preencha todos os campos."});
    }  
});

routeUnitsOfMeasurement.delete("/deleteUnitOfMeasurement/:id", async function(req: Request, res: Response): Promise<Response>
{
    let id = Number(req.params.id);
    let deleteUnitOfMeasurementReturn = await UnitOfMeasurement.deleteUnitOfMeasurement(id);

    if (deleteUnitOfMeasurementReturn.success)
    {
        return res.status(200).json({id: id, success: true, message: "Sucesso ao excluir unidade de medida."});
    }
    else if ("message" in deleteUnitOfMeasurementReturn)
    {
        return res.status(404).json({"codigo": id, success: false, "message": "Ocorreu um erro ao excluir. Unidade de medida não encontrada."});
    }
    else
    {
        return res.status(500).json({success: false, message: "Internal server error: ocorreu um erro ao processar informações no banco de dados."});
    }
});