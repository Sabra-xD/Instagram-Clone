import { Link, useNavigate } from "react-router-dom"
import { Button } from "../ui/button"
import { useSelector } from "react-redux"
import { selectUser, setIsAuthenticated } from "@/redux/slice/slice"
import { useEffect } from "react"
import { useSignOut } from "@/lib/react-query/queriesAndMutations"
import { useDispatch } from "react-redux"

const Topbar = () => {
    const user = useSelector(selectUser);

    const {mutateAsync: signOut,isSuccess} = useSignOut();
    const navigator = useNavigate();
    const dispatch = useDispatch();

    useEffect(()=>{
        console.log("The value of isSucess is:  ",isSuccess);
        if(isSuccess){
            //Or we can just create a function that resets ALL the information in the state. Literally clear the shit out of it.
            dispatch(setIsAuthenticated(false));
            navigator("/sign-in");
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[isSuccess]);
  return (
    <section className="topbar">
        
        <div className="flex-between py-4 px-5" >
            <Link to="/"  className="flex gap-3 items-center">
                <img src="/assets/images/logo.svg" alt="logo"/>
            </Link>

            <div className = "flex gap-4">
                
                <Button variant="ghost" className="shad-button_ghost" onClick={()=>{
                    signOut();
                }}>
                    <img src="/assets/icons/logout.svg" alt="logout"/>
                </Button>

                <Link to={`/profile/${user.$id}`} className="flex-center gap-3">
                <img src={user.imageUrl || 'assets/images/profile-paceholder.svg'} alt="profile" className="h-8 w-8 rounded-full"/>
                </Link>

            </div>

        </div>
    </section>
  )
}

export default Topbar