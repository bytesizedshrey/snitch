import {setError,setLoading,setUser} from '../state/auth.slice.js'
import {register} from '../service/auth.api.js'
import  {useDispatch, useSelector} from 'react-redux'

export const useAuth = () => {
    const dispatch = useDispatch()
    const { user, loading, error } = useSelector((state) => state.auth)

    async function handleRegister({email, contact, password, fullname, isSeller = false}) {
        dispatch(setLoading(true))
        dispatch(setError(null))
        try {
            const data = await register({email, contact, password, fullname, isSeller})
            dispatch(setUser(data.user || data))
            dispatch(setLoading(false))
            return { success: true, data }
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
    }

    return { handleRegister, user, loading, error }
}