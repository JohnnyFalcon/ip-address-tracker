import axios from "axios";


export type Data = {
    ip: string,
    location: {
        country: string,
        region: string,
        city: string,
        lat: number,
        lng: number,
        postalCode: string,
        timezone: string,
        geonameId: number
    },
    domains: string[],
    as: {
        asn: number,
        name: string,
        route: string,
        domain: string,
        type: string
    },
    isp: string
}

export const getData = async (input: string | null, search: string | null) => {
    const searchForm: string = input ? `&${search}=${input}` : '';
    try {
        const { data, status } = await axios.get<Data>(
            `https://geo.ipify.org/api/v2/country,city?apiKey=at_Ig7kit2HFWjF0ay7u4LNE4lMBi23q${searchForm}`,
            {
                headers: {
                    Accept: "application/json"
                }
            }
        );

        console.log("response status is: ", status);

        return data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.log("error message: ", error.message);
            return error.message;
        } else {
            console.log("unexpected error: ", error);
            return "An unexpected error occurred";
        }
    }
};