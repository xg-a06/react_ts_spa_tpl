import { useQuery, useMutation, useQueryClient } from 'react-query';
import { login, logout, checkLogin } from '@/services/api/user';

export const USER_CACHE_KEY = 'user';

const useLogin = () => {
  const queryClient = useQueryClient();
  return useMutation(login, {
    onSuccess: data => {
      queryClient.setQueryData(USER_CACHE_KEY, data);
    },
  });
};

const useCheckLogin = () => useQuery(USER_CACHE_KEY, checkLogin, { suspense: true });

const useLogout = () => {
  const queryClient = useQueryClient();
  return useQuery(USER_CACHE_KEY, logout, {
    enabled: false,
    onSuccess: () => {
      queryClient.setQueryData(USER_CACHE_KEY, undefined);
    },
  });
};

export { useLogin, useCheckLogin, useLogout };
