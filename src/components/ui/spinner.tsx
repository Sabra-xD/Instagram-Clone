

const Spinner = () => {
    return(
        <div className="flex flex-col justify-center items-center h-screen w-screen p-4">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white-900"></div>
            <p className="mt-5">Loading</p>
        </div>
    );
}


export default Spinner;