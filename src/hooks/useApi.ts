import { useState, useCallback } from 'react';
import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { useToast } from '@/components/ui/use-toast';

interface UseApiOptions<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
  successMessage?: string;
  errorMessage?: string;
}

export function useApi<T = any>(
  config: AxiosRequestConfig,
  options: UseApiOptions<T> = {}
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  const execute = useCallback(
    async (overrideConfig?: AxiosRequestConfig) => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await axios({
          ...config,
          ...overrideConfig,
        });
        
        setData(response.data);
        
        if (options.successMessage) {
          toast({
            title: "Success",
            description: options.successMessage,
          });
        }
        
        options.onSuccess?.(response.data);
        return response.data;
      } catch (err) {
        const error = err as AxiosError;
        setError(error);
        
        toast({
          title: "Error",
          description: options.errorMessage || error.message,
          variant: "destructive",
        });
        
        options.onError?.(error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [config, options, toast]
  );

  return { data, loading, error, execute };
}
