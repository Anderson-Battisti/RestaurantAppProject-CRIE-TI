const apiUrl = "http://localhost:4000";

let authorization = localStorage.getItem("Authorization");

async function checkLogin()
{
    let success = await catchLogin(base64);
    
    if (!success)
    {
        window.location = "index.html";
    }
}

async function catchLogin(base64)
{
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", base64);
    
    const options = 
    {
        method: "GET",
        headers: myHeaders
    }

    let result;
    let resultJson;

    try
    {
        result = await fetch(apiUrl + "/checkLogin", options);
        resultJson = await result.json();
    }
    catch (error)
    {
        return false;
    }
    
    if (resultJson.success)
    {
        return true;
    }
    else
    {
        return false;
    }
}

async function logIn(event)
{
    event.preventDefault();

    let username = document.getElementById("loginEmailField").value;
    let password = document.getElementById("loginPasswordField").value;
    let base64 = "Basic " + btoa(username + ":" + password);
    let success = await catchLogin(base64);

    if (success)
    {
        window.location = "inicio.html";
        localStorage.setItem("Authorization", base64);
    }
    else
    {
        document.querySelector(".failedLoginMessage").style.visibility = "visible";
        setTimeout(function() {document.querySelector(".failedLoginMessage").style.visibility = "hidden"}, 1000);
    }
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

function resetAuthentication()
{
    localStorage.removeItem("Authorization");
    window.location = "index.html";
}