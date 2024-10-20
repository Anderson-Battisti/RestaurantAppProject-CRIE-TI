import { Router } from "express";
import { Request, Response } from "express";
import * as nodemailer from "nodemailer";

export const routeEmail = Router();

routeEmail.post("/sendEmail", async (req: Request, res: Response): Promise <Response> =>
    {
        if (req.body.id && req.body.csv && req.body.email)
        {
            let emailConfig = 
            {
                host: "smtp.mailersend.net",
                port: 587,
                auth: 
                {
                    user: "MS_bobcEJ@trial-yzkq340drqkld796.mlsender.net",
                    pass: "yoWlRmW3whrtv8wR"
                }
            };
    
            let listName = ""
            let fileName = "";
            req.body.id === "paymentMethodSendEmailButton" ? (listName = " métodos de pagamento", fileName = "metodos-de-pagamento.csv") : 
            req.body.id === "unitsOfMeasurementSendEmailButton" ? (listName = "unidades de medida", fileName = "unidades-de-medida.csv") :
            req.body.id === "userManagementSendEmailButton" ? (listName = "usuários", fileName = "usuarios.csv") : null;
    
            let mailOptions = 
            {
                from: "email@trial-yzkq340drqkld796.mlsender.net",
                to: req.body.email.trim(),
                subject: "Aula - Email Sender",
                html: `<p>E-mail automático. Você recebeu em anexo a lista de ${listName} cadastradas no @restaurant_app!</p>`,
                attachments:
                [
                    {
                        filename: fileName,
                        content: req.body.csv
                    }
                ]
            };
    
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