/* eslint-disable @typescript-eslint/no-unused-vars */
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {Form,FormControl,FormField,FormItem,FormLabel,FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input" 
import { Textarea } from "../ui/textarea"
import FileUploader from "../shared/FileUploader"
import { PostValidation } from "@/validation"
import { Models } from "appwrite"
import { useCreatePost, useDeletePost, useUpdatePost} from "@/lib/react-query/queriesAndMutations"
import { selectUser } from "@/redux/slice/slice"
import { useSelector } from "react-redux"
import { useToast } from "../ui/use-toast"
import { useNavigate } from "react-router-dom"
import Spinner from "../ui/spinner"

type PostFormProps = {
    post?: Models.Document;
    action: "Update" | "Create"
}

const PostForm = ({action,post} : PostFormProps) => {

  const {mutateAsync: createPost, isPending: isLoading} = useCreatePost();
  const {mutateAsync: updatePost, isPending: isUpdated} = useUpdatePost();
  const {mutateAsync: deletePost, isPending: isDeleting } = useDeletePost();

  const {toast} = useToast();
  const user = useSelector(selectUser);
  const navigator = useNavigate();


  const form = useForm<z.infer<typeof PostValidation>>({
        resolver: zodResolver(PostValidation),
        defaultValues: {
          caption: post ? post?.caption : "",
          file: [],
          location: post ? post?.location : "",
          tags: post ? post?.tags.join(",") : "",
        },
  })
     
      async function onSubmit(values: z.infer<typeof PostValidation>){ 
            
        if(action === "Create"){
              const newPost = await createPost({
                ...values,
                userId: user.$id,
                });

                if(!newPost){
                  toast({
                    title:'Something went wrong, try again'
                  })
                }

            }else{
              if(post){
                const updatedPost = await updatePost({
                  ...values,
                  postId: post.$id,
                  imageId: post.imageId,
                  imageUrl: post.imageUrl,
                });

                if(!updatedPost){
                  return  toast({
                    title:'Something went wrong, try again'
                  })
                }
              }
            }
              navigator('/');
       }
    
       const handleDelete = async() => {
        if(post){
          const deleted = await deletePost({postId: post.$id,imageId: post.imageId});
          if(deleted){
            navigator("/")
          }else{
            toast({
              title: "Something went wrong, try again"
            })
          }
        }
       }


  return (
   isLoading || isUpdated ? <Spinner /> :
    <Form {...form}>
     <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-9 w-full  max-w-5xl">
        <FormField
          control={form.control}
          name="caption"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Caption</FormLabel>
              <FormControl>
                  <Textarea className="shad-textarea custom-scrollbar"
                    {...field}/>
              </FormControl>
              <FormMessage className="shad-form_message" />
          </FormItem>
        )}
      />

    <FormField
          control={form.control}
          name="file"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Add Photos</FormLabel>
              <FormControl>
                <FileUploader
                fieldChange={field.onChange}
                mediaUrl={post?.imageUrl}
                />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />

    <FormField
        control={form.control}
        name="location"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="shad-form_label">Add location</FormLabel>
            <FormControl >
              <Input type="text" className="shad-input" {...field} />
              </FormControl>
            <FormMessage className="shad-form_message" />
          </FormItem>
        )}
      />

      
    <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">
                Add Tags (separated by comma " , ")
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Art, Expression, Learn"
                  type="text"
                  className="shad-input"
                  {...field}
                />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />



        <div className="flex gap-4 items-center justify-end">
          
        <Button
            type="button"
            className="shad-button_dark_4" onClick={()=>{navigator(-1)}} disabled={isLoading || isUpdated || isDeleting}>
            Cancel
          </Button>
          {action==="Update" && post && (<Button type="button" style={{backgroundColor:"red"}} 
           disabled={isLoading || isUpdated || isDeleting}
          onClick={()=>{
            handleDelete();
          }}> {isDeleting ? 'Deleting...' : 'Delete'}</Button>)}   
          <Button
            type="submit"
            className="shad-button_primary whitespace-nowrap"
            disabled={isLoading || isUpdated || isDeleting}>
              {isLoading || isUpdated && "Loading..."}
              {action} Post                
          </Button>
        </div>
        
      
    </form>
  </Form>
  )
}

export default PostForm