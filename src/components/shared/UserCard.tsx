import { Models } from "appwrite";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import React from "react";

const UserCard = ({user}:{user:Models.Document}) => {

  const handleFollow = (e:React.MouseEvent) => {
    e.stopPropagation();
    //ToDo
    //Handle the Follow accordingly if we already follow that user or not.
    //Keep in mind, we are displaying the first 10 users which is not the best thing to do.
  }

  return (

    <Link to={`/profile/${user.$id}`} className="user-card">
        <div className="flex-center flex-col gap-5">
            <img src={user.imageUrl || "/assets/icons/profile-placeholder.svg"} width={90} height={90} className="rounded-full"/>
            <p className="body-bold">{user.name || "name"}</p>
            <p className="small-regular text-light-3">@{user.username || "username"}</p>
            <Button className="shad-button_primary" onClick={(e)=>{
              handleFollow(e);
            }}>
              Follow
            </Button>
            
        </div>

    </Link>
  )
}
export default UserCard