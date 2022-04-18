import { useState } from "react";
import { useDispatch } from "react-redux";
import { commentActions, uiActions } from "../store";
import styles from "./EditForm.module.css";

const EditForm = (props) => {
  const [enteredInput, setEnteredInput] = useState(props.comment.content);
  const dispatch = useDispatch();
  //   const commentContent = useSelector();

  const submitFormHanddler = (e) => {
    e.preventDefault();

    if (!enteredInput) return;

    if (props.thread) {
      dispatch(
        commentActions.editReply({
          thread: props.thread,
          id: props.comment.id,
          content: enteredInput,
        })
      );

      dispatch(uiActions.setIsEditing({ id: "" }));

      return;
    }

    dispatch(
      commentActions.editComment({
        id: props.comment.id,
        content: enteredInput,
      })
    );

    dispatch(uiActions.setIsEditing({ id: "" }));
  };

  const inputChangeHandler = (e) => {
    setEnteredInput(e.target.value);
  };

  const cancelFormHandler = () => {
    dispatch(uiActions.setIsEditing({ id: "" }));
  };

  return (
    <form onSubmit={submitFormHanddler} className={styles.form}>
      <textarea
        type="text"
        id="comment"
        value={enteredInput}
        onChange={inputChangeHandler}
      />
      <button>CONFIRM</button>
      <button onClick={cancelFormHandler} type="button">
        CANCEL
      </button>
    </form>
  );
};

export default EditForm;
