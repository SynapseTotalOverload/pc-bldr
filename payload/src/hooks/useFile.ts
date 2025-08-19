import { useCallback, useEffect, useRef, useState } from "react";
import { FileService } from "@/services/file";

interface GetDeleteParams {
    key?: string;
    url?: string;
}

interface UseFileResult {
    imageUrl: string | null;
    upload?: (file: File) => Promise<any>; // not implemented here
    fetch: (params: GetDeleteParams) => Promise<string | null>; // returns object URL
    remove?: (params: GetDeleteParams) => Promise<void>;
    loading: boolean;
    error: unknown;
}

export function useFile(): UseFileResult {
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<unknown>(null);

    const objectUrlRef = useRef<string | null>(null);
    const fileServiceRef = useRef<FileService | null>(null);

    if (!fileServiceRef.current) {
        fileServiceRef.current = new FileService();
    }

    const fetch = useCallback(async (params: GetDeleteParams) => {
        setLoading(true);
        setError(null);
        try {
            const blob = await fileServiceRef.current!.getFile(params);
            const objectUrl = URL.createObjectURL(blob);
            if (objectUrlRef.current) {
                URL.revokeObjectURL(objectUrlRef.current);
            }
            objectUrlRef.current = objectUrl;
            setImageUrl(objectUrl);
            return objectUrl;
        } catch (err) {
            setError(err);
            return null;
        } finally {
            setLoading(false);
        }
    }, []);


    useEffect(() => {
        return () => {
            if (objectUrlRef.current) {
                URL.revokeObjectURL(objectUrlRef.current);
            }
        };
    }, []);

    return { imageUrl, fetch, loading, error } as UseFileResult;
}
