import GridPostList from "@/components/shared/GridPostList";
import Loader from "@/components/shared/Loader";
import { Button } from "@/components/ui/button";
import { useGetUserById } from "@/lib/react-query/queriesAndMutations";
import { selectUser } from "@/redux/slice/slice";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";

//ToDo:
//Add the Follow Logic.
//For own user, display a message to guide them to create a new post.


const Profile = () => {
  const { id } = useParams();
  const user = useSelector(selectUser);

  if (!id) throw Error;

  const { data: currentUser, isPending: isLoadingUser } = useGetUserById(id);

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
                src={
                  currentUser?.imageUrl ||
                  "/assets/icons/profile-placeholder.svg"
                }
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
                  <div className="flex-between mb-5">
                    <div className="flex gap-1 items-center">
                      <p className="profile-text">{currentUser?.posts.length}</p>
                      Post
                      <p className="profile-text">{currentUser?.posts.length}</p>
                      Followers
                    </div>
                  </div>
                  <div
                    className={`${currentUser?.bio == null && "hidden"}`}
                  >
                    {currentUser?.bio || "BIO"}
                  </div>
                </div>
                <div>
                  {user.$id !== currentUser?.$id ? (
                    <Button className="shad-button_primary">Follow</Button>
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
