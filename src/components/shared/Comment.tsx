import { Models } from "appwrite"
import { Link } from "react-router-dom"

type commentType = {
    user: Models.Document,
    comment: string,
}

const Comment = ({user,comment}:commentType) => {
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
        {comment}
      </div>

    </div>

</div>

  )
}

export default Comment