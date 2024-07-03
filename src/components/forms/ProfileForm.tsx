/* eslint-disable @typescript-eslint/no-unused-vars */
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {Form,FormControl,FormField,FormItem,FormLabel,FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input" 
import { Textarea } from "../ui/textarea"
import { ProfileValidation } from "@/validation"
import { Models } from "appwrite"
import {useUpdateUser} from "@/lib/react-query/queriesAndMutations"
import { useToast } from "../ui/use-toast"
import { useNavigate } from "react-router-dom"
import Loader from "../shared/Loader"
import ProfileUploader from "../shared/ProfileUploader"
import { setUser } from "@/redux/slice/slice"
import { useDispatch } from "react-redux"

type ProfileFormProps = {
    user?: Models.Document;
}

const ProfileForm = ({user} : ProfileFormProps) => {


  const {mutateAsync: updateUser, isPending: isUpdated} = useUpdateUser();
  const {toast} = useToast();
  const navigator = useNavigate();
  const dispatch = useDispatch();


  const form = useForm<z.infer<typeof ProfileValidation>>({
        resolver: zodResolver(ProfileValidation),
        defaultValues: {
          name: user ? user.name : "",
          username: user ? user.username : "",
          email: user ? user.email : "",
          bio: user ? user.bio : "",
          file: [],
        },
  })
     
      async function onSubmit(values: z.infer<typeof ProfileValidation>){ 

            if(user){
                const updatedUser = await updateUser(
                  {
                    ...values,
                    userId: user.$id,
                    imageId: user.imageId,
                    imageUrl: user.imageUrl,
                  }
                );
                if(!updatedUser) {
                  return  toast({
                    title:'Something went wrong, try again'
                  })
                }
                dispatch(setUser(updatedUser));
                navigator(`/`);
            }
     
       }
    


  return (

    
    
    <Form {...form}>
     
     <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-9 w-full  max-w-5xl">
       
          <FormField
              control={form.control}
              name="file"
              render={({ field }) => (
                <FormItem className="flex">
                  <FormControl>
                    <ProfileUploader
                      fieldChange={field.onChange}
                      mediaUrl={user?.imageUrl}
                    />
                  </FormControl>
                  <FormMessage className="shad-form_message" />
                </FormItem>
              )}
            />




        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                 <Input type="text" className="shad-input" {...field} />
              </FormControl>
              <FormMessage className="shad-form_message" />
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
                <Input type="text" className="shad-input" {...field} />
            </FormControl>
            <FormMessage className="shad-form_message" />
        </FormItem>
          )}
        />

    <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="shad-form_label">Email</FormLabel>
            <FormControl >
              <Input type="text" className="shad-input" {...field} />
              </FormControl>
            <FormMessage className="shad-form_message" />
          </FormItem>
        )}
      />

      
    <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>bio</FormLabel>
              <FormControl>
                  <Textarea className="shad-textarea custom-scrollbar"
                    {...field}/>
              </FormControl>
              <FormMessage className="shad-form_message" />
          </FormItem>
          )}
        />



        <div className="flex gap-4 items-center justify-end">
          
        <Button
            type="button"
            className="shad-button_dark_4" onClick={()=>{navigator(-1)}} disabled={isUpdated}>
            Cancel
          </Button>
          

          <Button
            type="submit"
            className="shad-button_primary whitespace-nowrap"
            disabled={isUpdated}>
              {isUpdated && <Loader />}
              {isUpdated ? "Updating..." : "Update"}
          </Button>
        </div>
        
      
    </form>
  </Form>
  )
}

export default ProfileForm