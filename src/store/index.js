import { configureStore, createSlice } from "@reduxjs/toolkit";
import data from "../data.json";

const initState = data;
console.log(initState);
const commentSlice = createSlice({
  name: "comments",
  initialState: initState,
  reducers: {
    addNewComment(state, action) {
      state.comments.push(action.payload);
    },
    replyToComment(state, action) {
      const comment = state.comments.find(
        (comment) => comment.user.username === action.payload.replyingTo
      );
      comment.replies.push(action.payload);
    },
    replyToReply(state, action) {
      const comment = state.comments.find(
        (comment) => comment.user.username === action.payload.thread
      );
      comment.replies.push(action.payload);
    },
    deleteComment(state, action) {
      const filteredComments = state.comments.filter(
        (comment) => comment.id !== action.payload
      );

      state.comments = filteredComments;
    },
    deleteReply(state, action) {
      const comment = state.comments.find(
        (comment) => comment.user.username === action.payload.thread
      );
      const filteredReplies = comment.replies.filter(
        (reply) => reply.id !== action.payload.id
      );

      comment.replies = filteredReplies;
    },
    likeComment(state, action) {
      const comment = state.comments.find(
        (comment) => comment.id === action.payload.id
      );

      if (action.payload.type === "PLUS") {
        comment.score++;
      }
      if (action.payload.type === "MINUS") {
        if (comment.score === 0) return;
        comment.score--;
      }
    },
    likeReply(state, action) {
      const reply = state.comments
        .find((comment) => comment.user.username === action.payload.thread)
        .replies.find((reply) => reply.id === action.payload.id);

      if (action.payload.type === "PLUS") {
        reply.score++;
      }
      if (action.payload.type === "MINUS") {
        reply.score--;
      }
    },
  },
});

const uiSlice = createSlice({
  name: "ui",
  initialState: { isReplying: { status: false, receiver: "", thread: "" } },
  reducers: {
    setIsReplying(state, action) {
      console.log(action.payload);
      state.isReplying = action.payload;
    },
  },
});

const store = configureStore({
  reducer: { comment: commentSlice.reducer, ui: uiSlice.reducer },
});

export const commentActions = commentSlice.actions;
export const uiActions = uiSlice.actions;

export default store;
