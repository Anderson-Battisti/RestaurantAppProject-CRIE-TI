const apiUrl = "http://localhost:4000";

let user = localStorage.getItem("user");
let password = localStorage.getItem("password");

async function checkLogin()
{
    let success = await catchLogin(user, password);
    
    if (!success)
    {
        window.location = "index.html";
    }
}

async function catchLogin(user, password)
{
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("user", user);
    myHeaders.append("password", password);
    
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

    let user = document.getElementById("loginEmailField").value;
    let password = document.getElementById("loginPasswordField").value;

    let success = await catchLogin(user, password);

    if (success)
    {
        window.location = "inicio.html";
        localStorage.setItem("user", user);
        localStorage.setItem("password", password);
    }
    else
    {
        document.querySelector(".failedLoginMessage").style.visibility = "visible"
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
    localStorage.removeItem("user");
    localStorage.removeItem("password");
    window.location = "index.html";
}