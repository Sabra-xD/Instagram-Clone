import ProfileForm from "@/components/forms/ProfileForm";
import Loader from "@/components/shared/Loader";
import { useGetCurrentUser} from "@/lib/react-query/queriesAndMutations";
import { useParams } from "react-router-dom";
import NotFound from "./NotFound";

const EditProfile = () => {
  const {data: user, isPending: isLoading} = useGetCurrentUser();
  const {id} = useParams();

  return (
   isLoading ?
    (<Loader />) : user?.$id === id ? (<div className="flex flex-1">
    <div className="common-container">
      <div className="max-w-5xl flex-start gap-3 justify-start w-full">
        <img src="/assets/icons/add-post.svg" width={36} height={36} alt="add"/>
        <h2 className="h3-bold md:h2-bold text-left">Edit Profile</h2>
      </div>
        <ProfileForm user={user}/>
    </div>
 </div>) : (<NotFound />)
  )
}

export default EditProfile;