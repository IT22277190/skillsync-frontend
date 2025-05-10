import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  userFeedback: null,
  publicReviews: null,
  currentFeedback: null,
  loading: false,
  error: null
};

// Get user's feedback history
export const getUserFeedback = createAsyncThunk(
  "feedback/getUserFeedback",
  async (thunkAPI) => {
    const response = await axios({
      method: "post",
      url: "/api/v1/feedback/my",
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

// Submit new feedback
export const submitFeedback = createAsyncThunk(
  "feedback/submitFeedback",
  async (feedbackData, thunkAPI) => {
    const response = await axios({
      method: "post",
      url: "/api/v1/feedback/submit",
      headers: {
        Authorization: localStorage.getItem("psnToken"),
      },
      data: feedbackData,
    });
    return response.data.payload;
  }
);

// Get public reviews for homepage display
export const getPublicReviews = createAsyncThunk(
  "feedback/getPublicReviews",
  async (thunkAPI) => {
    const response = await axios({
      method: "get",
      url: "/api/v1/public/reviews"
    });
    return response.data.payload;
  }
);

// Get specific feedback details
export const getFeedbackDetails = createAsyncThunk(
  "feedback/getFeedbackDetails",
  async (feedbackId, thunkAPI) => {
    const response = await axios({
      method: "get",
      url: `/api/v1/feedback/${feedbackId}`,
      headers: {
        Authorization: localStorage.getItem("psnToken"),
      },
    });
    return response.data.payload;
  }
);

// Update feedback
export const updateFeedback = createAsyncThunk(
    "feedback/updateFeedback",
    async ({ feedbackId, content, title, category }, thunkAPI) => {
      const response = await axios({
        method: "put",
        url: `/api/v1/feedback/${feedbackId}`,
        headers: {
          Authorization: localStorage.getItem("psnToken"),
        },
        data: { 
          content,
          title,
          category 
        },
      });
      return response.data.payload;
    }
  );


// Delete feedback
export const deleteFeedback = createAsyncThunk(
    "feedback/deleteFeedback",
    async (feedbackId, thunkAPI) => {
      // Remove the variable declaration but keep the await
      await axios({
        method: "delete",
        url: `/api/v1/feedback/${feedbackId}`,
        headers: {
          Authorization: localStorage.getItem("psnToken"),
        },
      });
      return feedbackId; // Return ID for filtering out deleted feedback
    }
  );

const feedbackSlice = createSlice({
  name: "feedback",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Get user feedback cases
      .addCase(getUserFeedback.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserFeedback.fulfilled, (state, action) => {
        state.loading = false;
        state.userFeedback = action.payload;
      })
      .addCase(getUserFeedback.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      
      // Submit feedback cases
      .addCase(submitFeedback.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitFeedback.fulfilled, (state, action) => {
        state.loading = false;
        if (state.userFeedback) {
          state.userFeedback = [action.payload, ...state.userFeedback];
        } else {
          state.userFeedback = [action.payload];
        }
      })
      .addCase(submitFeedback.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      
      // Public reviews cases
      .addCase(getPublicReviews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPublicReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.publicReviews = action.payload;
      })
      .addCase(getPublicReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      
      // Get feedback details cases
      .addCase(getFeedbackDetails.fulfilled, (state, action) => {
        state.currentFeedback = action.payload;
      })
      
      // Update feedback cases
      .addCase(updateFeedback.fulfilled, (state, action) => {
        if (state.userFeedback) {
          state.userFeedback = state.userFeedback.map(feedback => 
            feedback.id === action.payload.id ? action.payload : feedback
          );
        }
        state.currentFeedback = action.payload;
      })
      
      // Delete feedback cases
      .addCase(deleteFeedback.fulfilled, (state, action) => {
        if (state.userFeedback) {
          state.userFeedback = state.userFeedback.filter(
            feedback => feedback.id !== action.payload
          );
        }
        if (state.currentFeedback && state.currentFeedback.id === action.payload) {
          state.currentFeedback = null;
        }
      });
  },
});

export default feedbackSlice.reducer;