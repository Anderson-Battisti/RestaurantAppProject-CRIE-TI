import { dbQuery } from "../database";

export class PaymentMethod
{
    name : string = "";
    method : string = ""; // card, transference, etc
    type : string = ""; //credit, debit, pix, etc


    validRequisition()
    {
        if (this.name != null && this.name != undefined && this.name != "" &&
            this.method != null && this.method != undefined && this.method != "" &&
            this.type != null && this.type != undefined && this.type != "")
        {
            return true;
        }
        else
        {
            return false;
        }
    }

    static async getPaymentMethodsList()
    {
        let sql = "select * from payment_methods order by id;";
        
        try
        {
            let result = await dbQuery(sql);

            if (result.rows.length > 0)
            {
                return result.rows;
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

    static async getPaymentMethodById(id: number)
    {
        let sql = "select * from payment_methods where id = $1;";

        try
        {
            let result = await dbQuery(sql, [id]);

            if (result.rows.length > 0)
            {
                return result.rows;
            }
            else
            {
                return {success: false, message: "Não foram encontradas métodos de pagamento com esse ID."};
            }
        }
        catch (error)
        {
            return {success: false, error: (error as Error).message};
        }  
    }

    async addPaymentMethod()
    {
        let sql = `insert into payment_methods (name, method, type) values ($1, $2, $3) returning id;`;
        
        try
        {
            let result = await dbQuery(sql, [this.name, this.method, this.type]);

            if (result.rows.length > 0)
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

    async editPaymentMethod(id: number)
    {
        let sql = `update payment_methods set name = $1, method = $2, type = $3 where id = $4;`;

        try
        {
            let result = await dbQuery(sql, [this.name, this.method, this.type, id]);

            if (result.rowCount != null)
            {
                return {success: true};
            }
            else
            {
                return {success: false, message: "Falha ao editar método de pagamento. Id não encontrado no banco de dados"};
            }
        }
        catch (error)
        {
            return {success: false, error: (error as Error).message};
        }    
    }

    static async deletePaymentMethod(id: number)
    {   
        let sql = `delete from payment_methods where id = $1;`;

        try
        {
            let result = await dbQuery(sql, [id]);

            if (result.rowCount != null)
            {
                return {id: id, success: true};
            }
            else
            {
                return {success: false, message: "Ocorreu um erro ao excluir. Método de pagamento não encontrado."};
            }
        }
        catch (error)
        {
            return {success: false, error: (error as Error).message};
        }
    }
}

