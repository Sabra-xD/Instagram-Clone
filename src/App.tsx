import AuthLayOut from './_auth/AuthLayOut';
import SignInForm from './_auth/forms/SignInForm';
import SignUpForm from './_auth/forms/SignUpForm';
import { AllUsers, CreatePost, EditPost, Explore, Home, PostDetails, Profile, Saved, UpdateProfile } from './_root/Pages';
import RootLayOut from './_root/RootLayOut';
import './globals.css';
import { Routes,Route } from 'react-router-dom';
import { Toaster } from './components/ui/toaster';
import { useEffect } from 'react';
import { getCurrentUser } from './lib/appwrite/api';
import { useDispatch } from 'react-redux';
import { setIsAuthenticated, setUser } from './redux/slice/slice';


const App = () => {

    const dispatch = useDispatch();

    useEffect(() => {
        const fetchData = async () => {
            const user = await getCurrentUser();
            if (user) {
                dispatch(setUser(user));
                dispatch(setIsAuthenticated(true));
            }
        };
        
        fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return (

    <main className="flex h-screen">
        <Toaster />

        <Routes>

            {/* Public Routes */}
            <Route element={<AuthLayOut/>}> 
                <Route path="/sign-in" element={<SignInForm />}/>
                <Route path="/sign-up" element={<SignUpForm />}/>
            </Route>
          
            {/* Private Routes */}
            <Route element={<RootLayOut />}>
                <Route index element={<Home />}/>
                <Route path="/explore" element={<Explore />}/>
                <Route path="/all-users" element={<AllUsers />}/>
                <Route path="/saved" element={<Saved />}/>
                <Route path="/create-post" element={<CreatePost />}/>       
                <Route path="/update-post/:id" element={<EditPost />}/>  
                <Route path="/posts/:id" element={<PostDetails />}/>  
                <Route path="/profile/:id/*" element={<Profile />}/>  
                <Route path="/update-profile/:id" element={<UpdateProfile />}/>   
            </Route>





        </Routes>


    </main>

    )
}

export default App;