import Comment from "@/components/shared/Comment";
import PostImage from "@/components/shared/PostImage";
import PostStats from "@/components/shared/PostStats";
import { Button } from "@/components/ui/button";
import {
  useGetPostById,
  useDeletePost,
  useGetCurrentUser,
  useDeleteSavePost,
  useGetRelatedPosts,
  useAddComment,
} from "@/lib/react-query/queriesAndMutations";
import { timeAgo } from "@/lib/utils";
import { selectUser } from "@/redux/slice/slice";
import { Models } from "appwrite";
import { Loader } from "lucide-react";
import { useSelector } from "react-redux";
import { useParams, Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

type commentType = {
  $id: string;
  content: string;
};

const formSchema = z.object({
  comment: z.string().min(2, {
    message: "Comment must be at least 2 characters.",
  }),
});

const PostDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const user = useSelector(selectUser);
  const { data: post, isLoading } = useGetPostById(id);
  const { mutate: deletePost } = useDeletePost();
  const { mutateAsync: deleteSavedPost, isPending: isDeleting } = useDeleteSavePost();
  const { data: currentUser } = useGetCurrentUser();
  const savedPostRecord = currentUser?.save.find(
    (record: Models.Document) => record.post?.$id === post?.$id
  );
  const { data: relatedPosts, isPending: iFetchingRelated } = useGetRelatedPosts(
    post?.creator.$id || "",
    post?.$id || ""
  );
  const { mutateAsync: addComment, isPending: isAddingComment } = useAddComment();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      comment: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (isAddingComment) return;
    const updatedComment = await addComment({
      postId: id || "",
      content: values.comment,
    });

    if (!updatedComment) {
      toast({
        title: "Something went wrong, try again",
      });
    } else {
      form.reset();
      toast({
        title: "Comment has been added successfully",
      });
    }
  }

  const handleDeletePost = async () => {
    if (savedPostRecord) {
      await deleteSavedPost(savedPostRecord.$id);
    }
    if (!isDeleting) {
      deletePost({ postId: id || "", imageId: post?.imageId });
      navigate("/");
    }
  };

  return (
    <div className="post_details-container">
      <div className="hidden md:flex max-w-5xl w-full">
        <Button onClick={() => navigate(-1)} variant="ghost" className="shad-button_ghost">
          <img src={"/assets/icons/back.svg"} alt="back" width={24} height={24} />
          <p className="small-medium lg:base-medium">Back</p>
        </Button>
      </div>

      {isLoading || !post ? (
        <Loader />
      ) : (
        <div className="post_details-card">
          <img src={post?.imageUrl} alt="creator" className="post_details-img" />

          <div className="post_details-info">
            <div className="flex-between w-full">
              <Link to={`/profile/${post?.creator.$id}`} className="flex items-center gap-3">
                <img
                  src={
                    post?.creator.imageUrl || "/assets/icons/profile-placeholder.svg"
                  }
                  alt="creator"
                  className="w-8 h-8 lg:w-12 lg:h-12 rounded-full"
                />
                <div className="flex gap-1 flex-col">
                  <p className="base-medium lg:body-bold text-light-1">
                    {post?.creator.name}
                  </p>
                  <div className="flex-center gap-2 text-light-3">
                    <p className="subtle-semibold lg:small-regular ">
                      {timeAgo(post?.$createdAt)}
                    </p>
                    •
                    <p className="subtle-semibold lg:small-regular">
                      {post?.location}
                    </p>
                  </div>
                </div>
              </Link>

              <div
                className={`flex-center gap-4 ${user.$id !== post?.creator.$id && "hidden"}`}
              >
                <Link to={`/update-post/${post?.$id}`}>
                  <img src={"/assets/icons/edit.svg"} alt="edit" width={24} height={24} />
                </Link>

                <Button onClick={handleDeletePost} variant="ghost" className="post_details-delete_btn">
                  <img src={"/assets/icons/delete.svg"} alt="delete" width={24} height={24} />
                </Button>
              </div>
            </div>

            <div className="flex flex-col w-full small-medium lg:base-regular">
              <p>{post?.caption}</p>

              <ul className="flex gap-1 mt-2">
                {post?.tags.map((tag: string, index: string) => (
                  <li key={`${tag}${index}`} className="text-light-3 small-regular">
                    #{tag}
                  </li>
                ))}
              </ul>

              <hr className="border w-full border-dark-4/80" />
            </div>

            {post.comment.map((comment: commentType) => {
              return (
                <div className="flex flex-col flex-1 w-full gap-3" key={comment.$id}>
                  <Comment user={post?.creator || ""} comment={comment.content} />
                </div>
              );
            })}

            <div className="w-full">
              <PostStats post={post} userId={user.$id} />
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-8">
                  <FormField
                    control={form.control}
                    name="comment"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type="text"
                              className="shad-input mt-2 pr-16" 
                              placeholder="Write your comment..."
                              {...field}
                              disabled={isAddingComment}
                            />
                            <button type="submit" disabled={isAddingComment} className="absolute right-2 top-3">
                              {
                                isAddingComment ? (<Loader />) : (<img src="/assets/icons/vector.svg" alt="submit" width={20} height={20} />)
                              }
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage className="shad-form_message" />
                      </FormItem>
                    )}
                  />
                </form>
              </Form>
            </div>
          </div>
        </div>
      )}

      {iFetchingRelated ? (
        <Loader />
      ) : (
        <div className="w-full max-w-5xl">
          <hr className="border w-full border-dark-4/80" />
          <h3 className="body-bold md:h3-bold w-full my-10">More Related Posts</h3>
          <div className="flex flex-wrap w-full gap-x-10 md:gap-x-5">
            {relatedPosts?.documents.map((post) => (
              <div key={post.$id} className="w-full sm:w-1/3 md:w-1/3 lg:w-1/4">
                <PostImage post={post} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PostDetails;
