import { instance } from "./axios";

export const fileApi = {
    postFile: async (file: File) => {
        const formData = new FormData();
        formData.append("file", file);

        const response = await instance.post("/files", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        return response.data;
    },
    getFile: async (params: { key?: string; url?: string }) => {
        const response = await instance.get("/files", {
            params,
            responseType: "blob",
        });
        return response.data as Blob;
    },
    deleteFile: async (params: { key?: string; url?: string }) => {
        const response = await instance.delete("/files", { params });
        return response.data;
    }
}
export const {
    postFile,
    getFile,
    deleteFile
} = fileApi;
