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
        if (comment.liked) {
          comment.score--;
          comment.liked = false;
          return;
        }
        if (comment.disliked) {
          comment.score++;
          comment.disliked = false;
        }

        comment.score++;
        comment.liked = true;
      }
      if (action.payload.type === "MINUS") {
        if (comment.disliked) {
          comment.score++;
          comment.disliked = false;
          return;
        }
        if (comment.liked) {
          comment.score--;
          comment.liked = false;
        }
        comment.score--;
        comment.disliked = true;
      }
    },
    likeReply(state, action) {
      const reply = state.comments
        .find((comment) => comment.user.username === action.payload.thread)
        .replies.find((reply) => reply.id === action.payload.id);

      if (action.payload.type === "PLUS") {
        if (reply.liked) {
          reply.score--;
          reply.liked = false;
          return;
        }
        if (reply.disliked) {
          reply.score++;
          reply.disliked = false;
        }
        reply.score++;
        reply.liked = true;
      }
      if (action.payload.type === "MINUS") {
        if (reply.disliked) {
          reply.score++;
          reply.disliked = false;
          return;
        }
        if (reply.liked) {
          reply.score--;
          reply.liked = false;
        }

        reply.score--;
        reply.disliked = true;
      }
    },
  },
});

const uiSlice = createSlice({
  name: "ui",
  initialState: {
    isReplying: { status: false, receiver: "", thread: "" },
    isEditing: { status: false, id: "" },
  },
  reducers: {
    setIsReplying(state, action) {
      state.isReplying = action.payload;
    },
    setIsEditing(state, action) {
      state.isEditing = action.payload;
    },
  },
});

const store = configureStore({
  reducer: { comment: commentSlice.reducer, ui: uiSlice.reducer },
});

export const commentActions = commentSlice.actions;
export const uiActions = uiSlice.actions;

export default store;
