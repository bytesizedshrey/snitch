import {setError,setLoading,setUser} from '../state/auth.slice.js'
import {register} from '../service/auth.api.js'
import  {useDispatch} from 'react-redux'

export const useAuth = () => {
    //It sends an action to Redux.
    const dispatch = useDispatch()

    async function handleRegister({email,contact,password,fullname,isBuyer,isSeller = false}) {

        const data = await register({email,contact,password,fullname})
        //dispatch(...) sends this package to Redux 📦
        dispatch(setUser(data.user))

    }

    return {handleRegister}
}