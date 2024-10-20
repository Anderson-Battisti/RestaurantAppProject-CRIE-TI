import { Router } from "express";
import { Request, Response } from "express";
import { client, dbQuery } from '../database'; 
import { UnitOfMeasurement } from "../modules/UnitOfMeasurement";

export const routeUnitsOfMeasurement = Router();

routeUnitsOfMeasurement.get("/getUnitsOfMeasurementList", async function(req: Request, res: Response): Promise<Response>
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

routeUnitsOfMeasurement.get("/getUnitsOfMeasurementListById/:id", async function(req: Request, res: Response): Promise<Response> //PaymentAPI
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

routeUnitsOfMeasurement.post("/addUnitOfMeasurement", async function(req: Request, res: Response): Promise<Response>
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

routeUnitsOfMeasurement.put("/editUnitOfMeasurement", async function (req: Request, res: Response): Promise<Response>
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

routeUnitsOfMeasurement.delete("/deleteUnitOfMeasurement/:id", async function(req: Request, res: Response): Promise<Response>
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