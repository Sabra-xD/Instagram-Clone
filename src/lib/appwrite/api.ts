import { INewPost, INewUser, IUpdatePost, IUpdateUser} from "@/types";
import { account, appwriteConfig, avatars, databases, storage } from "./config";
import { ID, ImageGravity, Query } from "appwrite";


export async function createUserAccount(user: INewUser){
    try{
        const newAccount = await account.create(
            ID.unique(),
            user.email,
            user.password,
            user.name,
        );
        if(!newAccount) throw Error;

        //This just sets the user avatar to their initials.
        const avatarUrl = avatars.getInitials(user.name);

        const newUser = await saveUserToDB({
            accountId: newAccount.$id,
            name: newAccount.name,
            email: newAccount.email,
            username: user.username,
            imageUrl: avatarUrl
        })

        
        return newUser;

    }catch(error){
        console.log(error);

    }
}


export async function saveUserToDB(user: {
    accountId: string;
    email:string;
    name:string;
    imageUrl:URL;
    username?:string;
}){
    try{
        const newUser = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            ID.unique(),
            user
        );
        return newUser;
    }catch(error){
        console.log(error);
    }

}


export async function signInAccount(user:{email:string; password:string}){

    try{
        const session = await account.createEmailPasswordSession(user.email,user.password);
        return session;
    }catch(error){
        console.log(error);
    }
}



export async function getCurrentUser(){
    try{
        const currentAccount = await account.get();
        if(!currentAccount) throw Error;
        const currentUser= await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            [Query.equal('accountId',currentAccount.$id)]
        )

        if(!currentUser) throw Error;
        

        return currentUser.documents[0];

    }catch(error){
        console.log(error);
    }
}



export async function logOut(){
    try{
        await account.deleteSession('current');
        localStorage.clear();
    }catch(error){
        console.log(error);
    }
}




export async function createPost(post: INewPost){
 
   try{
    const uploadedFile = await uploadFile(post.file [0])
    //Uploading image to storage.
    if(!uploadedFile){
        throw Error;
    }

    // Getting the file URL To attach to our post.
    const fileUrl = await getFilePreview(uploadedFile.$id);
    if(!fileUrl){
        //Then the file was not uploaded properly, I think we'd need to delete it.
        deleteFile(uploadedFile.$id);
        throw Error;
    }

    //Convert tags to an array?
    const tags = post.tags?.replace(/ /g,'').split(',') || [];

    //Save post to DB   
    const newPost = await databases.createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.postCollectionId,
        ID.unique(),
        {
            creator: post.userId,
            caption: post.caption,
            imageUrl: fileUrl,
            imageId: uploadedFile.$id,
            location: post.location,
            tags: tags,
        }
    )

    if(!newPost){
        await deleteFile(uploadedFile.$id);
        throw Error;
    }

    return newPost;    
   }catch(error){
    console.log(error);
   }
}

export async function uploadFile(file: File){
    try{
        const uploadedFile = storage.createFile(
            appwriteConfig.storageId,
            ID.unique(),
            file,
        );
        return uploadedFile;

    }catch(error){
        console.log(error);
    }
}

export async function deleteFile(fileId: string){
    try{
        //Here we need to delete a file using its id
        storage.deleteFile(appwriteConfig.storageId,
            fileId
        )

        return {status: 'ok'};
    }catch(error){
        console.log(error);
    }
}


export async function getFilePreview(fileId: string){
    try{
        const fileUrl = storage.getFilePreview(appwriteConfig.storageId,
            fileId,
            2000,
            2000,
            ImageGravity.Top,
            100,
            );
            return fileUrl
    }catch(error){
        console.log(error);
    }
}

export async function getRecentPosts(){
    try{
        const posts = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.postCollectionId,
            [Query.orderDesc('$createdAt'),Query.limit(20)]
        )
        if(!posts) throw Error;
        return posts;
    }catch(error){
        console.log(error);
    }
}


export async function likePost(postId: string, likesArray: string[]){
    try{
        const updatedPost = await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.postCollectionId,
            postId,
            {
                likes: likesArray
            }
        )
        if(!updatedPost) throw Error;
        return updatedPost
    }catch(error){
        console.log(error)
    }
}

export async function savePost(postId: string, userId: string){
    try{
        const updatedPost = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.savesCollectionId,
            ID.unique(),
            {
                user: userId,
                post: postId,
            }
        )
        if(!updatedPost) throw Error;
        return updatedPost
    }catch(error){
        console.log(error)
    }
}

export async function deleteSavedPost(savedRecordId: string){
    try{
        const statusCode = await databases.deleteDocument(
            appwriteConfig.databaseId,
            appwriteConfig.savesCollectionId,
            savedRecordId
        )
        if(!statusCode) throw Error;
        return statusCode
    }catch(error){
        console.log(error)
    }
}


export async function getPostById(postId:string){
    try{
        const post = await databases.getDocument(appwriteConfig.databaseId,appwriteConfig.postCollectionId,postId);
        if(!post) throw Error;
        console.log("The post we got is: ",post);
        
        return post;
    }catch(error){
        console.log(error);
    }
}


export async function updatePost(post: IUpdatePost){
    
    const hasFileBeenUpdated = post.file.length > 0;

    let image = {
        imageUrl: post?.imageUrl,
        imageId: post?.imageId,
    }

   try{
    
    if(hasFileBeenUpdated){

        const uploadedFile = await uploadFile(post.file [0])
        if(!uploadedFile){
            throw Error;
        }
    
        const fileUrl = await getFilePreview(uploadedFile.$id);
        if(!fileUrl){
            deleteFile(uploadedFile.$id);
            throw Error;
        }

        image = {...image,imageUrl: fileUrl, imageId: uploadedFile.$id};
    
    }

    const tags = post.tags?.replace(/ /g,'').split(',') || [];

    const updatedPost = await databases.updateDocument(
        appwriteConfig.databaseId,
        appwriteConfig.postCollectionId,
        post.postId,
        {
            caption: post?.caption,
            imageUrl: image?.imageUrl,
            imageId: image?.imageId,
            location: post?.location,
            tags: tags,
        }
    )

    if(!updatedPost){
        await deleteFile(image.imageId);
        throw Error;
    }


    return updatedPost;

   }catch(error){
    console.log(error);
   }
}



export async function updateUser(user: IUpdateUser){
    const hasFileChanged = user.file?.length > 0;
    let image = {
        imageUrl: user?.imageUrl,
        imageId: user?.imageId,
    }


    try{

        if(hasFileChanged){
            const uploadedFile = await uploadFile(user.file[0]);
            if(!uploadedFile) throw Error;
            const fileUrl = await getFilePreview(uploadedFile.$id);
            if(!fileUrl){
                deleteFile(uploadedFile.$id);
                throw Error;
            }

            image= {
                ...image,
                imageUrl: fileUrl,
                imageId: uploadedFile.$id,
            }
        }


        const updateUser = await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            user.userId,
            {
                name: user.name,
                username: user.username,
                bio: user.bio,
                email: user.email,
                imageUrl: image.imageUrl,
                imageId: image.imageId,
            }
        );

        if(!updateUser){
            throw Error;
        }
        return updateUser;

    }catch(error){
        console.log(error);
    }

}

export async function deletePost(postId: string, imageId: string){

    try{
        //We also need to delete shit from the storage.
        const storageStatusCode = await storage.deleteFile(appwriteConfig.storageId,imageId);
        if(!storageStatusCode) throw Error;
        const statusCode = await databases.deleteDocument(appwriteConfig.databaseId,appwriteConfig.postCollectionId,postId);
        if(!statusCode) throw Error;

        return statusCode;


    }catch(error){
        console.log(error);
    }

}


//Understand this function better
export async function getInfinitePosts({pageParam} : {pageParam:number}){
  
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const queries: any[] = [Query.orderDesc('$updatedAt'), Query.limit(10)]
    
    if(pageParam){
        queries.push(Query.cursorAfter(pageParam.toString()))
    }

    try{
        const posts = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.postCollectionId,
            queries
        );

        if(!posts) throw Error;

        return posts;
        
    }catch(error){
        console.log(error);
    }
}

export async function searchPosts(searchTerm:string){
    
    try{
        const posts = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.postCollectionId,
            [Query.search('caption',searchTerm)]
        );

        if(!posts) throw Error;

        return posts;
        
    }catch(error){
        console.log(error);
    }
}


export async function getSavedPosts(){

    try{
        
        const currentUser = await getCurrentUser();

        if(!currentUser) throw Error;
        const posts = await databases.listDocuments(appwriteConfig.databaseId,
            appwriteConfig.savesCollectionId,
            [Query.equal("user",currentUser.$id)]
        )

        if(!posts) throw Error;

        const postList = [];
        for (const info of posts.documents) {
            postList.push(info.post);
        }


        if(!postList) throw Error;


        return postList;

    }catch(error){
        console.log(error);
    }


}


export async function getAllUsers(){
    try{

        const currentAccount = await account.get();
        if(!currentAccount) throw Error;

        const users = await databases.listDocuments(appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            [Query.notEqual("accountId",currentAccount.$id), Query.orderDesc("$createdAt"), Query.limit(10)])

        

        return users.documents;
    }catch(error){
        console.log(error);
    }
}


export async function getUserById(id:string){
    try{
        const user = await databases.getDocument(appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            id
        )
        if(!user) throw Error;

        return user;

    }catch(error){
        console.log(error);
    }
}


export async function getRelatedPosts(userId:string, currentPost: string){


    try{
        const relatedPosts = await databases.listDocuments(appwriteConfig.databaseId,
            appwriteConfig.postCollectionId,
            [Query.equal('creator',userId), Query.notEqual("$id",currentPost)]
        );
        return relatedPosts;

    }catch(error){
        console.log(error);
    }

}



export async function addComment(postId: string,content: string){

    try{

        const currentUser = await getCurrentUser();
        
        if(!currentUser) throw Error;

        console.log("The current user id is: ",currentUser.$id, "The post id is: ",postId , "The content is: ",content);

        const updatedComment = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.commentsCollectionId,
            ID.unique(),
            {
                users: currentUser.$id,
                posts: postId,
                content: content,
            }
        )
        if(!updatedComment) throw Error;
        return updatedComment
    }catch(error){
        console.log(error)
    }
}


export async function likeComment(commentId: string,likesArray: string[]){

    console.log("The commentId is: ",commentId, "The likes array is: ",likesArray);
    try{
     const updatedComment = await databases.updateDocument(appwriteConfig.databaseId,
            appwriteConfig.commentsCollectionId,
            commentId,
            {
                likes: likesArray,
            }
        );

        if(!updatedComment) throw Error;
        return updatedComment;
    }catch(error){
        console.log(error);
    }
}

export async function deleteComment(commentId:string){
    try{
        const deletedComment = await databases.deleteDocument(appwriteConfig.databaseId,
            appwriteConfig.commentsCollectionId,
            commentId,
        );

        if(!deletedComment) throw Error;

        return deletedComment;
    }catch(error){
        console.log(error);
    }
}


export async function searchUsers(searchTerm: string){
    try{
        const users = await databases.listDocuments(appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            [Query.search('username',searchTerm)]
        );
        
        if(!users) throw Error;

        return users;
    }catch(error){
        console.log(error);
    }
}


export async function followUser(currentUserId: string,followingArray: string[],targetUserId: string ,followersArray: string[]){

    console.log(`currentUserId: ${currentUserId}, followingArray: ${followingArray}, targetUserId: ${targetUserId}, followersArray: ${followersArray}`);

    try{
        const currUser = await databases.updateDocument(appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            currentUserId,
            {
                following: followingArray,
            }
        );
        if(!currUser) throw Error;
        console.log("The currUser is: ",currUser);
        const targetUser = await databases.updateDocument(appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            targetUserId,
            {
                followers: followersArray,
            }
        );

        //It should delete it from the currUser if it throws this error but we are keeping it REAL simple.
        if(!targetUser) throw Error;
        console.log("The target user is: ",targetUser);
        return targetUser;

    }catch(error){
        console.log(error);
    }
}


export async function fetchUsersList(usersList: string[]) {
    try {
      const usersInformationPromises = usersList.map((userId) => getUserById(userId));
      
      const usersInformation = await Promise.all(usersInformationPromises);
  
      if (!usersInformation) throw new Error("No user information found");
        
      return usersInformation;
  
    } catch (error) {
      console.log(error);
    }
  }


