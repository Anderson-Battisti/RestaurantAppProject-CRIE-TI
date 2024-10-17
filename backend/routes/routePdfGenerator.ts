import { Router } from "express";
import { Request, Response, NextFunction } from "express";
import { dbQuery } from "../database";
import * as puppeteer from "puppeteer";

export const routePdfGenerator = Router();

routePdfGenerator.post("/generatePdf", async (req: Request, res: Response): Promise<Response> =>
    {
        let id: string = req.body.id;
        let html: string = "";
        let filename: string = "";
    
        if (id)
        {
            if (id === "paymentMethodsPdfBtn")
            {
                try 
                {
                    let sql = `select * from payment_methods;`;
                    let result = await dbQuery(sql);
                    filename = "Formas de Pagamento.pdf";
        
                    html = `
                                <table style="width: 100%; border-collapse: collapse;">
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
                    res.status(500).json({sucess: false, message: "Internal error. Não foi possível buscar dados no banco de dados"});
                }                
            }
    
            else if (id === "unitsOfMeasurementPdfBtn")
            {
                try
                {
                    let sql = `select * from units_of_measurement;`;
                    let result = await dbQuery(sql);
                    filename = "Unidades de Medida.pdf";
            
                    html = `    
                                <table style="width: 100%; border-collapse: collapse;">
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
                    res.status(500).json({sucess: false, message: "Internal error. Não foi possível buscar dados no banco de dados"});
                } 
            }
    
            else if (id === "usersManagementPdfBtn")
            {
                try
                {
                    let sql = `select * from users;`;
                    let result = await dbQuery(sql);
                    filename = "Usuarios.pdf";
            
                    html = `
                                <table style="width: 100%; border-collapse: collapse;">
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
                    res.status(500).json({sucess: false, message: "Internal error. Não foi possível buscar dados no banco de dados"});
                }
            }
        }
        else
        {
            return res.status(400).json({success: false, message: "O servidor não recebeu todos os campos necessários (ID)"}); 
        }
        
        const browser = await puppeteer.launch({headless: true});
        const page = await browser.newPage();
        await page.setViewport({width: 1366, height: 768});
        await page.setContent(html);
        const pdfBuffer = await page.pdf();
        await page.close();
        await browser.close();
    
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}.pdf"`);
        res.setHeader('Content-Length', pdfBuffer.length.toString());
    
        return res.end(pdfBuffer);
    });