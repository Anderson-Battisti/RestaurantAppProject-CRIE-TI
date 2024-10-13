const urlApi = "http://localhost:4000";

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
            let deleteBtn = `<button onclick="deleteUser(${user.id});" class="btn btn-primary listBtn">Excluir</button>`
            
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

async function deleteUser(id)
{
    const requestBody = JSON.stringify({id: id});
    const options = {method: "DELETE", redirect: "follow", headers: buildHeaders(), body: requestBody};

    if (isAdm())
    {
        if (confirm("Deseja realmente excluír esse usuário?"))
        {
            let result = await fetch(urlApi + "/deleteUser", options);
            if (userIsNotLogged(result)) return;
            let resultJson = await result.json();
    
            if (resultJson.success === true)
            {
                alert("Usuário excluído com sucesso!");
                listAllUsers();
            }
            else
            {
                alert("Ocorreu um erro ao excluir o usuário. Tente novamente mais tarde ou contate o administrador.");
            }
        }
    }
    else
    {
        alert("Somente administradores podem excluir usuários!");
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