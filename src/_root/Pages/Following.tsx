import Loader from "@/components/shared/Loader";
import UserCard from "@/components/shared/UserCard";
import { useFetchFollowing, useGetUserById} from "@/lib/react-query/queriesAndMutations"
import { useParams } from "react-router-dom";

const Following = () => {
    const {id} = useParams();
    if (!id) throw new Error("No user ID provided");
    const {data: currUser} = useGetUserById(id);
    const {data: users,isPending: isLoading} = useFetchFollowing(currUser?.following);
   
  return (

    <div className="common-container">
      <div className="user-container"> 
          <h2 className="g3-bold md:h2-bold w-full">
            Following
          </h2>
          <div className="flex gap-1 px-4 w-full rounded-lg bg-dark-4">
        </div>

        {isLoading ? (<Loader />) : (<div className="user-grid"> 
        {
           users?.map((user)=>{
                if (!user) return;
                return (<UserCard user={user} key={user?.$id}/>)

            })}
        </div>
)}
       
    
          
         
     
      </div>
    </div>
  )
}

export default Following