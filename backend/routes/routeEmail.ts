import { Router } from "express";
import { Request, Response } from "express";
import { Email } from "../functionalities/email";
import * as nodemailer from "nodemailer";

export const routeEmail = Router();

routeEmail.post("/sendEmail", async (req: Request, res: Response): Promise <Response> =>
{
    if (req.body.id && req.body.csv && req.body.email)
    {
        let listName = Email.defineFileName(req.body.id)[0];
        let fileName = Email.defineFileName(req.body.id)[1];

        let mailOptions = Email.mailOptions(req.body.email, fileName, listName, req.body.csv);
        let emailConfig = Email.emailConfig();

        let transporter = nodemailer.createTransport(emailConfig);

        transporter.sendMail(mailOptions, async function(error, info)
        {
            if (error)
            {
                console.log("Erro ao enviar email: " + error);
                return res.status(500).json({success: false, message: "Ocorreu um erro ao processar o envio do email.", erro: error});
            }
            else
            {
                console.log("Email enviado: " + info.response);
                return res.status(200).json({success: true, message: "Email enviado com sucesso!"});
            }
        });
    }
    else
    {
        return res.status(400).json({success: false, message: "A API não recebeu todos os campos necessários (ID, CSV ou Email destinatário)"}); 
    }
    return res.status(500);
});     