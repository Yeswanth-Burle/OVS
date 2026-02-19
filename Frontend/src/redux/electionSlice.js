import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../utils/api';

const initialState = {
    elections: [],
    currentElection: null,
    candidates: [],
    isLoading: false,
    isError: false,
    isSuccess: false,
    message: '',
};

// Get all elections
export const getElections = createAsyncThunk(
    'elections/getAll',
    async (_, thunkAPI) => {
        try {
            const response = await api.get('/elections');
            return response.data;
        } catch (error) {
            const message =
                (error.response && error.response.data && error.response.data.message) ||
                error.message ||
                error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Get election by ID
export const getElectionById = createAsyncThunk(
    'elections/getById',
    async (id, thunkAPI) => {
        try {
            const response = await api.get(`/elections/${id}`);
            return response.data;
        } catch (error) {
            const message =
                (error.response && error.response.data && error.response.data.message) ||
                error.message ||
                error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Create election
export const createElection = createAsyncThunk(
    'elections/create',
    async (electionData, thunkAPI) => {
        try {
            const response = await api.post('/elections', electionData);
            return response.data;
        } catch (error) {
            const message =
                (error.response && error.response.data && error.response.data.message) ||
                error.message ||
                error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Get candidates for election
export const getCandidates = createAsyncThunk(
    'elections/getCandidates',
    async (electionId, thunkAPI) => {
        try {
            const response = await api.get(`/elections/${electionId}/candidates`);
            return response.data;
        } catch (error) {
            const message =
                (error.response && error.response.data && error.response.data.message) ||
                error.message ||
                error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Cast Vote
export const castVote = createAsyncThunk(
    'elections/vote',
    async (voteData, thunkAPI) => {
        try {
            const response = await api.post('/votes', voteData);
            return response.data;
        } catch (error) {
            const message =
                (error.response && error.response.data && error.response.data.message) ||
                error.message ||
                error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Check Vote Status
export const checkVoteStatus = createAsyncThunk(
    'elections/checkVote',
    async (electionId, thunkAPI) => {
        try {
            const response = await api.get(`/votes/check/${electionId}`);
            return response.data;
        } catch (error) {
            // Silent fail or return null
            return thunkAPI.rejectWithValue('Error checking vote status');
        }
    }
);

// Update Election Eligibility
export const updateElectionEligibility = createAsyncThunk(
    'elections/updateEligibility',
    async ({ id, eligibilityData }, thunkAPI) => {
        try {
            const response = await api.patch(`/elections/${id}/eligibility`, eligibilityData);
            return response.data;
        } catch (error) {
            const message =
                (error.response && error.response.data && error.response.data.message) ||
                error.message ||
                error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);


export const electionSlice = createSlice({
    name: 'election',
    initialState,
    reducers: {
        reset: (state) => {
            state.isLoading = false;
            state.isSuccess = false;
            state.isError = false;
            state.message = '';
        },
        resetCurrent: (state) => {
            state.currentElection = null;
            state.candidates = [];
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getElections.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getElections.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.elections = action.payload;
            })
            .addCase(getElections.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(getElectionById.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.currentElection = action.payload;
            })
            .addCase(createElection.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.elections.push(action.payload);
            })
            .addCase(getCandidates.fulfilled, (state, action) => {
                state.candidates = action.payload;
            })
            .addCase(castVote.fulfilled, (state) => {
                state.isLoading = false;
                state.isSuccess = true;
                // Could update local state to reflect vote
            })
            .addCase(castVote.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(updateElectionEligibility.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                const index = state.elections.findIndex(election => election._id === action.payload._id);
                if (index !== -1) {
                    state.elections[index] = action.payload;
                }
                if (state.currentElection && state.currentElection._id === action.payload._id) {
                    state.currentElection = action.payload;
                }
            });
    },
});

export const { reset, resetCurrent } = electionSlice.actions;
export default electionSlice.reducer;
