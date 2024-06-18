import { INewPost, INewUser, IUpdatePost} from "@/types";
import { account, appwriteConfig, avatars, databases, storage } from "./config";
import { ID, ImageGravity, Query } from "appwrite";


export async function createUserAccount(user: INewUser){
    console.log(user);
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
        console.log("Error in the createUSerAccount: ",error);

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
        console.log("The user saved to DB: ",newUser);
        return newUser;
    }catch(error){
        console.log(error);
    }

}


export async function signInAccount(user:{email:string; password:string}){

    try{
        const session = await account.createEmailPasswordSession(user.email,user.password);
        console.log("The current session is: ",session);
        return session;
    }catch(error){
        console.log(error);
    }
}



export async function getCurrentUser(){
    try{
        const currentAccount = await account.get();
        console.log("The current Account is: ",currentAccount);
        if(!currentAccount) throw Error;
        const currentUser= await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            [Query.equal('accountId',currentAccount.$id)]
        )

        if(!currentUser) throw Error;
        
        console.log("The current user is: ",currentUser.documents[0]);

        return currentUser.documents[0];

    }catch(error){
        console.log(error);
    }
}



export async function logOut(){
    try{
        console.log("Logging out...")
        await account.deleteSession('current');
        localStorage.clear();
        console.log("Logged out..");
    }catch(error){
        console.log("Error in the logOut: ",error);
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
           console.log("The url we got from the function is: ",fileUrl);
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
        console.log(" The post insid ethe getPostByID: ", post);
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

    console.log("The updated post is: ",updatePost);

    return updatedPost;

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

        console.log("The postList is: ",postList);

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

        
        console.log("The users we found are: ",users);

        return users.documents;
    }catch(error){
        console.log(error);
    }
}