import * as puppeteer from "puppeteer";
import * as nodemailer from "nodemailer";
import { User } from "./modules/User";
import { PaymentMethod } from "./modules/PaymentMethod";
import { UnitOfMeasurement } from "./modules/UnitOfMeasurement";
import express, {Express, NextFunction, Request, Response} from "express";
import cors from "cors";
import { client, dbQuery } from "./database";

let server: Express = express();
const serverPort = 4000;

server.use(cors());
server.use(express.json());

server.use(async (req: Request, res: Response, next: NextFunction) =>
{
    let authorization = req.get("Authorization")?.replace("Basic ", "");

    if (authorization)
    {
        let decoded = Buffer.from(authorization, "base64").toString("utf8");
        let loginSplitted: string[] = decoded.split(":");
        let username = loginSplitted[0];
        let password = loginSplitted[1];

        let sql = `select * from users where username = $1 and password = crypt($2, password) and active = true;`
        let result = await dbQuery(sql, [username, password]);

        if (result.rows.length > 0)
        {
            next();
            return;
        }
        else
        {
            return res.status(401).json({"error": "Falha na autenticação! O banco de dados não retornou um usuário compatível com as credenciais enviadas."});     
        }
    }
    return res.status(401).json({"error": "Falha na autenticação! O servidor não recebeu a 'Authorization' corretamente."});
});

server.get("/checkLogin", async function(req: Request, res: Response): Promise<Response> //Login API
{
    return res.status(200).json({success: true, message: "Usuário e senha batem. Login efetuado com sucesso!"});   
});

server.get("/getPaymentMethodsList", async function(req: Request, res: Response): Promise<Response> //PaymentAPI
{
    let sql = "select * from payment_methods order by id;"
    let result = await dbQuery(sql);

    if (result.rows.length > 0)
    {
        return res.status(200).json(result.rows);
    }
    else
    {
        return res.status(400).json({success: false, message: "Não há métodos cadastrados"});
    }
});

server.get("/getPaymentMethodById/:id", async function(req: Request, res: Response): Promise<Response> //PaymentAPI
{
    let id = req.params.id;
    let sql = "select * from payment_methods where id = $1;"
    let result = await dbQuery(sql, [id]);

    if (result.rows.length > 0)
    {
        return res.status(200).json(result.rows);
    }
    else
    {
        return res.status(400).json({success: false, message: "Não foram encontrados métodos de pagamento com esse ID."});
    }
});

server.post("/addPaymentMethod", async function(req: Request, res: Response): Promise<Response>
{
    let paymentMethod = new PaymentMethod();
    paymentMethod.name = req.body.name.trim();
    paymentMethod.method = req.body.method.trim();
    paymentMethod.type = req.body.type.trim();

    if (paymentMethod.validRequisition())
    {
        let sql = `insert into payment_methods (name, method, type) values ($1, $2, $3);`   
        let result = await dbQuery(sql, [paymentMethod.name, paymentMethod.method, paymentMethod.type]);
        return res.status(200).json(paymentMethod);          
    }
    else
    {
        return res.status(400).json({success: false, message: "Não foi possível adicionar método, preencha todos os campos solicitados"});
    }   
});

server.put("/editPaymentMethod", async function (req: Request, res: Response): Promise<Response>
{
    let paymentMethod = new PaymentMethod();
    let id = req.body.id;
    paymentMethod.name = req.body.name;
    paymentMethod.method = req.body.method;
    paymentMethod.type = req.body.type;

    if (paymentMethod.validRequisition())
    {
        let sql = `update payment_methods set name = $1, method = $2, type = $3 where id = $4;`
        let result = dbQuery(sql, [paymentMethod.name, paymentMethod.method, paymentMethod.type, id]);
        return res.status(200).json({success: true, message: "Método alterado com sucesso!"});
    }
    else
    {
        return res.status(400).json({success: false, message: "Falha ao alterar método. Preencha todos os campos."});
    }  
});

server.delete("/deletePaymentMethod/:id", async function(req: Request, res: Response): Promise<Response>
{
    let id = Number(req.params.id);
    let sql = `delete from payment_methods where id = $1;`
    let result = await dbQuery(sql, [id]);

    if (result.rowCount != null)
    {
        return res.status(200).json({id: id, success: true, message: "Sucesso ao excluir método de pagamento."});
    }
    else
    {
        return res.status(404).json({"codigo": id, success: false, "message": "Ocorreu um erro ao excluir. Método de pagamento não encontrado."});
    }
});


server.get("/getUnitsOfMeasurementList", async function(req: Request, res: Response): Promise<Response>
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

server.get("/getUnitsOfMeasurementListById/:id", async function(req: Request, res: Response): Promise<Response> //PaymentAPI
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

server.post("/addUnitOfMeasurement", async function(req: Request, res: Response): Promise<Response>
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

server.put("/editUnitOfMeasurement", async function (req: Request, res: Response): Promise<Response>
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

server.delete("/deleteUnitOfMeasurement/:id", async function(req: Request, res: Response): Promise<Response>
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

server.get("/getUsersList", async function(req: Request, res: Response): Promise<Response>
{
    let sql = `select id, username, active from users order by id;`;
    let result = await dbQuery(sql);

    if (result.rows.length > 0)
    {
        return res.status(200).json(result.rows);
    }
    else
    {
        return res.status(400).json({success: false, message: "Erro. Não há usuários cadastrados"})
    }
});

server.get("/getUserById/:id", async (req: Request, res: Response): Promise<Response> =>
{
    let id = req.params.id;
    let sql = "select * from users where id = $1;"
    let result = await dbQuery(sql, [id]);

    if (result.rows.length > 0)
    {
        return res.status(200).json(result.rows);
    }
    else
    {
        return res.status(400).json({success: false, message: "Não foram encontrados usuários com esse ID."});
    }
});

server.post("/createUser", async (req: Request, res: Response): Promise<Response> =>
{
    let username = req.body.username;
    let password = req.body.password;

    let sql = `insert into users (username, password, active) values ($1, crypt($2, gen_salt('bf')), true) returning id`;
    let result = await dbQuery(sql, [username, password]);
    
    if (result.rows[0].id)
    {
        return res.status(200).json({success: true, message: "Usuário criado com sucesso."})
    }
    else
    {
        return res.status(500).json({success: false, message: "Erro interno. Não foi possível conectar ou inserir dados no banco de dados"});
    }
});

server.put("/updateUser", async (req: Request, res: Response): Promise<Response> =>
{
    let username = req.body.username;
    let password = req.body.password;
    let id = req.body.id;

    let sql = `update users set username = $1, password = crypt($2, gen_salt('bf')), active = true where id = $3 returning id`;
    let result = await dbQuery(sql, [username, password, id]);

    if (result.rows[0].id)
    {
        return res.status(200).json({success: true, message: "Usuário atualizado com sucesso!"});
    }
    else
    {
        return res.status(500).json({success: false, message: "Erro interno. Não foi possível conectar ou atualizar dados no banco de dados"});    
    }
});

server.post("/sendEmail", async (req: Request, res: Response): Promise <Response> =>
{
    if (req.body.id && req.body.csv && req.body.email)
    {
        let emailConfig = 
        {
            host: "smtp.mailersend.net",
            port: 587,
            auth: {
                user: "MS_bobcEJ@trial-yzkq340drqkld796.mlsender.net",
                pass: "yoWlRmW3whrtv8wR"
            }
        }

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

server.get("/generatePdf", async (req: Request, res: Response): Promise<Response> =>
{
    let sql = `select * from payment_methods;`;
    let result = await dbQuery(sql);

    let html = `
                <table>
                    <tr>
                        <td>ID</td>
                        <td>Nome</td>
                        <td>Método</td>
                        <td>Tipo</td>
                    </tr>`;

    for (let i = 0; i < result.rows.length; i++)
    {
        let paymentMethod = result.rows[i];

        html += `<tr>
                    <td>${paymentMethod.id}</td>
                    <td>${paymentMethod.name}</td>
                    <td>${paymentMethod.method}</td>
                    <td>${paymentMethod.type}</td>
                 </tr>`
    }

    html += `</table>`;

    const browser = await puppeteer.launch({headless: true});
    const page = await browser.newPage();
    await page.setViewport({width: 1366, height: 768});
    await page.setContent(html);

    const pdfBuffer = await page.pdf();

    await page.close();
    await browser.close();

    res.contentType("application/pdf");
    return res.send(pdfBuffer);
});

server.listen(serverPort, () =>
{
    console.log("Server started on port " + serverPort);
});
