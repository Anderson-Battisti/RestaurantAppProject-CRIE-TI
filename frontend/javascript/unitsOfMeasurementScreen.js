const urlApi = "http://localhost:4000";

function buildHeaders()
{
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("user", localStorage.getItem("user"));
    myHeaders.append("password", localStorage.getItem("password"));

    return myHeaders;
}       

async function listUnitsOfMeasurement()
{
    let result = await fetch(urlApi + "/getUnitsOfMeasurementList", {headers: buildHeaders()});
    if (userIsNotLogged(result)) return;
    
    let listOfUnitsOfMeasurement = await result.json();
    let html = "";

    if (listOfUnitsOfMeasurement.length > 0)
    {
        for (let i = 0; i < listOfUnitsOfMeasurement.length; i++)
        {
            let unitOfMeasurement = listOfUnitsOfMeasurement[i];
            let editBtn = `<button onclick="openEditUnitsOfMeasurementsPopUp(${unitOfMeasurement.id})" class="btn btn-primary listBtn">Editar</button>`;
            let deleteBtn = `<button onclick="deleteUnitOfMeasurement(${unitOfMeasurement.id})" class="btn btn-primary listBtn">Excluir</button>`;
            
            html += `<tr>
                        <td class="buttons">${editBtn}${deleteBtn}</td>
                        <td>${unitOfMeasurement.id}</td>
                        <td>${unitOfMeasurement.name}</td>
                        <td>${unitOfMeasurement.abbreviation}</td>
                     </tr>`;
        }
        document.getElementById("unitsOfMeasurementTableBody").innerHTML = html;
    }
    else
    {
        document.getElementById("unitsOfMeasurementTableBody").innerHTML = ""; 
    }
}

async function addUnitOfMeasurement()
{
    const reqBody = JSON.stringify
    ({
        name: document.getElementById("unitName").value.trim(),
        abbreviation: document.getElementById("unitAbbreviation").value.trim(),
    });

    const requestMethod = 
    {
        method: "POST",
        headers: buildHeaders(),
        body: reqBody,
        redirect: "follow"
    };

    if (filledFields())
    {
        let result = await fetch(urlApi + "/addUnitOfMeasurement", requestMethod);
        if (userIsNotLogged(result)) return;
        
        let resultJson = await result.json();

        if (resultJson.success == true)
        {
            let html = `<p style="color: green; font-family: 'Poppins'">Sucesso!</p>`
            document.getElementById("popUpMessage").innerHTML = html;
            document.getElementById("saveUnitOfMeasurementBtn").disabled = true;

            setTimeout(function()
            {closePopUps(), document.getElementById("popUpMessage").innerHTML = ``,
             document.getElementById("unitName").value = ``,
             document.getElementById("unitAbbreviation").value = ``,
             document.getElementById("saveUnitOfMeasurementBtn").disabled = false;
            }, 800);
            listUnitsOfMeasurement();       
        }
    }
    else
    {
        let html = `<p style="color: red; font-family: 'Poppins'">Preencha todos os campos!</p>`
        document.getElementById("popUpMessage").innerHTML = html;

        setTimeout(function(){document.getElementById("popUpMessage").innerHTML = ``}, 3000);
    }
}

async function editUnitOfMeasurement()
{
    let id = getUrlParams("id");

    const requestBody = JSON.stringify 
    ({
        id : id,
        name : document.getElementById("editUnitName").value,
        abbreviation : document.getElementById("editUnitAbbreviation").value,        
    });

    const requestOptions = 
    {
        method : "PUT",
        headers : buildHeaders(),
        body : requestBody,
        redirect : "follow"
    };

    if (editFilledFields())
    {
        let result = await fetch(urlApi + "/editUnitOfMeasurement", requestOptions);
        if (userIsNotLogged(result)) return;
        
        let resultJson = await result.json();

        if (resultJson.success)
        {
            let html = `<p style="color: green; font-family: 'Poppins'">Sucesso!</p>`
            document.getElementById("editPopUpMessage").innerHTML = html;
    
            setTimeout(function()
            {closePopUps(), document.getElementById("editPopUpMessage").innerHTML = ``,
                document.getElementById("editUnitName").value = ``,
                document.getElementById("editUnitAbbreviation").value = ``
            }, 800);
            listUnitsOfMeasurement();
        }
    }
    else
    {
        let html = `<p style="color: red; font-family: 'Poppins'">Preencha todos os campos!</p>`
        document.getElementById("editPopUpMessage").innerHTML = html;
        setTimeout(function() {document.getElementById("editPopUpMessage").innerHTML = ``}, 3000);
    }
}

async function deleteUnitOfMeasurement(param)
    {
        let id = param;
        const url = "/deleteUnitOfMeasurement/" + param;
        const method = {method: "DELETE", redirect: "follow", headers: buildHeaders()};

        if (confirm("Deseja realmente excluir essa unidade de medida?"))
        {
            let result = await fetch(urlApi + url, method);
            if (userIsNotLogged(result)) return;
            
            let resultJson = await result.json();

            if (resultJson.success == true)
            {
                alert("Método de pagamento excluído com sucesso.");
                listUnitsOfMeasurement();
            }
            else if (result.status != 401)
            {
                alert("Ocorreu um erro ao excluir método de pagamento. Tente novamente mais tarde ou contate o administrador");
            }
        }
    }

function filledFields()
{
    let name = document.getElementById("unitName").value;
    let abbreviation = document.getElementById("unitAbbreviation").value;

    if (name != null && name != undefined && name != "" &&
        abbreviation != null && abbreviation != undefined && abbreviation != "")
    {
        return true;
    }
    else
    {
        return false;
    }
}

function openPopUp() 
{
    document.querySelector(".popup").style.display = "flex";
}

async function openEditUnitsOfMeasurementsPopUp(id)
{
    let result = await fetch(urlApi + "/getUnitsOfMeasurementListById/" + id, {headers: buildHeaders()});
    if (userIsNotLogged(result)) return;

    document.querySelector(".popupEdit").style.display = "flex";
    window.history.pushState(null, '', "unitsOfMeasurement.html?id=" + id);
    window.scrollTo(0, 0);  
    
    let unitOfMeasurements = await result.json();

    document.getElementById("editUnitName").value = unitOfMeasurements[0].name;
    document.getElementById("editUnitAbbreviation").value = unitOfMeasurements[0].abbreviation;   
}

function closePopUps()
{
    document.querySelector(".popup").style.display = "none";
    document.querySelector(".popupEdit").style.display = "none";

    document.getElementById("unitName").value = ``,
    document.getElementById("unitAbbreviation").value = ``,

    document.getElementById("editUnitName").value = ``,
    document.getElementById("editUnitAbbreviation").value = ``
}

function editFilledFields()
{
    let name = document.getElementById("editUnitName").value;
    let abbreviation = document.getElementById("editUnitAbbreviation").value;

    if (name != null && name != undefined && name != "" &&
        abbreviation != null && abbreviation != undefined && abbreviation != "")
    {
        return true;
    }
    else
    {
        return false;
    }
}

function getUrlParams(id)
{
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    return urlParams.get(id);
}

function userIsNotLogged(result)
{
    if (result.status === 401)
    {
        alert("Falha na autenticação, faça login e tente novamente!");
        window.location = "index.html";
        return true;
    }
    return false;
}