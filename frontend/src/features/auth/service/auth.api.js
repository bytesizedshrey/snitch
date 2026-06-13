import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || "";

const authApiInstance = axios.create({
    baseURL : `${API_URL}/api/auth`,
    withCredentials : true,
})

export async function register({email,contact,password,fullname,isSeller}) {
     const response = await authApiInstance.post('/register',{
        email,
        contact,
        password,
        fullname,
        isSeller
     })
     return response.data
}

export async function login({email,password}) {
    const response = await authApiInstance.post('/login',{
        email,password
    })

    return response.data
}

export async function fetchMe() {
    const response = await authApiInstance.get('/me')
    return response.data
}

export async function logoutUser() {
    const response = await authApiInstance.post('/logout')
    return response.data
}