import { dbQuery } from "../database";

export class UnitOfMeasurement 
{
    name: string = "";
    abbreviation: string = "";

    validUnitOfMeasurement()
    {
        if (this.name != null && this.name != undefined && this.name != "" &&
            this.abbreviation != null && this.abbreviation != undefined && this.abbreviation != "")
        {
            return true;
        }
        else
        {
            return false;
        }
    }
    
    static async getUnitsOfMeasurementList()
    {
        let sql = `select * from units_of_measurement order by id;`;

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

    static async getUnitsOfMeasurementListById(id: number)
    {
        let sql = "select * from units_of_measurement where id = $1;";
        try
        {
            let result = await dbQuery(sql, [id]);

            if (result.rows.length > 0)
            {
                return result.rows;
            }
            else
            {
                return {success: false, message: "Não foram encontradas Unidades de Medida com esse ID."};
            }
        } 
        catch (error)
        {
            return {success: false, error: (error as Error).message};
        }
    }

    async addUnitOfMeasurement()
    {
        let sql = `insert into units_of_measurement (name, abbreviation) values ($1, $2);`;

        try
        {
            let result = await dbQuery(sql, [this.name, this.abbreviation]);

            if (result.rows != null)
            {
                return {success: true};
            }
            else
            {
                return {success: false, message: "Ocorreu um erro ao inserir dados no banco."};
            }
        }
        catch (error)
        {
            return {success: false, error: (error as Error).message};
        }
    }

    async editUnitOfMeasurement(id: number)
    {
        try
        {
            let sql = `update units_of_measurement set name = $1, abbreviation = $2 where id = $3;`;
            let result = await dbQuery(sql, [this.name, this.abbreviation, id]);

            if (result.rowCount != null)
            {
                return {success: true};   
            }
            else
            {
                return {success: false, message: "Falha ao editar unidade de medida. Id não encontrado no banco de dados"};
            }
        }
        catch (error)
        {
            return {success: false, error: (error as Error).message};
        }  
    }

    static async deleteUnitOfMeasurement(id: number)
    {
        let sql = `delete from units_of_measurement where id = $1;`;
        try
        {
            let result = await dbQuery(sql, [id]);

            if (result.rowCount != null)
            {
                return {id: id, success: true};
            }
            else
            {
                return {"codigo": id, success: false, message: "Ocorreu um erro ao excluir. Unidade de medida não encontrada."};
            }
        }
        catch (error)
        {
            return {success: false, error: (error as Error).message};
        }
    }
}