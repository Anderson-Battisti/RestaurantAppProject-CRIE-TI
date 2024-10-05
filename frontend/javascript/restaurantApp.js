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