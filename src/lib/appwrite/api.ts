import { INewPost, INewUser } from "@/types";
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
        if(!currentAccount) throw Error;
        const currentUser= await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            [Query.equal('accountId',currentAccount.$id)]
        )

        if(!currentUser) throw Error;
        // store.dispatch(setUser(currentUser));

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
        return true;
    }catch(error){
        console.log("Error in the logOut: ",error);
    }
}




export async function createPost(post: INewPost){
 
    console.log("Entered the createPost");
    const uploadedFile = await uploadFile(post.file [0])
    //Uploading image to storage.
    if(!uploadedFile){
        throw Error;
    }
    console.log("File was uploaded.")
    console.log("The post owner is: ",post.userId);

    // Getting the file URL To attach to our post.
    const fileUrl = await getFilePreview(uploadedFile.$id);
    if(!fileUrl){
        //Then the file was not uploaded properly, I think we'd need to delete it.
        deleteFile(uploadedFile.$id);
        throw Error;
    }
    console.log("We have the URL which is: ",fileUrl)


    //Convert tags to an array?
    const tags = post.tags?.replace(/ /g,'').split(',') || [];

    //Save post to DB
    console.log("We should be creating the document");
    console.log("The fileURL is: ",fileUrl);
   
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
    console.log("Dcoument created")


    if(!newPost){
        await deleteFile(uploadedFile.$id);
        throw Error;
    }

    return newPost;    
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
    
}