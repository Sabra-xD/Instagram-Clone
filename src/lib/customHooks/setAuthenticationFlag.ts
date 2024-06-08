// import { setIsAuthenticated, setUser } from "@/redux/slice/slice";
// import { useDispatch } from "react-redux"



// export const SetAuthenticationFlag = () => {
//     const dispatch = useDispatch();
    
//     const useSetAuthenticationFlag = () => {
//         dispatch(setIsAuthenticated(true));
//     };

    
//     return useSetAuthenticationFlag(); 
// };



// export const useSetUser = () => {
//     const dispatch = useDispatch();
    
//     const setUserFn = (user:object) => {
//         console.log("The setUser from custom hook is: ", user);
//         dispatch(setUser(user));
//     };  

//     return setUserFn;
// };


// export const SetttUser = (user:object) => {
//     const dispatch = useDispatch();
//     dispatch(setUser(user));

// }