import GridPostList from "@/components/shared/GridPostList";
import Loader from "@/components/shared/Loader";
import { Button } from "@/components/ui/button";
import { useFollowUser, useGetUserById } from "@/lib/react-query/queriesAndMutations";
import { selectUser } from "@/redux/slice/slice";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";

const Profile = () => {
  const { id } = useParams();
  const user = useSelector(selectUser);

  if (!id) throw new Error("No user ID provided");

  const { data: currentUser, isPending: isLoadingUser } = useGetUserById(id);
  const { mutateAsync: followController, isPending: isFollowingAction } = useFollowUser();
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  useEffect(() => {
    if (currentUser) {
      setIsFollowing(currentUser.followers.includes(user.$id));
      setFollowersCount(currentUser.followers.length);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser, user.following]);

  const handleFollow = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!currentUser) return;

    let ourUserFollowing = [...user.following];
    let currentUserFollowers = [...currentUser.followers];

    if (isFollowing) {
      ourUserFollowing = ourUserFollowing.filter((userId: string) => userId !== currentUser.$id);
      currentUserFollowers = currentUserFollowers.filter((followersId: string) => followersId !== user.$id);
      setFollowersCount(followersCount - 1);
    } else {
      ourUserFollowing.push(currentUser.$id);
      currentUserFollowers.push(user.$id);
      setFollowersCount(followersCount + 1);
    }
    setIsFollowing(!isFollowing);
    await followController({
      currentUserId: user.$id,
      followingArray: ourUserFollowing,
      targetUserId: currentUser.$id,
      followersArray: currentUserFollowers
    });
  };

  return (
    <div className="profile-container">
      {isLoadingUser ? (
        <Loader />
      ) : (
        <>
          <div className="profile-inner_container">
            <div className="flex xl:flex-row flex-col max-xl:items-center flex-1 gap-7">
              {/* User PFP */}
              <img
                src={currentUser?.imageUrl || "/assets/icons/profile-placeholder.svg"}
                alt="profile"
                className="w-28 h-28 lg:h-36 lg:w-36 rounded-full"
              />
              {/* Post, Followers & BIO display */}
              <div className="flex-col xl:flex-between xl:flex-row w-full flex-1 mb-5">
                <div className="inline-block flex-col">
                  <h3 className="h3-bold md:h2-bold pt-5 sm:pt-3">
                    {currentUser?.name}
                  </h3>
                  <p className="small-regular text-light-3">
                    @{currentUser?.username || "username"}
                  </p>
                  <div className="flex gap-2 mb-5">
                  <div className="flex gap-1 items-center">
                      <div className="flex gap-1 items-center">
                      <p className="profile-text">{currentUser?.posts.length}</p>
                      Post
                      </div>
                      <Link to={`/followers/${currentUser?.$id}`} className="flex gap-1 items-center">
                        <p className="profile-text">{followersCount}</p>
                        Followers
                      </Link>

                      <Link to={`/following/${currentUser?.$id}`} className="flex gap-1 items-center">
                      <p className="profile-text">{currentUser?.following.length}</p>
                        Following
                      </Link>
                      
                    </div>
                  </div>
                  <div className={`${currentUser?.bio == null && "hidden"}`}>
                    {currentUser?.bio || "BIO"}
                  </div>
                </div>
                <div>
                  {user.$id !== currentUser?.$id ? (
                    <Button
                      className="shad-button_primary"
                      onClick={handleFollow}
                      disabled={isFollowingAction}
                    >
                      {isFollowing ? "UnFollow" : "Follow"}
                    </Button>
                  ) : (
                    <Link to={`/update-profile/${user.$id}`} className="flex-center shad-edit-button_dark_2 items-center">
                      <img
                        src={"/assets/icons/edit.svg"}
                        alt="edit"
                        width={20}
                        height={20}
                      />
                      Edit Profile
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div>
            <GridPostList posts={currentUser?.posts} showUser={false} />
          </div>
        </>
      )}
    </div>
  );
};

export default Profile;
