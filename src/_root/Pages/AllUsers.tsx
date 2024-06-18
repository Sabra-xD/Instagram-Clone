import Loader from "@/components/shared/Loader";
import UserCard from "@/components/shared/UserCard";
import { useGetAllUsers } from "@/lib/react-query/queriesAndMutations"

const AllUsers = () => {


  const {data: users, isPending: isLoadingUsers} = useGetAllUsers();
  console.log("All users are: ",users)

  return (
    <div className="common-container">
      <div className="user-container"> 
          <h2 className="g3-bold md:h2-bold w-full">
            All Users
          </h2>
          {isLoadingUsers ? (<Loader />) : !users ? (<p>There are no users to show</p>) : 
          (     <div className="user-grid">
            {users.map((user)=>{
              return (<UserCard user={user}/>)
            })}
          </div>)
          }
     
      </div>
    </div>
  )
}

export default AllUsers