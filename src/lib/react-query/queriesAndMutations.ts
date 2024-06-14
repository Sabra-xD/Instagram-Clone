import {
useMutation,
    useQuery,
useQueryClient
} from '@tanstack/react-query'
import { createPost, createUserAccount, deleteSavedPost, getCurrentUser, getRecentPosts, likePost, logOut, savePost, signInAccount } from '../appwrite/api'
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

export const useGetRecentPosts = () => {
    //useQuery is used when fetching data from the server, used for GET requests.
    //And caching it locally.
    //Use mutation is used for POST,PUT,Delete or PATCH requests.
    return useQuery({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
        queryFn: getRecentPosts,
    })
}


export const useLikePost = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({postId, likesArray} : {postId: string, likesArray: string[]}) => likePost(postId,likesArray),
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_POST_BY_ID, data?.$id]
            })
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_RECENT_POSTS, data?.$id]
            })
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_POSTS, data?.$id]
            })
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_CURRENT_USER, data?.$id]
            })
        }
    })
}



export const useSavePost = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({postId, userId} : {postId: string, userId: string}) => savePost(postId,userId),
       
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_RECENT_POSTS]
            })
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_POSTS]
            })
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_CURRENT_USER]
            })
        }
    })
}


export const useDeleteSavePost = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (savedRecordId:string) => deleteSavedPost(savedRecordId),
       
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_RECENT_POSTS]
            })
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_POSTS]
            })
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_CURRENT_USER]
            })
        }
    })
}


export const useGetCurrentUser = () => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER],
        queryFn: getCurrentUser,
    })
}
