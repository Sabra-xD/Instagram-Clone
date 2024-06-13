import {
useMutation,
useQueryClient
} from '@tanstack/react-query'
import { createPost, createUserAccount, logOut, signInAccount } from '../appwrite/api'
import { INewPost, INewUser } from '@/types'
import { QUERY_KEYS } from './queryKeys'

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



export const useCreatePost = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (post:INewPost) => createPost(post),
        onSuccess: () => {
            //Invalidates the data so that we re-fetch it again from the server.
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_RECENT_POSTS]
            })
        }
    })
}