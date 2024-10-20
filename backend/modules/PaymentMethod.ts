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
        let sql = "select * from payment_methods order by id;"
        try
        {
            let result = await dbQuery(sql);

            if (result.rows.length > 0)
            {
                return result.rows;
            }
            else
            {
                return null;
            }
        }
        catch (error)
        {
            return {success: false, error: error.message};
        }
    }

    static async getPaymentMethodById(id: number)
    {
        let sql = "select * from payment_methods where id = $1;"

        try
        {
            let result = await dbQuery(sql, [id]);

            if (result.rows.length > 0)
            {
                return result.rows;
            }
            else
            {
                return null;
            }
        }
        catch (error)
        {
            return {success: false, error: error.message};
        }  
    }

    async addPaymentMethod()
    {
        let sql = `insert into payment_methods (name, method, type) values ($1, $2, $3) returning id;` 
        
        try
        {
            let result = await dbQuery(sql, [this.name, this.method, this.type]);

            if (result.rows.length > 0)
            {
                return true;
            }
            else
            {
                return false;
            }
        }
        catch (error)
        {
            return {success: false, error: error.message};
        }           
    }

    async editPaymentMethod(id: number)
    {
        let sql = `update payment_methods set name = $1, method = $2, type = $3 where id = $4;`

        try
        {
            let result = await dbQuery(sql, [this.name, this.method, this.type, id]);

            if (result.rowCount != null)
            {
                return true;
            }
            else
            {
                return false;
            }
        }
        catch (error)
        {
            return {success: false, error: error.message};
        }    
    }

    static async deletePaymentMethod(id: number)
    {   
        let sql = `delete from payment_methods where id = $1;`

        try
        {
            let result = await dbQuery(sql, [id]);

            if (result.rowCount != null)
            {
                return true;
            }
            else
            {
                return false;
            }
        }
        catch (error)
        {
            return {success: false, error: error.message};
        }
    }
}

