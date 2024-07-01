import { useDeleteComment, useLikeComment } from "@/lib/react-query/queriesAndMutations";
import { selectUser } from "@/redux/slice/slice";
import { Models } from "appwrite"
import { Loader } from "lucide-react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom"

type commentType = {
    user: Models.Document,
    comment: Models.Document,
}

const isLiked = (userId:string,likesList: string[]) => {
  if(likesList.includes(userId)) return true;
  return false;
}


const Comment = ({user,comment}:commentType) => {
  const currUser = useSelector(selectUser);
  const likesList = comment.likes.map((user:Models.Document) => user?.$id);

  const {mutateAsync: likeComment} = useLikeComment();
  const {mutateAsync: deleteComment, isPending: isDeleting} = useDeleteComment();
  const [likes,setLikes] = useState(likesList);

  const handleLike = (e:React.MouseEvent) => {
    e.stopPropagation();
    let newLikes = [...likesList];
    const hasLiked = newLikes.includes(user.$id); 
    if(hasLiked){
      newLikes = newLikes.filter((id)=>id!==user.$id); 
    }else{
      newLikes.push(user.$id);
      }
      setLikes(newLikes);
      likeComment({commentId: comment.$id, likesArray: newLikes});

  }


  const handleDelete = (e:React.MouseEvent) => {
    e.stopPropagation();
    deleteComment(comment.$id)


  }

  return (
    <div className="flex w-full gap-2">
    <Link to={`/profile/${user.$id}`} className="flex items-start gap-3">
      <img
        src={
          user.imageUrl ||
          "/assets/icons/profile-placeholder.svg"
        }
        alt="creator"
        className="w-8 h-8 lg:w-10 lg:h-10 rounded-full"
      />
    </Link>

    <div className="flex flex-col flex-1">
      <p className="comment-header text-light-3">{user.name}</p>
     
      <div className="comment-body text-ellipsis break-all">
        {comment.content}
      </div>

    </div>

    <div className="flex flex-col items-center gap-1 mr-5">
            <img src={ isLiked(currUser.$id,likes) ? '/assets/icons/liked.svg' : '/assets/icons/like.svg'}
             alt="like" width={20} height={20} 
            className="cursor-pointer"
            onClick={
            handleLike
            }
            />

            <p className="tiny-medium">
                {likes.length > 0 && likes.length}
            </p>

        </div>
        {
          currUser.$id === user.$id &&( isDeleting ? <Loader />:  <div className="flex flex-col items-center gap-1 mr-5">
          <img src='/assets/icons/delete.svg'
           alt="like" width={20} height={20} 
          className="cursor-pointer"
          onClick={handleDelete}
          />

      </div>
      )

        }
      


    

</div>

  )
}

export default Comment