import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { commentActions, uiActions } from "../store";
import styles from "./NewComment.module.css";

const NewComment = () => {
  const [enteredComment, setEnteredComment] = useState("");
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.comment.currentUser);
  const replyingTo = useSelector((state) => state.ui.isReplying);

  const submitFormHandler = (e) => {
    e.preventDefault();

    if (!enteredComment) return;

    let commentData = {
      content: enteredComment,
      createdAt: new Date().toLocaleString(),
      id: Math.random().toString(),
      replies: [],
      score: 0,
      user: currentUser,
    };

    if (replyingTo.status) {
      commentData = {
        content: enteredComment,
        createdAt: new Date().toLocaleString(),
        id: Math.random().toString(),
        replyingTo: replyingTo.receiver,
        score: 0,
        user: currentUser,
        thread: replyingTo.thread,
      };

      if (replyingTo.receiver === replyingTo.thread)
        dispatch(commentActions.replyToComment(commentData));
      else dispatch(commentActions.replyToReply(commentData));
    } else {
      dispatch(commentActions.addNewComment(commentData));
    }

    dispatch(uiActions.setIsReplying({ status: false, receiver: "" }));
    setEnteredComment("");
  };

  const inputChangeHandler = (e) => {
    setEnteredComment(e.target.value);
  };

  return (
    <div className={styles.form} onSubmit={submitFormHandler}>
      <img src={currentUser.image.png} alt={`${currentUser.username}`} />
      <form>
        <input
          type="text"
          id="comment"
          placeholder="Add a comment..."
          onChange={inputChangeHandler}
          value={enteredComment}
        />
        <button>SEND</button>
      </form>
    </div>
  );
};

export default NewComment;
