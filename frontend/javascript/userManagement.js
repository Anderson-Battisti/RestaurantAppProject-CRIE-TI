const urlApi = "http://localhost:4000";

function buildHeaders()
{
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("user", localStorage.getItem("user"));
    myHeaders.append("password", localStorage.getItem("password"));

    return myHeaders;
}

async function listAllUsers()
{
    let result = await fetch(urlApi + "/getUsersList", {headers: buildHeaders()});
    if (userIsNotLogged(result)) return;
    
    let users = await result.json();
    let html = "";

    if (users.length > 0)
    {
        for (let i = 0; i < users.length; i++)
        {
            let user = users[i];
            let editBtn = `<button onclick="openPopUpEdit(${user.id});" class="btn btn-primary listBtn">Editar</button>`;
            let deleteBtn = `<button onclick="deletePaymentMethod(${user.id});" class="btn btn-primary listBtn">Excluir</button>`
            
            if (user != null)
            {
                let status;
                user.active === true ? status = "Ativo" : status = "Inativo";
                html += `<tr>
                            <td class="buttons">${editBtn}${deleteBtn}</td>
                            <td>${user.id}</td>
                            <td>${user.username}</td>
                            <td>${status}</td>
                         </tr>`;
            } 
        }
        document.getElementById("usersTableBody").innerHTML = html;
    }
    else
    {
        document.getElementById("usersTableBody").innerHTML = ""; 
    }  
}

async function addUser()
{
    if (passwordsOk())
    {
        const reqBody = JSON.stringify
        ({
            username: document.getElementById("username").value.trim(),
            password: document.getElementById("password").value.trim(),
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
            let result = await fetch(urlApi + "/createUser", requestMethod);
            if (userIsNotLogged(result)) return;
            
            let resultJson = await result.json();

            if (resultJson.success == true)
            {
                let html = `<p style="color: green; font-family: 'Poppins'">Sucesso!</p>`
                document.getElementById("popUpMessage").innerHTML = html;
                document.getElementById("saveUser").disabled = true;

                setTimeout(function()
                {document.getElementById("popUpMessage").innerHTML = ``,
                document.getElementById("username").value = ``,
                document.getElementById("password").value = ``,
                document.getElementById("passwordConfirmation").value = ``,
                document.getElementById("saveUser").disabled = false,
                closePopUps();
                }, 800);
                listAllUsers();       
            }
        }
        else
        {
            let html = `<p style="color: red; font-family: 'Poppins'">Preencha todos os campos!</p>`
            document.getElementById("popUpMessage").innerHTML = html;

            setTimeout(function(){document.getElementById("popUpMessage").innerHTML = ``}, 3000);
        }
    }
    else
    {
        let html = `<p style="color: red; font-family: 'Poppins'">As senhas devem ser iguais!</p>`
        document.getElementById("popUpMessage").innerHTML = html;

        setTimeout(function(){document.getElementById("popUpMessage").innerHTML = ``}, 3000);
    }
}

async function editUser()
{
    if (passwordsOk())
    {
        let id = getUrlParams("id");

        const requestBody = JSON.stringify 
        ({
            id : id,
            username : document.getElementById("usernameEdit").value,
            password : document.getElementById("passwordEdit").value,       
        });

        const requestOptions = 
        {
            method : "PUT",
            headers : buildHeaders(),
            body : requestBody,
            redirect : "follow"
        };

        if (filledFields())
        {
            let result = await fetch(urlApi + "/updateUser", requestOptions);
            if (userIsNotLogged(result)) return;

            let resultJson = await result.json();

            if (resultJson.success)
            {
                let html = `<p style="color: green; font-family: 'Poppins'">Sucesso!</p>`
                document.getElementById("editPopUpMessage").innerHTML = html;
        
                setTimeout(function()
                {   document.getElementById("editPopUpMessage").innerHTML = ``,
                    document.getElementById("usernameEdit").value = ``,
                    document.getElementById("passwordEdit").value = ``,
                    document.getElementById("passwordEditConfirmation").value = ``,
                    closePopUps();
                }, 800);

                listAllUsers();
            }
        }
        else
        {
            let html = `<p style="color: red; font-family: 'Poppins'">Preencha todos os campos!</p>`
            document.getElementById("editPopUpMessage").innerHTML = html;

            setTimeout(function() {document.getElementById("editPopUpMessage").innerHTML = ``}, 3000);
        }
    }
    else
    {
        let html = `<p style="color: red; font-family: 'Poppins'">As senhas devem ser iguais!</p>`
        document.getElementById("editPopUpMessage").innerHTML = html;

        setTimeout(function() {document.getElementById("editPopUpMessage").innerHTML = ``}, 3000);  
    }
}

function openPopUp() 
{
    if (isAdm())
    {
        document.querySelector(".popup").style.display = "flex";
    }
    else
    {
        alert("Somente administradores podem adicionar ou editar usuários!")
    }  
}

async function openPopUpEdit(id)
{
    if (isAdm())
    {
        let result = await fetch(urlApi + "/getUserById/" + id, {headers: buildHeaders()});
        if (userIsNotLogged(result)) return;

        let resultJson = await result.json();

        document.querySelector(".popupEdit").style.display = "flex";
        window.history.pushState(null, '', "userManagement.html?id=" + id);
        window.scrollTo(0, 0);

        document.getElementById("usernameEdit").value = resultJson[0].username;
    }
    else
    {
        alert("Somente administradores podem adicionar ou editar usuários!");    
    }     
}

function closePopUps() 
{
    document.querySelector(".popup").style.display = "none";
    document.querySelector(".popupEdit").style.display = "none";

    document.getElementById("username").value = ``,
    document.getElementById("password").value = ``,
    document.getElementById("passwordConfirmation").value = ``

    document.getElementById("usernameEdit").value = ``,
    document.getElementById("passwordEdit").value = ``,
    document.getElementById("passwordEditConfirmation").value = ``
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

function filledFields()
{
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;
    let passwordConfirmation = document.getElementById("passwordConfirmation").value;

    let usernameEdit = document.getElementById("usernameEdit").value;
    let passwordEdit = document.getElementById("passwordEdit").value;
    let passwordEditConfirmation = document.getElementById("passwordEditConfirmation").value;

    if ((username != null && username != undefined && username != "" &&
        password != null && password != undefined && password != "" &&
        passwordConfirmation != null && passwordConfirmation != undefined && passwordConfirmation != "") ||
        (usernameEdit != null && usernameEdit != undefined && usernameEdit != "" &&
        passwordEdit != null && passwordEdit != undefined && passwordEdit != "" &&
        passwordEditConfirmation != null && passwordEditConfirmation != undefined && passwordEditConfirmation != ""))
    {
        return true;
    }
    else
    {
        return false;
    }
}

function passwordsOk()
{
    let password = document.getElementById("password").value;
    let passwordConfirmation = document.getElementById("passwordConfirmation").value;
    let passwordEdit = document.getElementById("passwordEdit").value;
    let passwordConfirmationEdit = document.getElementById("passwordEditConfirmation").value;

    if ((password === passwordConfirmation && password != "") || (passwordEdit === passwordConfirmationEdit && passwordEdit != ""))
    {
        return true;
    }
    else
    {
        return false;
    }
}

function isAdm()
{
    let currentUser = localStorage.getItem("user");
    console.log(currentUser);
    if (currentUser === 'admin')
    {
        return true;
    }
    else
    {
        return false;
    }
}
