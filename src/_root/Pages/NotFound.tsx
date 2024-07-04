import { Link } from "react-router-dom"

const NotFound = () => {
  return (
    <div className="common-container  justify-center items-center">
        <div className="h3-light md:h2-bold text-left">
            <h1>Something went wrong</h1>
            <Link to="/" className="underline">Go back Home...</Link>
        </div>
    </div>
  )
}

export default NotFound