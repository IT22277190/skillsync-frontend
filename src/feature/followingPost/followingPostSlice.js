import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";


const initialState = {
  followingPosts: null,
};

export const getFollowingPosts = createAsyncThunk(
  "/api/v1/followingposts",
  async (thunkAPI) => {
    const response = await axios({
      method: "post",
      url: "/api/v1/followingposts",
      headers: {
        Authorization: localStorage.getItem("psnToken"),
      },
      data: {
        id: localStorage.getItem("psnUserId"),
      },
    });

    return response.data.payload;
  }
);

async function insertComment(postId, commentContent) {
  const response = await axios({
    method: "post",
    url: "/api/v1/insertcomment",
    headers: {
      Authorization: localStorage.getItem("psnToken"),
    },
    data: {
      commentEntity: {
        userId: localStorage.getItem("psnUserId"),
        userFullname: localStorage.getItem("psnUserFirstName") + " " + localStorage.getItem("psnUserLastName"),
        content: commentContent, 
      },
      postId: {
        id: postId,
      },
    },
  });
}

async function updateLove(postId, currentUserId) {
    const response = await axios({
        method: "post",
        url: "/api/v1/lovepost",
        headers: {
         Authorization: localStorage.getItem("psnToken"),
        },
        data: {
            id1: postId,
            id2: currentUserId,
        }
    });
    
    return response.data;
}

async function updateShare(postId, currentUserId) {
    const response = await axios({
        method: "post",
        url: "/api/v1/sharepost",
        headers: {
         Authorization: localStorage.getItem("psnToken"),
        },
        data: {
            id1: postId,
            id2: currentUserId,
        }
    });
    
    return response.data;
}

export const deletePostThunk = createAsyncThunk(
  "/api/v1/deletepost",
  async (postId, thunkAPI) => {
    const response = await axios({
      method: "delete",
      url: `/api/v1/deletepost/${postId}`, // Assuming `postId` is a string
      headers: {
        Authorization: localStorage.getItem("psnToken"),
      },
    });

    return response.data; // Return the backend's response
  }
);

// Asynchronous thunk to edit a post
export const editPostThunk = createAsyncThunk(
  "followingPost/editPost",
  async (updatedPost, thunkAPI) => {
    const response = await axios({
      method: "put", // PUT method to update the post
      url: `/api/v1/editpost`, // Endpoint for editing a post
      headers: {
        Authorization: localStorage.getItem("psnToken"), // Authorization token
      },
      data: updatedPost, // Data for updating the post
    });

    if (response.status === 200) {
      return response.data.payload; // Return the updated post
    } else {
      throw new Error("Failed to edit post");
    }
  }
);

export const deleteCommentThunk = createAsyncThunk(
  "comments/delete",
  async ({ postId, commentId }, thunkAPI) => {
    const token = localStorage.getItem("psnToken"); // Authorization token
    if (!token) {
      return thunkAPI.rejectWithValue("Authorization token missing.");
    }

    try {
      const response = await axios({
        method: "delete",
        url: `/api/v1/deletecomment/${commentId}/${postId}`, // Verify this URL
        headers: {
          Authorization: token,
        },
      });

      if (response.status === 200) {
        return { postId, commentId }; // Successful deletion
      } else {
        return thunkAPI.rejectWithValue("Delete comment failed.");
      }
    } catch (error) {
      console.error("Error deleting comment:", error.message);
      return thunkAPI.rejectWithValue("Error deleting comment.");
    }
  }
);

// Asynchronous thunk to get a comment by its ID
export const getCommentById = createAsyncThunk(
  "comments/getById",
  async (commentId, thunkAPI) => {
    const token = localStorage.getItem("psnToken"); // Authorization token
    if (!token) {
      return thunkAPI.rejectWithValue("Authorization token missing.");
    }

    try {
      const response = await axios({
        method: "get",
        url: `/api/v1/comment/${commentId}`, // Endpoint for getting a comment by ID
        headers: {
          Authorization: token,
        },
      });

      if (response.status === 200) {
        return response.data.payload; // Return the retrieved comment
      } else {
        return thunkAPI.rejectWithValue("Failed to get comment.");
      }
    } catch (error) {
      console.error("Error getting comment:", error.message);
      return thunkAPI.rejectWithValue("Error getting comment.");
    }
  }
);

// Asynchronous action to edit a comment
export const editCommentThunk = createAsyncThunk('followingPost/editCommentThunk', async ({ postId, commentId, newContent }, thunkAPI) => {
  try {
    const response = await axios.put(`/api/v1/editcomment/${commentId}/${postId}`, {
      content: newContent,
    });
    return response.data.payload; // Assuming the API returns the updated comment in "payload"
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.message);
  }
});






export const followingPostSlice = createSlice({
  name: "followingPostSlice",
  initialState,
  reducers: {
      addLove: (state, action) => {
        if (state.followingPosts !== null) {
            for (let i = 0; i < state.followingPosts.length; i++) {
                if (state.followingPosts[i].post.id === action.payload.postId) {
                    if (!state.followingPosts[i].post.love.includes(action.payload.userId)) {
                        state.followingPosts[i].post.love.push(action.payload.userId);
                        updateLove(action.payload.postId, action.payload.userId);
                    } else {
                        state.followingPosts[i].post.love = state.followingPosts[i].post.love.filter(item => item !== action.payload.userId);
                        updateLove(action.payload.postId, action.payload.userId);
                    }
                }
            }
        }
      },

      addShare: (state, action) => {
          if (state.followingPosts !== null) {
              for (let i = 0; i < state.followingPosts.length; i++) {
                  if (state.followingPosts[i].post.id === action.payload.postId) {
                      state.followingPosts[i].post.share.push(action.payload.userId);
                      updateShare(action.payload.postId, action.payload.userId);
                  }
              }
          }
      },

      addComment: (state, action) => {
        if (state.followingPosts !== null) {
          for (let i = 0; i < state.followingPosts.length; i++) {
            if (state.followingPosts[i].post.id === action.payload.postId) {
              state.followingPosts[i].post.comment.push(action.payload.newComment);
              insertComment(action.payload.postId, action.payload.newComment.content);
            }
          }
        }
      }
  },
    extraReducers: (builder) => {
      builder.addCase(getFollowingPosts.fulfilled, (state, action) => {
        state.followingPosts = action.payload;
      });
      // Handle delete post success
      builder.addCase(deletePostThunk.fulfilled, (state, action) => {
        const postIdToDelete = action.meta.arg; // The postId passed to the thunk
        if (state.followingPosts) {
          state.followingPosts = state.followingPosts.filter(
            (post) => post.id !== postIdToDelete
          ); // Remove the deleted post
        }
      });
      // Handle delete post error (optional)
      builder.addCase(deletePostThunk.rejected, (state, action) => {
        console.error("Failed to delete post:", action.error.message);
      });


      
        builder.addCase(editPostThunk.fulfilled, (state, action) => {
          const updatedPost = action.payload;
          if (state.followingPosts) {
            const index = state.followingPosts.findIndex(
              (post) => post.id === updatedPost.id
            );
            if (index >= 0) {
              state.followingPosts[index] = updatedPost; // Replace the old post with the updated post
            }
          }
        });
    
        builder.addCase(editPostThunk.rejected, (state, action) => {
          console.error("Failed to edit post:", action.error.message); // Error handling
        });
    },
});

export const {addLove, addShare, addComment} = followingPostSlice.actions;
export default followingPostSlice.reducer;


