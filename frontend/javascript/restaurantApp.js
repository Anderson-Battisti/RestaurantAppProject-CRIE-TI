function buildHeaders()
{
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", localStorage.getItem("Authorization"));

    return myHeaders;
}

function getUrlParams(id)
{
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    return urlParams.get(id);
}

function isAdm()
{
    let authorization = localStorage.getItem("Authorization")?.replace("Basic ", "");    
    let decodedAuthorization = atob(authorization);
    let splittedDecodedAuthorization = decodedAuthorization.split(":");

    if (splittedDecodedAuthorization[0] === 'admin')
    {
        return true;
    }
    else
    {
        return false;
    }
}

async function getCSV(id)
{
    let csv;

    if (id === "paymentMethodFullListCsvBtn" || id === "paymentMethodSendEmailButton")
    {
        let result = await fetch(urlApi + "/getPaymentMethodsList", {headers: buildHeaders()});
        if (userIsNotLogged(result)) return;
        let resultJson = await result.json(); 
        let paymentMethods = resultJson.databaseRows.data;

        if (paymentMethods.length > 0)
        {
            const csvHeader = '\ufeff"Id","Nome","Método","Tipo"\r\n';
            csv = csvHeader;
    
            for (let i = 0; i < paymentMethods.length; i++)
            {
                let paymentMethod = paymentMethods[i];
                
                csv += '"' + paymentMethod.id + '","' + paymentMethod.name + '","' + paymentMethod.method + '","' + paymentMethod.type + '"\r\n';
            }
        }
        else
        {
            alert("Não há métodos de pagamento cadastrados disponíveis para baixar");
            return;
        }
        id === "paymentMethodFullListCsvBtn" ? downloadCSV(csv, id) : sendEmail(csv, id);  
    }

    else if (id === "unitsOfMeasurementFullListCsvBtn" || id === "unitsOfMeasurementSendEmailButton")
    {
        let result = await fetch(urlApi + "/getUnitsOfMeasurementList", {headers: buildHeaders()});
        if (userIsNotLogged(result)) return;
        let resultJson = await result.json();
        let unitsOfMeasurement = resultJson.databaseRows.data;

        if (unitsOfMeasurement.length > 0)
        {
            const csvHeader = '\ufeff"Id","Nome","Abreviação"\r\n';
            csv = csvHeader;
    
            for (let i = 0; i < unitsOfMeasurement.length; i++)
            {
                let unitOfMeasurement = unitsOfMeasurement[i];               
                csv += '"' + unitOfMeasurement.id + '","' + unitOfMeasurement.name + '","' + unitOfMeasurement.abbreviation + '"\r\n';
            }
        }
        else
        {
            alert("Não há unidades de medida cadastradas para baixar.");
            return;
        }
        id === "unitsOfMeasurementFullListCsvBtn" ? downloadCSV(csv, id) : sendEmail(csv, id);
    }

    else if (id === "usersFullListCsvBtn" || id === "userManagementSendEmailButton")
    {
        let result = await fetch(urlApi + "/getUsersList", {headers: buildHeaders()});
        if (userIsNotLogged(result)) return;
        let resultJson = await result.json();
        let users = resultJson.databaseRows.data;

        if (users.length > 0)
        {
            const csvHeader = '\ufeff"Id","Username","Ativo"\r\n'; 
            csv = csvHeader;
    
            for (let i = 0; i < users.length; i++)
            {
                let user = users[i];
                let active;
                user.active == true ? active = "Sim" : active = "Não";

                csv += '"' + user.id + '","' + user.username + '","' + active + '"\r\n';
            }
        }
        else
        {
            alert("Não há usuários cadastrados para baixar.");
            return;
        }
        id === "usersFullListCsvBtn" ? downloadCSV(csv, id) : sendEmail(csv, id);    
    } 
}

function downloadCSV(csv, id)
{
    const csvData = "data:text/csv;charset=utf-8," + encodeURIComponent(csv);
    const downloadLink = document.createElement("a");
    downloadLink.href = csvData;

    let fileName = "";
    id === "paymentMethodFullListCsvBtn" ? fileName = "paymentMethodsList.csv" : 
    id === "unitsOfMeasurementFullListCsvBtn" ? fileName = "unitsOfMeasurementList.csv" :
    id === "usersFullListCsvBtn" ? fileName = "usersFullList.csv" : null;

    downloadLink.download = fileName;
    downloadLink.click();
}

async function sendEmail(csv, id)
{
    let email;
    id === "paymentMethodSendEmailButton" ? email = document.getElementById("paymentMethodEmailInput").value :
    id === "unitsOfMeasurementSendEmailButton" ? email = document.getElementById("unitsOfMeasurementEmailInput").value :
    id === "userManagementSendEmailButton" ? email = document.getElementById("userManagementEmailInput").value : null;

    if (email)
    {
        const reqBody = JSON.stringify
        ({
            csv: csv,
            id: id,
            email: email
        });

        const requestMethod = 
        {
            method: "POST",
            headers: buildHeaders(),
            body: reqBody,
            redirect: "follow"
        };

        let result = await fetch(urlApi + "/sendEmail", requestMethod);
        if (userIsNotLogged(result)) return;
        let resultJson = await result.json();

        if (resultJson.success === true)
        {
            alert("E-mail enviado com sucesso.");
        }
        else
        {
            alert("Ocorreu um erro ao enviar e-mail");
        }
    }
    else
    {
        alert("Para enviar a lista, informe um e-mail");
    }
}

async function generatePdf(id)
{
    let filename = "";
    id === "paymentMethodsPdfBtn" ? filename = "Formas de Pagamento.pdf" :
    id === "unitsOfMeasurementPdfBtn" ? filename = "Unidades de Medida.pdf" :
    id === "usersManagementPdfBtn" ? filename = "Usuarios.pdf" : null;

    const options = 
    {
        method: "POST", 
        body: JSON.stringify({id: id}), 
        redirect: "follow", 
        headers: buildHeaders()
    };

    const result = await fetch(urlApi + "/generatePdf", options);
    if (userIsNotLogged(result)) return;
    const pdfData = await result.arrayBuffer();

    const blob = new Blob([pdfData], {type: "application/pdf"});
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
}
