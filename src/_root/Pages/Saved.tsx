import GridPostList from "@/components/shared/GridPostList";
import Loader from "@/components/shared/Loader";
import { useGetSavedPosts } from "@/lib/react-query/queriesAndMutations";

const Saved = () => {

  const {data: posts,isPending: isLoadingSavedPosts} = useGetSavedPosts();

  console.log("The posts are: ",posts, "The isLoadingSavedPosts: ",isLoadingSavedPosts);


  return (
    <div className="explore-container">
    <div className="explore-inner-container"> 
      <div className="flex gap-2 mb-5 w-full">
        <img src="/assets/icons/saved.svg" width={32} height={32} color="white"/>
        <h2 className="g3-bold md:h2-bold w-full">
          Saved Posts
        </h2>
      </div>

    </div>

      <div className="flex flex-wrap gap-9 w-full max-w-5xl">
        {isLoadingSavedPosts ? (<Loader />) : !posts ? (<p>There are no posts to show</p>) : 
        (
          <GridPostList posts={posts}/>

        )}
      </div>
        
  </div>
  )
}

export default Saved