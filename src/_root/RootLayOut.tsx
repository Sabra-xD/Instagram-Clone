import Bottombar from "@/components/shared/Bottombar"
import Sidebar from "@/components/shared/Sidebar"
import Topbar from "@/components/shared/Topbar"
import { Outlet } from "react-router-dom"

const RootLayOut = () => {
  return (
    <div className="w-full flex flex-col">
     <Topbar />

      <div className="w-full md:flex h-full">
          <Sidebar />
          <section className="flex flex-1 h-full">
            <Outlet />
          </section> 
        </div>

        <Bottombar />

  </div>
  )
}

export default RootLayOut