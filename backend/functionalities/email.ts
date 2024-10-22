export class Email
{
    static defineListName(id: string)
    {
        let listName = "";
        let fileName = "";
        id === "paymentMethodSendEmailButton" ? (listName = " métodos de pagamento", fileName = "metodos-de-pagamento.csv") : 
        id === "unitsOfMeasurementSendEmailButton" ? (listName = "unidades de medida", fileName = "unidades-de-medida.csv") :
        id === "userManagementSendEmailButton" ? (listName = "usuários", fileName = "usuarios.csv") : null;

        return [listName, fileName];
    }

    static emailConfig()
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

        return emailConfig;
    }

    static mailOptions(email: string, fileName: string, listName: string, csv: string)
    {
        let mailOptions = 
        {
            from: "email@trial-yzkq340drqkld796.mlsender.net",
            to: email.trim(),
            subject: "Aula - Email Sender",
            html: `<p>E-mail automático. Você recebeu em anexo a lista de ${listName} cadastradas no @restaurant_app!</p>`,
            attachments:
            [
                {
                    filename: fileName,
                    content: csv
                }
            ]
        };
        return mailOptions;
    }
}
