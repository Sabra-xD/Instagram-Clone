import Bottombar from "@/components/shared/Bottombar"
import Sidebar from "@/components/shared/Sidebar"
import Topbar from "@/components/shared/Topbar"
import Spinner from "@/components/ui/spinner"
import useSelectorWithDelay from "@/lib/customHooks/useSelectorWithDelay"
import { Navigate, Outlet } from "react-router-dom"

const RootLayOut = () => {
  const {isAuthed, timerExpired} = useSelectorWithDelay();
  return (
    <>
    {
      isAuthed ? ( <div className="w-full flex flex-col">
        <Topbar />
   
         <div className="w-full md:flex h-full">
             <Sidebar />
             <section className="flex flex-1 h-full">
               <Outlet />
             </section> 
           </div>
           <Bottombar />
     </div>) : timerExpired ? (<Navigate to="/sign-in"/>) : (<Spinner />)
    }
    </>
  
  )
}

export default RootLayOut