import Spinner from "@/components/ui/spinner";
import useSelectorWithDelay from "@/lib/customHooks/useSelectorWithDelay";
// import { selectIsAuthenticated } from "@/redux/slice/slice";
// import { useSelector } from "react-redux";
import { Outlet,Navigate } from "react-router-dom";
const AuthLayOut = () => { 
  // const isAuthed=false;
  const {isAuthed, timerExpired}= useSelectorWithDelay(); // Use the selector


  return (
    <>
     {isAuthed ? (<Navigate to="/"/>) : timerExpired ? (<>
          <section className="flex flex-1 justify-center items-center flex-col py-10">
            <Outlet />
          </section>

          <img src="/assets/images/side-img.svg"
            alt="logo"
            className="hidden xl:block h-screen w-1/2 object-cover bg-no-repeat"          
          />
        </>):(
          <> 
           <Spinner />
          </>
        )}
    </>
  )
}

export default AuthLayOut