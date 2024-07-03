import { Models } from "appwrite";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "@/redux/slice/slice";
import { useFollowUser } from "@/lib/react-query/queriesAndMutations";

const UserCard = ({ user }: { user: Models.Document }) => {
  const currentUser = useSelector(selectUser);
  const [isFollowing, setIsFollowing] = useState(false);
  const { mutateAsync: followController, isPending: isFollowingAction } = useFollowUser();

  useEffect(() => {
    if (currentUser.$id !== "") {
      setIsFollowing(user.followers.includes(currentUser.$id));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser, user.$id]);
  

  const handleFollow = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!currentUser) return;

    let ourUserFollowing = [...currentUser.following];
    let currentUserFollowers = [...user.followers];

    if (isFollowing) {
      ourUserFollowing = ourUserFollowing.filter((userId: string) => userId !== user.$id);
      currentUserFollowers = currentUserFollowers.filter((followersId: string) => followersId !== currentUser.$id);
    } else {
      ourUserFollowing.push(user.$id);
      currentUserFollowers.push(currentUser.$id);
    }
    setIsFollowing(!isFollowing);
    await followController({
      currentUserId: currentUser.$id,
      followingArray: ourUserFollowing,
      targetUserId: user.$id,
      followersArray: currentUserFollowers
    });
  };

  return (
    <div className="user-card">
      <Link to={`/profile/${user.$id}`} className="user-card-link">
        <div className="flex-center flex-col gap-5">
          <img src={user.imageUrl || "/assets/icons/profile-placeholder.svg"} width={90} height={90} className="rounded-full" alt="User profile" />
          <p className="body-bold">{user.name || "name"}</p>
          <p className="small-regular text-light-3">@{user.username || "username"}</p>
        </div>
      </Link>
      <Button
        className={`${currentUser.$id === user.$id ? "hidden" : "shad-button_primary"}`}
        onClick={(e) => {
          e.stopPropagation();
          handleFollow(e);
        }}
        disabled={isFollowingAction}
      >
        {isFollowing ? "UnFollow" : "Follow"}
      </Button>
    </div>
  );
};

export default UserCard;
