import { Router } from "express";
import { Request, Response } from "express";
import * as puppeteer from "puppeteer";
import { Pdf } from "../functionalities/pdfGenerator";

export const routePdfGenerator = Router();

routePdfGenerator.post("/generatePdf", async (req: Request, res: Response): Promise<Response | undefined> =>
{
    let id: string = req.body.id;
    let result: string[] = [];
    let html: string = "";
    let fileName: string = "";
    
    try
    {
        if (id)
        {
            result = await Pdf.buildPdf(id);
            html = result[0];
            fileName = result[1];
        }
        else
        {
            return res.status(400).json({success: false, message: "O servidor não recebeu todos os campos necessários (ID)"}); 
        }
        
        if (html.length > 0)
        {
            const browser = await puppeteer.launch({headless: true});
            const page = await browser.newPage();
            await page.setViewport({width: 1366, height: 768});
            await page.setContent(html);
            const pdfBuffer = await page.pdf();
            await page.close();
            await browser.close();
        
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename="${fileName}.pdf"`);
            res.setHeader('Content-Length', pdfBuffer.length.toString());
        
            return res.end(pdfBuffer);
        }
    
        res.status(500).json({sucess: false, message: "Internal error. Não foi possível buscar dados no banco de dados"});

    }
    catch (error)
    {
        return res.status(500).json({error: (error as Error).message, message: "Internal error. Não foi possível buscar dados no banco de dados"});
    }
});