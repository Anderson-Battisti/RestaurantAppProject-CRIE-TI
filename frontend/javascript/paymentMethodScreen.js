const apiUrl = "http://localhost:4000";

async function listPaymentMethods()
{
    let result = await fetch(apiUrl + "/getPaymentMethodsList");
    let paymentMethods = await result.json();

    let html = "";

    for (let i = 0; i < paymentMethods.length; i++)
    {
        let paymentMethod = paymentMethods[i];
        let editBtn = `<button onclick="openPopUpEdit(${i});" class="btn btn-primary listBtn">Editar</button>`;
        let deleteBtn = `<button onclick="deletePaymentMethod(${i});" class="btn btn-primary listBtn">Excluir</button>`

        html += `<tr>
                    <td class="buttons">${editBtn}${deleteBtn}</td>
                    <td>${paymentMethod.id}</td>
                    <td>${paymentMethod.name}</td>
                    <td>${paymentMethod.method}</td>
                    <td>${paymentMethod.type}</td>
                 </tr>`;
    }
    document.getElementById("tableBody").innerHTML = html;
}

async function addPaymentMethod()
{
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const reqBody = JSON.stringify
    ({
        name: document.getElementById("paymentName").value,
        method: document.getElementById("paymentMethod").value,
        type: document.getElementById("paymentType").value
    });

    const requestMethod = 
    {
        method: "POST",
        headers: myHeaders,
        body: reqBody,
        redirect: "follow"
    };

    if (filledFields())
    {
        let result = await fetch(apiUrl + "/addPaymentMethod", requestMethod);
        let resultJson = await result.json();
        if (resultJson.id)
        {
            let html = `<p style="color: green; font-family: 'Poppins'">Sucesso!</p>`
            document.getElementById("popUpMessage").innerHTML = html;

            setTimeout(function()
            {closePopUps(), document.getElementById("popUpMessage").innerHTML = ``,
             document.getElementById("paymentName").value = ``,
             document.getElementById("paymentMethod").value = ``,
             document.getElementById("paymentType").value = ``
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
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

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
        headers : myHeaders,
        body : requestBody,
        redirect : "follow"
    };

    let result = await fetch(apiUrl + "/editPaymentMethod", requestOptions);
    let resultJson = await result.json();

    console.log(resultJson);
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

function openPopUp() 
{
    document.querySelector(".popup").style.display = "flex";
}

function openPopUpEdit(id)
{
    document.querySelector(".popupEdit").style.display = "flex";
    window.history.pushState(null, '', "paymentMethod.html?id=" + id);      
}

function closePopUps()
{
    document.querySelector(".popup").style.display = "none";
    document.querySelector(".popupEdit").style.display = "none";
}

function getUrlParams(id)
{
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    return urlParams.get(id);
}

