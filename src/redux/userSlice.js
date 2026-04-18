import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getProfile as apiGetProfile, updateProfile as apiUpdateProfile } from '../services/api';

export const fetchUserProfile = createAsyncThunk(
  'user/fetchUserProfile',
  async (_, thunkAPI) => {
    try {
      const profile = await apiGetProfile();
      return profile;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch profile');
    }
  }
);

export const editUserProfile = createAsyncThunk(
  'user/editUserProfile',
  async ({ firstName, lastName }, thunkAPI) => {
    try {
      const updatedProfile = await apiUpdateProfile(firstName, lastName);
      return updatedProfile;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to update profile');
    }
  }
);

const initialState = {
  profile: null,
  status: 'idle',
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearUserProfile: (state) => {
      state.profile = null;
      state.status = 'idle';
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.profile = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(editUserProfile.fulfilled, (state, action) => {
        state.profile = action.payload;
      });
  },
});

export const { clearUserProfile } = userSlice.actions;
export default userSlice.reducer;
