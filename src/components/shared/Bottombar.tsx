import { bottombarLinks } from "@/constants";
import { INavLink } from "@/types";
import { NavLink, useLocation } from "react-router-dom";

const Bottombar = () => {
  const {pathname} = useLocation();
  
  return (
    <div className="bottom-bar">
      {bottombarLinks.map((link: INavLink) => {
        const isActive = pathname===link.route;
        return(
                                <NavLink to={link.route} className={`leftsidebar-link group ${isActive && 'bg-primary-500 rounded-[10px'} flex-center flex-col gap-1 p-2 transition`} key={link.label}>
                                    <img src={link.imgURL} alt={link.label} width={16} height={16} className={`${isActive && 'invert-white'}`}/>
                                    <p className="tiny-medium text-light-2">{link.label}</p>
                                </NavLink>
        );
      })}
      
    </div>
  )
}

export default Bottombar