import { instance } from "./axios";
import { CountriesResponse, Country } from "@/types/country";

export interface GetCountriesParams {
    skip?: number;
    limit?: number;
    query?: string;
}

export const countriesApi = {
    getCountries: async (
        params: GetCountriesParams = {}
    ): Promise<CountriesResponse> => {
        const requestParams = {
            skip: params.skip ?? 0,
            limit: params.limit ?? 25,
            query: params.query ?? undefined,
        };

        const { data } = await instance.get<CountriesResponse>("/countries", {
            params: requestParams,
        });

        return data;
    },
};