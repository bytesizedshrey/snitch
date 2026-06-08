import {setError,setLoading,setUser} from '../state/auth.slice.js'
import {register} from '../service/auth.api.js'

export const useAuth = () => {
    async function handleRegister({email,contact,password,fullname}) {
        const data = await register({email,contact,password,fullname})
    }

    return {}
}