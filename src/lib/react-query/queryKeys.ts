export enum QUERY_KEYS {
    // AUTH KEYS
    CREATE_USER_ACCOUNT = "createUserAccount",
  
    // USER KEYS
    GET_CURRENT_USER = "getCurrentUser",
    GET_USERS = "getUsers",
    GET_USER_BY_ID = "getUserById",

    // ALL_USERS
    GET_ALL_USERS = "getAllUsers",
    GET_FOLLOWERS = "getFollowers",
    GET_FOLLOWING = "getFollowing",  
    // POST KEYS
    GET_POSTS = "getPosts",
    GET_INFINITE_POSTS = "getInfinitePosts",
    GET_RECENT_POSTS = "getRecentPosts",
    GET_POST_BY_ID = "getPostById",
    GET_USER_POSTS = "getUserPosts",
    GET_FILE_PREVIEW = "getFilePreview",
    GET_RELATED_POSTS = "getRelatedPosts",

    //Comments
    GET_POST_COMMENTS = "getPostComments",
    
    //  SEARCH KEYS
    SEARCH_POSTS = "getSearchPosts",
    SEARCH_USERS = "getSearchUsers",

    //  SAVED_POSTS,
    GET_SAVED_POSTS = "getSavedPosts",
  }