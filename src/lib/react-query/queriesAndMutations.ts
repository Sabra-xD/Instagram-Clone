import {
useMutation
} from '@tanstack/react-query'
import { createUserAccount, logOut, signInAccount } from '../appwrite/api'
import { INewUser } from '@/types'

//Simply for data fetch and mutation, caching and infinite scroll.

//What does this do?
export const useCreateUserAccountMutation = () => {
    return useMutation({
        mutationFn: (user: INewUser) => createUserAccount(user)
    })
}


export const useSignInAccount = () => {
    
    return useMutation({
        mutationFn: (user: {email:string; password:string}) => signInAccount(user)
    })
    
}


export const useSignOut = () => {
    
    return useMutation({
        mutationFn: logOut
    })
    
}