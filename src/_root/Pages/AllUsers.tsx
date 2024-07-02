import Loader from "@/components/shared/Loader";
import UserCard from "@/components/shared/UserCard";
import { Input } from "@/components/ui/input";
import useDebounce from "@/lib/customHooks/useDebounce";
import { useGetAllUsers, useSearchUsers } from "@/lib/react-query/queriesAndMutations"
import { selectUser } from "@/redux/slice/slice";
import { useState } from "react";
import { useSelector } from "react-redux";

const AllUsers = () => {


  const {data: users, isPending: isLoadingUsers} = useGetAllUsers();
  const [searchValue, setSearchValue] = useState('');
  const debouncedValue = useDebounce(searchValue,500);
  const currUser = useSelector(selectUser);
  const {data: searchUsers, isPending: isLoading} = useSearchUsers(debouncedValue);

  return (
    <div className="common-container">
      <div className="user-container"> 
          <h2 className="g3-bold md:h2-bold w-full">
            All Users
          </h2>
          <div className="flex gap-1 px-4 w-full rounded-lg bg-dark-4">
          <img src="/assets/icons/search.svg" width={24} height={24} alt="search"/>
          <Input type="text" placeholder="Find People..." className="explore-search" value={searchValue}
          onChange={(e)=>{setSearchValue(e.target.value);}}/>
        </div>

          {
            
          }
          {searchValue === "" ?  isLoadingUsers ? (<Loader />) : !users ? (<p>There are no users to show</p>) : 
          (<div className="user-grid">
            {users.map((user)=>{
              return (currUser.$id !== user.$id && <UserCard user={user} key={user.$id}/>)
            })}
          </div>) :(isLoading ? (<Loader />) :  (<div className="user-grid">
            {searchUsers?.documents.map((user)=>{
              return (currUser.$id !== user.$id && <UserCard user={user} key={user.$id}/>)
            })}
          </div>))
          }
     
      </div>
    </div>
  )
}

export default AllUsers