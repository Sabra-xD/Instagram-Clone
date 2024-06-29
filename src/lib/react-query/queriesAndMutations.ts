import {
    useInfiniteQuery,
useMutation,
    useQuery,
useQueryClient
} from '@tanstack/react-query'
import { createPost, createUserAccount, deletePost, deleteSavedPost, getAllUsers, getCurrentUser, getInfinitePosts, getPostById, getRecentPosts, getRelatedPosts, getSavedPosts, getUserById, likePost, logOut, savePost, searchPosts, signInAccount, updatePost, updateUser } from '../appwrite/api'
import { INewPost, INewUser, IUpdatePost, IUpdateUser } from '@/types'
import { QUERY_KEYS } from './queryKeys'


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


export const useGetPostById = (postId?:string) => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_POST_BY_ID, postId],
        queryFn: () => getPostById(postId ? postId : ""),
        enabled: !!postId,
        
      })
}


export const useUpdatePost = () =>{
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (post:IUpdatePost) => updatePost(post),
        onSuccess: (data) => {
                queryClient.invalidateQueries({
                    queryKey: [QUERY_KEYS.GET_POST_BY_ID, data?.$id],
                })
            }
    })
}


export const useDeletePost = () =>{
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({postId,imageId} : {postId: string,imageId:string}) => deletePost(postId,imageId),
        onSuccess: () => {
                queryClient.invalidateQueries({
                    queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
                })
            }
    })
}


export const useGetPosts = () => {

    return useInfiniteQuery({
        queryKey: [QUERY_KEYS.GET_INFINITE_POSTS],
        queryFn: getInfinitePosts,

        getNextPageParam: (lastPage) => {
            if(lastPage && lastPage.documents.length === 0) return null;

            const lastId = lastPage?.documents[lastPage?.documents.length -1].$id;

            return lastId;
        }

    })

}


export const useSerachPosts = (searchTerm: string) => {
    return useQuery({
        queryKey: [QUERY_KEYS.SEARCH_POSTS, searchTerm],
        queryFn: () => searchPosts(searchTerm),
        enabled: !!searchTerm, //When does it automatically refetches?
    })
}


export const useGetSavedPosts = () => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_SAVED_POSTS],
        queryFn: getSavedPosts,
    })
}


export const useGetAllUsers = () => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_ALL_USERS],
        queryFn: getAllUsers,
    })
}


export const useGetUserById = (id:string) => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_USER_BY_ID,id],
        queryFn: () => getUserById(id),
        enabled: !!id,
    })
}


export const useUpdateUser = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (user: IUpdateUser) => updateUser(user),
        onSuccess: (data) => {
                queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_CURRENT_USER,QUERY_KEYS.GET_USER_BY_ID,data?.$id],
            });
        }
    })
}


export const useGetRelatedPosts = (userId: string, postId: string) => {  
     return useQuery({
        queryKey: [QUERY_KEYS.GET_RELATED_POSTS,userId],
        queryFn: () => getRelatedPosts(userId,postId), 
})}