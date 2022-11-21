
const url = "API/search/classes";

function checkStatus(response: any){
    if (response.ok){
        return response;
    }else {
        const httpErrorInfo = {
            status : response.status,
            statusText : response.statusText,
            url : response.url,
        }

        console.log(`log server http error: ${JSON.stringify(httpErrorInfo)}`);
        let errorMessage = "Something went wrong...";
        throw new Error(errorMessage);
    }
}
const SearchAPI = {
    get(searchWord : string){
        return fetch(`${url}`)
        .then(checkStatus)
        .then((response : any) => response.json())
        .catch((e : TypeError) => {
            console.log('log client error ' + e);
            throw new Error(
            'There was an error retrieving the data. Please try again.'
        );
        })
    }
}

export {SearchAPI}