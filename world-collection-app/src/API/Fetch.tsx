/**
 * Class for posting data in json format to backend API and then retriving data or status from backend API.
 */
export class Fetch{
    private static parseJson(response : Response){
        return response.json();
    }
    private static checkStatus(response: any){
        if (response.ok){
            return response;
        }else {
            const httpErrorInfo = {
                status : response.status,
                statusText : response.statusText,
                url : response.url,
            }
            console.log(`log server http error: ${JSON.stringify(httpErrorInfo)}`);
            throw new Error("Error occurred during fetching data");
        }
    }
    /**
     * Posts data to the given url, then it fetches backend response.
     * @param url String of url, where backend API point exists.
     * @param data Data, which will be posted to the given url. Parameters for backend API route functions.
     * @returns 
     * Promise containing backend response in json format.
     */
    public static async postAndFetch(url : string,data : {}){
        try {
            const response = await fetch(url,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data)
                }
            );
            const response_1 = await this.checkStatus(response);
            return this.parseJson(response_1);
        } catch (e) {
            throw new Error(
                'There was an error. Please try again later.'
            );
        }
    }
}
