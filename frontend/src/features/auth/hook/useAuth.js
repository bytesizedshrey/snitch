import { useCallback } from 'react';
import { setError, setLoading, setUser } from '../state/auth.slice.js';
import { register, login, fetchMe, logoutUser } from '../service/auth.api.js';
import { useDispatch, useSelector } from 'react-redux';

export const useAuth = () => {
    const dispatch = useDispatch();
    const { user, loading, error } = useSelector((state) => state.auth);

    const handleRegister = useCallback(async ({ email, contact, password, fullname, isSeller = false }) => {
        dispatch(setLoading(true));
        dispatch(setError(null));
        try {
            const data = await register({ email, contact, password, fullname, isSeller });
            dispatch(setUser(data.user || data));
            dispatch(setLoading(false));
            return { success: true, data };
        } catch (err) {
            const data = err.response?.data;
            let message = data?.message;
            if (!message && data?.errors && Array.isArray(data.errors)) {
                message = data.errors.map(e => e.msg).join(', ');
            }
            if (!message) {
                message = err.message || "Failed to register";
            }
            dispatch(setError(message));
            dispatch(setLoading(false));
            return { success: false, error: message };
        }
    }, [dispatch]);

    const handleLogin = useCallback(async ({ email, password }) => {
        dispatch(setLoading(true));
        dispatch(setError(null));
        try {
            const data = await login({ email, password });
            dispatch(setUser(data.user || data));
            dispatch(setLoading(false));
            return { success: true, data };
        } catch (err) {
            const data = err.response?.data;
            let message = data?.message;
            if (!message && data?.errors && Array.isArray(data.errors)) {
                message = data.errors.map(e => e.msg).join(', ');
            }
            if (!message) {
                message = err.message || "Failed to login";
            }
            dispatch(setError(message));
            dispatch(setLoading(false));
            return { success: false, error: message };
        }
    }, [dispatch]);

    const handleFetchMe = useCallback(async () => {
        dispatch(setLoading(true));
        try {
            const data = await fetchMe();
            dispatch(setUser(data.user || data));
            dispatch(setLoading(false));
            return { success: true, data };
        } catch (err) {
            dispatch(setUser(null));
            dispatch(setLoading(false));
            return { success: false, error: err.message };
        }
    }, [dispatch]);

    const handleLogout = useCallback(async () => {
        dispatch(setLoading(true));
        try {
            await logoutUser();
            dispatch(setUser(null));
            dispatch(setLoading(false));
            return { success: true };
        } catch (err) {
            dispatch(setLoading(false));
            return { success: false, error: err.message };
        }
    }, [dispatch]);

    return { handleRegister, handleLogin, handleFetchMe, handleLogout, user, loading, error };
};