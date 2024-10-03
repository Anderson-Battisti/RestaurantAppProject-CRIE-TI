const urlApi = "http://localhost:4000";

async function listPaymentMethods()
{
    let result = await fetch(urlApi + "/getPaymentMethodsList", {headers: buildHeaders()});
    if (userIsNotLogged(result)) return;
    
    let paymentMethods = await result.json();
    let html = "";

    if (paymentMethods.length > 0)
    {
        for (let i = 0; i < paymentMethods.length; i++)
        {
            let paymentMethod = paymentMethods[i];
            let editBtn = `<button onclick="openPopUpEdit(${paymentMethod.id});" class="btn btn-primary listBtn">Editar</button>`;
            let deleteBtn = `<button onclick="deletePaymentMethod(${paymentMethod.id});" class="btn btn-primary listBtn">Excluir</button>`
            if (paymentMethod != null)
            {
                html += `<tr>
                            <td class="buttons">${editBtn}${deleteBtn}</td>
                            <td>${paymentMethod.id}</td>
                            <td>${paymentMethod.name}</td>
                            <td>${paymentMethod.method}</td>
                            <td>${paymentMethod.type}</td>
                         </tr>`;
            } 
        }
        document.getElementById("tableBody").innerHTML = html;
    }
    else
    {
        document.getElementById("tableBody").innerHTML = ""; 
    }   
}

async function addPaymentMethod()
{
    const reqBody = JSON.stringify
    ({
        name: document.getElementById("paymentName").value,
        method: document.getElementById("paymentMethod").value,
        type: document.getElementById("paymentType").value
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
        let result = await fetch(urlApi + "/addPaymentMethod", requestMethod);
        if (userIsNotLogged(result)) return;

        let resultJson = await result.json();

        if (resultJson.name)
        {
            let html = `<p style="color: green; font-family: 'Poppins'">Sucesso!</p>`
            document.getElementById("popUpMessage").innerHTML = html;
            document.getElementById("savePaymentMethodBtn").disabled = true;

            setTimeout(function()
            {closePopUps(), document.getElementById("popUpMessage").innerHTML = ``,
             document.getElementById("paymentName").value = ``,
             document.getElementById("paymentMethod").value = ``,
             document.getElementById("paymentType").value = ``,
             document.getElementById("savePaymentMethodBtn").disabled = false;
            }, 800);
            listPaymentMethods();       
        }
    }
    else
    {
        let html = `<p style="color: red; font-family: 'Poppins'">Preencha todos os campos!</p>`
        document.getElementById("popUpMessage").innerHTML = html;

        setTimeout(function(){document.getElementById("popUpMessage").innerHTML = ``}, 3000);
    }
}

async function editPaymentMethod()
{
    let id = getUrlParams("id");

    const requestBody = JSON.stringify 
    ({
        id : id,
        name : document.getElementById("editPaymentName").value,
        method : document.getElementById("editPaymentMethod").value,
        type : document.getElementById("editPaymentType").value        
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
        let result = await fetch(urlApi + "/editPaymentMethod", requestOptions);
        if (userIsNotLogged(result)) return;

        let resultJson = await result.json();

        if (resultJson.success)
        {
            let html = `<p style="color: green; font-family: 'Poppins'">Sucesso!</p>`
            document.getElementById("editPopUpMessage").innerHTML = html;
    
            setTimeout(function()
            {closePopUps(), document.getElementById("editPopUpMessage").innerHTML = ``,
                document.getElementById("editPaymentName").value = ``,
                document.getElementById("editPaymentMethod").value = ``,
                document.getElementById("editPaymentType").value = ``
            }, 800);
            listPaymentMethods();
        }
    }
    else
    {
        let html = `<p style="color: red; font-family: 'Poppins'">Preencha todos os campos!</p>`
        document.getElementById("editPopUpMessage").innerHTML = html;

        setTimeout(function() {document.getElementById("editPopUpMessage").innerHTML = ``}, 3000);
    }
}

async function deletePaymentMethod(param)
{
    let id = param;
    const url = "/deletePaymentMethod/" + param;
    const method = {method: "DELETE", redirect: "follow", headers: buildHeaders()};

    if (confirm("Deseja realmente excluir esse método de pagamento?"))
    {
        let result = await fetch(urlApi + url, method);
        if (userIsNotLogged(result)) return;
        
        let resultJson = await result.json();

        if (resultJson.success == true)
        {
            alert("Método de pagamento excluído com sucesso.");
            listPaymentMethods();
        }
        else if (result.status != 401)
        {
            alert("Ocorreu um erro ao excluir método de pagamento. Tente novamente mais tarde ou contate o administrador.")
        }
    }
}

function filledFields()
{
    let name = document.getElementById("paymentName").value;
    let paymentMethod = document.getElementById("paymentMethod").value;
    let paymentType = document.getElementById("paymentType").value;

    if (name != null && name != undefined && name != "" &&
        paymentMethod != null && paymentMethod != undefined && paymentMethod != "" &&
        paymentType != null && paymentType != undefined && paymentType != "")
    {
        return true;
    }
    else
    {
        return false;
    }
}

function editFilledFields()
{
    let name = document.getElementById("editPaymentName").value;
    let paymentMethod = document.getElementById("editPaymentMethod").value;
    let paymentType = document.getElementById("editPaymentType").value;

    if (name != null && name != undefined && name != "" &&
        paymentMethod != null && paymentMethod != undefined && paymentMethod != "" &&
        paymentType != null && paymentType != undefined && paymentType != "")
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

async function openPopUpEdit(id)
{
    let result = await fetch(urlApi + "/getPaymentMethodById/" + id, {headers: buildHeaders()});
    if (userIsNotLogged(result)) return;

    let paymentMethods = await result.json();

    document.querySelector(".popupEdit").style.display = "flex";
    window.history.pushState(null, '', "paymentMethod.html?id=" + id);
    window.scrollTo(0, 0);

    document.getElementById("editPaymentName").value = paymentMethods[0].name;
    document.getElementById("editPaymentMethod").value = paymentMethods[0].method;
    document.getElementById("editPaymentType").value = paymentMethods[0].type;      
}

function closePopUps()
{
    document.querySelector(".popup").style.display = "none";
    document.querySelector(".popupEdit").style.display = "none";

    document.getElementById("paymentName").value = ``,
    document.getElementById("paymentMethod").value = ``,
    document.getElementById("paymentType").value = ``

    document.getElementById("editPaymentName").value = ``,
    document.getElementById("editPaymentMethod").value = ``,
    document.getElementById("editPaymentType").value = ``
}