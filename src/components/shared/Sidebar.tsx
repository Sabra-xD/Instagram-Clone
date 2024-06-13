import { Link, NavLink, useLocation, useNavigate } from "react-router-dom"
import { Button } from "../ui/button"
import { useSelector } from "react-redux"
import { selectUser, setIsAuthenticated } from "@/redux/slice/slice"
import { sidebarLinks } from "@/constants"
import { useEffect } from "react"
import { useSignOut } from "@/lib/react-query/queriesAndMutations"
import { useDispatch } from "react-redux"
import { INavLink } from "@/types"

const Sidebar = () => {
    const {pathname} = useLocation();
    const user = useSelector(selectUser);
    
    const {mutateAsync: signOut,isSuccess} = useSignOut();
    const navigator = useNavigate();
    const dispatch = useDispatch();

    useEffect(()=>{
        if(isSuccess){
            //Or we can just create a function that resets ALL the information in the state. Literally clear the shit out of it.
            dispatch(setIsAuthenticated(false));
            navigator("/sign-in");
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[isSuccess]);
  return (
    <nav className="leftsidebar">
    

        <div className="flex flex-col gap-11">

            <Link to="/"  className="flex gap-3 items-center">
                <img src="/assets/images/logo.svg" alt="logo" width={170} height={36}/>
            </Link>

        
                <Link to={`/profile/${user.$id}`} className="flex-center gap-3">
                    <img src={user.imageUrl || 'assets/images/profile-paceholder.svg'} alt="profile" className="h-14 w-14 rounded-full"/>
                    
                    <div>
                        <p className="body-bold">{user.name || "name"}</p>
                        <p className="small-regular text-light-3">@{user.username || "username"}</p>
                    </div>

                </Link>


                <ul className="flex flex-col gap-6">
                    {sidebarLinks.map((link:INavLink) => {
                        //Pathname literally erpresents which page am I on.
                        const isActive = pathname===link.route;

                        return(
                            
                            <li className={`leftsidebar-link group ${isActive && 'bg-primary-500'}`} key={link.label}>
                                <NavLink to={link.route} className="flex gap-4 items-center p-4">
                                    <img src={link.imgURL} alt={link.label} className={`group-hover:invert-white ${isActive && 'invert-white'}`}/>
                                    {link.label}
                                </NavLink>
                            </li>
                           
                        )
                    })}
                </ul>




        </div>


        <Button variant="ghost" className="shad-button_ghost" onClick={()=>{
                    signOut();
                }}>
                    <img src="/assets/icons/logout.svg" alt="logout"/>
                    <p className="small-medium lg:base-medium">Log out</p>
                </Button>

        
    </nav>
  )
}

export default Sidebar