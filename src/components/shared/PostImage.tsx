import { Link } from "react-router-dom"
import { Models } from "appwrite"

type PostImage = {
    post: Models.Document,
}


const PostImage = ({post}:PostImage) => {
  return (
    
    <Link to={`/posts/${post.$id}`}>
        <img src={post.imageUrl || `/assets/icons/profile-placeholder.svg`} className="post_img" alt="post_img"/>
    </Link>

  )
}

export default PostImage