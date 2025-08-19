import { useCallback, useEffect, useRef, useState } from "react";
import { deleteFile, getFile, postFile } from "../lib/file-api";

interface GetDeleteParams {
    key?: string;
    url?: string;
}

interface UseFileResult {
    imageUrl: string | null;
    upload: (file: File) => Promise<any>; // returns record from backend
    fetch: (params: GetDeleteParams) => Promise<string | null>; // returns object URL
    remove: (params: GetDeleteParams) => Promise<void>;
    loading: boolean;
    error: unknown;
}

export function useFile(): UseFileResult {
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<unknown>(null);

    const objectUrlRef = useRef<string | null>(null);

    const upload = useCallback(async (file: File) => {
        setLoading(true);
        setError(null);
        try {
            const record = await postFile(file);    
            return record;
        } catch (err) {
            setError(err);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const fetch = useCallback(async (params: GetDeleteParams) => {
        setLoading(true);
        setError(null);
        try {
            const blob = await getFile(params);
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

    const remove = useCallback(async (params: GetDeleteParams) => {
        setLoading(true);
        setError(null);
        try {
            await deleteFile(params);
            if (objectUrlRef.current) {
                URL.revokeObjectURL(objectUrlRef.current);
                objectUrlRef.current = null;
            }
            setImageUrl(null);
        } catch (err) {
            setError(err);
            throw err;
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

    return { imageUrl, upload, fetch, remove, loading, error };
}
