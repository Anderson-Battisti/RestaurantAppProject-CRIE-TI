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

async function downloadCSV(id)
{
    let csv;

    if (id === "paymentMethodFullListCsvBtn")
    {
        let result = await fetch(urlApi + "/getPaymentMethodsList", {headers: buildHeaders()});
        if (userIsNotLogged(result)) return;
        let paymentMethods = await result.json(); 

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
            alert("Não há métodos de pagamento cadastrados para baixar.");
            return;
        }   
    }

    else if (id === "unitsOfMeasurementFullListCsvBtn")
    {
        let result = await fetch(urlApi + "/getUnitsOfMeasurementList", {headers: buildHeaders()});
        if (userIsNotLogged(result)) return;
        let unitsOfMeasurement = await result.json();

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
    }

    else if (id === "usersFullListCsvBtn")
    {
        let result = await fetch(urlApi + "/getUsersList", {headers: buildHeaders()});
        if (userIsNotLogged(result)) return;
        let users = await result.json();

        if (users.length > 0)
        {
            const csvHeader = '\ufeff"Id","Username","Ativo"\r\n'; 
            csv = csvHeader;
    
            for (let i = 0; i < users.length; i++)
            {
                let user = users[i];
                let active;
                user.active == true ? active = "Yes" : active = "No";

                csv += '"' + user.id + '","' + user.username + '","' + active + '"\r\n';
            }
        }
        else
        {
            alert("Não há usuários cadastrados para baixar.");
            return;
        }     
    }

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