function buildHeaders()
{
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("user", localStorage.getItem("user"));
    myHeaders.append("password", localStorage.getItem("password"));

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