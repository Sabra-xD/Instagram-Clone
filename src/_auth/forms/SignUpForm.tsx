import { zodResolver } from "@hookform/resolvers/zod"
import {Form,FormControl,FormField,FormItem,FormLabel,FormMessage,} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useForm } from "react-hook-form"
import { SignUpValidation } from "@/validation"
import { z } from "zod"
import Loader from "@/components/shared/Loader"
import { Link } from "react-router-dom"
import { useToast } from "@/components/ui/use-toast"
import { useCreateUserAccountMutation, useSignInAccount } from "@/lib/react-query/queriesAndMutations"
import { useDispatch } from "react-redux"
import { setIsAuthenticated, setUser } from "@/redux/slice/slice";

const SignUpForm = () => {
 const {toast} = useToast();

 const dispatch = useDispatch();
 
 const { mutateAsync: createUserAccount , isPending: isCreatingUser} = useCreateUserAccountMutation();

 const {mutateAsync: signInAccount, isPending: isSigningIn} = useSignInAccount();

  const form = useForm<z.infer<typeof SignUpValidation>>({
    resolver: zodResolver(SignUpValidation),
    defaultValues: {
      name:'',
      username: '',
      email:'',
      password:'',
    },
  })
 
  async function onSubmit(values: z.infer<typeof SignUpValidation>) {
    console.log(values)
    const newUser = await createUserAccount(values);
    if(!newUser){
      return toast({
        variant:"destructive",
        title: "Sign up failed. Please try again.",
      });
    }


    const session = await signInAccount({
      email:values.email,
      password: values.password
    });

    if(!session){
      return toast({title: 'Sign in failed. Please try again.'});
    }

    console.log("Setting the newUser & Dispatching, The user is: ",newUser);
    dispatch(setUser(newUser));
    dispatch(setIsAuthenticated(false));

  }


  return (
    
    <Form {...form}>  
      <div className="sm:w-420 flex-center flex-col">
        <img src="/assets/images/logo.svg"/>
        <h4 className="h3-bold md:h2-bold pt-5 sm:pt-3">Create Account</h4>
        <p className="text-light-3 small-medium md:base-regular mt-2">To use Snapgram, Please enter your details</p>

          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5 w-full">
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input className="shad-input" type="text" placeholder="Name" {...field} />
                  </FormControl>
              
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input className="shad-input" type="text" placeholder="Username" {...field} />
                  </FormControl>
              
                  <FormMessage />
                </FormItem>
              )}
            />

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
              {isCreatingUser || isSigningIn ? (
                <div className="flex-center gap-2">
                 <Loader/> Loading....
                </div>
              ) : "Sign Up"}
            </Button>
              <p className="text-small-regular text-light-2 text-center mt-2">Already have an account?
                <Link to="/sign-in" className="text-primary-500 text-small-semibold ml-1">Login</Link>
              </p>
          </form>

      </div>
    </Form>
  )
}

export default SignUpForm