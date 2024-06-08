import { zodResolver } from "@hookform/resolvers/zod"
import {Form,FormControl,FormField,FormItem,FormLabel,FormMessage,} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useForm } from "react-hook-form"
import { SignInValidation } from "@/validation"
import { z } from "zod"
import Loader from "@/components/shared/Loader"
import { Link } from "react-router-dom"
import { useToast } from "@/components/ui/use-toast"
import {useSignInAccount } from "@/lib/react-query/queriesAndMutations"
import { useDispatch } from "react-redux"
import { setIsAuthenticated, setUser } from "@/redux/slice/slice";
import { getCurrentUser } from "@/lib/appwrite/api"

const SignInForm = () => {
 const {toast} = useToast();

 const dispatch = useDispatch();
 

 // eslint-disable-next-line @typescript-eslint/no-unused-vars
 const {mutateAsync: signInAccount, isPending: isSigningIn} = useSignInAccount();

  const form = useForm<z.infer<typeof SignInValidation>>({
    resolver: zodResolver(SignInValidation),
    defaultValues: {
      email:'',
      password:'',
    },
  })
 
  async function onSubmit(values: z.infer<typeof SignInValidation>) {
    console.log("The values are: ",values);

    const session = await signInAccount({
      email:values.email,
      password: values.password
    });

    const currentUser = await getCurrentUser();

    if(!session || !currentUser){
      return toast({title: 'Sign in failed. Please try again.'});
    }

    console.log("Setting the current user  from the login & Dispatching, The user is: ",currentUser);
    dispatch(setUser(currentUser));
    dispatch(setIsAuthenticated(true));
    
  }


  return (
    
    <Form {...form}>  
      <div className="sm:w-420 flex-center flex-col">
        <img src="/assets/images/logo.svg"/>
        <h4 className="h3-bold md:h2-bold pt-5 sm:pt-3">Sign In</h4>

          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5 w-full">
       
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input className="shad-input" type="email" placeholder="Email" {...field} />
                  </FormControl>
              
                  <FormMessage />
                </FormItem>
              )}
            />

          <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input className="shad-input" type="password" placeholder="Password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="shad-button_primary">
              {isSigningIn ? (
                <div className="flex-center gap-2">
                 <Loader/> Loading....
                </div>
              ) : "Login"}
            </Button>
              <p className="text-small-regular text-light-2 text-center mt-2">Don't have an account?
                <Link to="/sign-up" className="text-primary-500 text-small-semibold ml-1">Sign Up</Link>
              </p>
          </form>

      </div>
    </Form>
  )
}

export default SignInForm