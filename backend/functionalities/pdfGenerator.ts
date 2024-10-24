import { dbQuery } from "../database";

export class Pdf
{
    static async buildPdf(id: string): Promise<string[]>
    {
        if (id == "paymentMethodsPdfBtn")
        {
            let result = await Pdf.buildPaymentMethodsPdf();
            return result;
        }
        else if (id == "unitsOfMeasurementPdfBtn")
        {
            let result = await Pdf.buildUnitsOfMeasurementPdf();
            return result;
        }
        else if (id == "usersManagementPdfBtn")
        {
            let result = await Pdf.buildUsersPdf();
            return result;
        }

        return ["", ""];
    }

    static async buildPaymentMethodsPdf(): Promise<string[]>
    {
        let html: string = "";
        let fileName: string = "";

        try 
        {
            let sql = `select * from payment_methods order by id;`;
            let result = await dbQuery(sql);
            fileName = "Formas de Pagamento.pdf";

            html = `<table style="width: 100%; border-collapse: collapse; font-family: sans-serif;">
                        <tr>
                            <td style="border: 1px solid black; padding: 8px; text-align: left;">ID</td>
                            <td style="border: 1px solid black; padding: 8px; text-align: left;">Nome</td>
                            <td style="border: 1px solid black; padding: 8px; text-align: left;">Método</td>
                            <td style="border: 1px solid black; padding: 8px; text-align: left;">Tipo</td>
                        </tr>`;

            for (let i = 0; i < result.rows.length; i++)
            {
                let paymentMethod = result.rows[i];

                html += `<tr>
                            <td style="border: 1px solid black; padding: 8px; text-align: left;">${paymentMethod.id}</td>
                            <td style="border: 1px solid black; padding: 8px; text-align: left;">${paymentMethod.name}</td>
                            <td style="border: 1px solid black; padding: 8px; text-align: left;">${paymentMethod.method}</td>
                            <td style="border: 1px solid black; padding: 8px; text-align: left;">${paymentMethod.type}</td>
                        </tr>`;
            }

            html += `</table>`;
        }
        catch (error)
        {
            return ["", ""];
        }

        return [html, fileName];  
    }

    static async buildUnitsOfMeasurementPdf(): Promise<string[]>
    {
        let html: string = "";
        let fileName: string = "";

        try
        {
            let sql = `select * from units_of_measurement order by id;`;
            let result = await dbQuery(sql);
            fileName = "Unidades de Medida.pdf";
    
            html = `<table style="width: 100%; border-collapse: collapse; font-family: sans-serif;">
                        <tr>
                            <td style="border: 1px solid black; padding: 8px; text-align: left;">ID</td>
                            <td style="border: 1px solid black; padding: 8px; text-align: left;">Nome</td>
                            <td style="border: 1px solid black; padding: 8px; text-align: left;">Abreviação</td>
                        </tr>`;
    
            for (let i = 0; i < result.rows.length; i++)
            {
                let unitOfMeasurement = result.rows[i];
    
                html += `<tr>
                            <td style="border: 1px solid black; padding: 8px; text-align: left;">${unitOfMeasurement.id}</td>
                            <td style="border: 1px solid black; padding: 8px; text-align: left;">${unitOfMeasurement.name}</td>
                            <td style="border: 1px solid black; padding: 8px; text-align: left;">${unitOfMeasurement.abbreviation}</td>
                        </tr>`;
            }
    
            html += `</table>`;
        }
        catch (error)
        {
            return ["", ""];
        }

        return[html, fileName];
    }

    static async buildUsersPdf(): Promise<string[]>
    {
        let html: string = "";
        let fileName: string = "";

        try
        {
            let sql = `select * from users order by id;`;
            let result = await dbQuery(sql);
            fileName = "Usuarios.pdf";
    
            html = `
                        <table style="width: 100%; border-collapse: collapse; font-family: sans-serif;">
                            <tr>
                                <td style="border: 1px solid black; padding: 8px; text-align: left;">ID</td>
                                <td style="border: 1px solid black; padding: 8px; text-align: left;">Username</td>
                                <td style="border: 1px solid black; padding: 8px; text-align: left;">Ativo</td>
                            </tr>`;
    
            for (let i = 0; i < result.rows.length; i++)
            {
                let user = result.rows[i];
                let ativo: string = "";
                user.active === true ? ativo = "Sim" : "Não";
    
                html += `<tr>
                            <td style="border: 1px solid black; padding: 8px; text-align: left;">${user.id}</td>
                            <td style="border: 1px solid black; padding: 8px; text-align: left;">${user.username}</td>
                            <td style="border: 1px solid black; padding: 8px; text-align: left;">${ativo}</td>
                        </tr>`;
            }
    
            html += `</table>`;                
        }
        catch (error)
        {
            return ["", ""];
        }
        
        return [html, fileName];
    }
}


