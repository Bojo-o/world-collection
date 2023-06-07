enum METHODS{
    POST = "POST",
    PUT = "PUT",
    DELETE = "DELETE"
}
/**
 * Class for posting data in json format to backend API and then retriving data or status from backend API.
 */
export class Fetch {
   
    private static parseJson(response: Response) {
        return response.json();
    }
    private static checkStatus(response: any) {
        if (response.ok) {
            return response;
        } else {
            const httpErrorInfo = {
                status: response.status,
                statusText: response.statusText,
                url: response.url,
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
    public static async postAndFetch(url: string, data: {}) {
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

    private static async sendRequest(method : METHODS,url: string, params: {}) {
        try {
            const response = await fetch(url,
                {
                    method: method,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(params)
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
    /**
     * Sends data to the certain endpoint by PUT method.
     * @param url String of url, where backend API point exists.
     * @param params Parameters for backend API route functions.
     * @returns 
     * Promise containing backend response in json format.
     */
    public static async Put(url: string, params: {}) {
       this.sendRequest(METHODS.PUT,url,params);
    }
    /**
     * Sends data to the certain endpoint by POST method.
     * @param url String of url, where backend API point exists.
     * @param params Parameters for backend API route functions.
     * @returns 
     * Promise containing backend response in json format.
     */
    public static async Post(url: string, params: {}) {
        this.sendRequest(METHODS.POST,url,params);
     }
     /**
     * Sends data to the certain endpoint by PUT method.
     * @param url String of url, where backend API point exists.
     * @param params Parameters for backend API route functions.
     * @returns 
     * Promise containing backend response in json format.
     */
    public static async Delete(url: string, params: {}) {
        this.sendRequest(METHODS.DELETE,url,params);
     }

    /**
     * Fetch data data from endpoint by GET http request.
     * @param url String of url, where backend API point exists.
     * @param  params Parameters for backend API route functions.
     * @returns 
     * Promise containing backend response in json format.
     */
    public static async Get(url: string, params : {}){
        const encodedData = encodeURIComponent(JSON.stringify(params))
        try {
            const response = await fetch(url + `?data=${encodedData}`);
            const response_1 = await this.checkStatus(response);
            return this.parseJson(response_1);
        } catch (e) {
            throw new Error(
                'There was an error. Please try again later.'
            );
        }
    }
}
