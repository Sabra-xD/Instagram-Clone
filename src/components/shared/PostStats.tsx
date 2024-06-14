import { useDeleteSavePost, useGetCurrentUser, useLikePost, useSavePost } from "@/lib/react-query/queriesAndMutations";
import { PostStatsProps } from "@/types";
import { Models } from "appwrite";
import React, { useEffect, useState } from "react";
import Loader from "./Loader";
import { isLiked } from "@/lib/utils";





const PostStats = ({post,userId} : PostStatsProps) => {
    const likesList = post.likes.map((user:Models.Document) => user.$id);

    const [likes,setLikes] = useState(likesList);
   
    const {mutateAsync: likePost} = useLikePost();
    const {mutateAsync: savePost, isPending: isSaving} = useSavePost();
    const {mutateAsync: deleteSavedPost, isPending: isDeleteing} = useDeleteSavePost();
    const {data: currentUser} = useGetCurrentUser();
    const [isSaved,setIsSaved] = useState(false);

    const savedPostRecord = currentUser?.save.find((record: Models.Document) => record.post.$id === post.$id);

    useEffect(()=>{
        setIsSaved(savedPostRecord?true:false);
    },[currentUser, savedPostRecord]);

    const handleLikePost = (e: React.MouseEvent) => {
        e.stopPropagation();
        let newLikes = [...likes];
        const hasLiked = newLikes.includes(userId);
        if(hasLiked) {
            newLikes = newLikes.filter((id) => id!==userId);
        }else{
            newLikes.push(userId);
        }
        setLikes(newLikes);
        likePost({postId: post.$id, likesArray: newLikes});
    }


    const handleSavePost = (e: React.MouseEvent) => {
        e.stopPropagation();
        if(savedPostRecord) {
            deleteSavedPost(savedPostRecord.$id);
            setIsSaved(false);
        }else{
            savePost({postId: post.$id, userId});
            setIsSaved(true);
        }
    }

  return (
    <div className="flex justify-between items-center z-20">
        <div className="flex gap-2 mr-5">
            <img src={isLiked(likes,userId) ? `/assets/icons/liked.svg` : `/assets/icons/like.svg`} alt="like" width={20} height={20} 
            onClick={handleLikePost}
            className="cursor-pointer"/>

            <p className="small-medium lg:base-medium">
                {likes.length}
            </p>

        </div>

        <div className="flex gap-2">
            {
                isSaving || isDeleteing ?  <Loader /> : (<img src={isSaved ? "/assets/icons/saved.svg" : "/assets/icons/save.svg"} alt="like" width={20} height={20} 
                    onClick={handleSavePost}
                       className="cursor-pointer"/>)
            }
        </div>
    </div>
  )
}

export default PostStats