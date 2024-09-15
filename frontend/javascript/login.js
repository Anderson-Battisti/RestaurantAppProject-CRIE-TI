const apiUrl = "http://localhost:4000";

async function logIn(event)
{
    event.preventDefault();

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const login = JSON.stringify
    ({
        login: document.getElementById("loginEmailField").value,
        password: document.getElementById("loginPasswordField").value 
    });

    const requestOptions = 
    {
        method: "POST",
        headers: myHeaders,
        body: login,
        redirect: "follow"
    };

    let result = await fetch(apiUrl + "/checkLogin", requestOptions);
    let resultJson = await result.json();

    if (resultJson.success == true)
    {
        window.location = "inicio.html";
    }
    else
    {
        document.querySelector(".failedLoginMessage").style.visibility = "visible"
        setTimeout(function() {document.querySelector(".failedLoginMessage").style.visibility = "hidden"}, 1000);
    }
}