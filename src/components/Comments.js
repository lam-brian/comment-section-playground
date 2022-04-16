import { useSelector, useDispatch } from "react-redux";
import Replies from "./Replies";
import NewComment from "./NewComment";
import styles from "./Comments.module.css";
import { ReactComponent as IconMinus } from "../icons/icon-minus.svg";
import { ReactComponent as IconPlus } from "../icons/icon-plus.svg";
import { ReactComponent as IconReply } from "../icons/icon-reply.svg";
import { ReactComponent as IconDelete } from "../icons/icon-delete.svg";
import { ReactComponent as IconEdit } from "../icons/icon-edit.svg";
import { commentActions, uiActions } from "../store";

const Comments = () => {
  const dispatch = useDispatch();
  const comments = useSelector((state) => state.comment.comments);
  const currentUser = useSelector((state) => state.comment.currentUser);
  const isReplying = useSelector((state) => state.ui.isReplying);

  const setReplyHandler = (replyingTo) => {
    dispatch(
      uiActions.setIsReplying({
        status: true,
        receiver: replyingTo,
        thread: replyingTo,
      })
    );
  };

  const deleteCommentHandler = (id) => {
    dispatch(commentActions.deleteComment(id));
  };

  const likeCommentHandler = (type, id) => {
    dispatch(commentActions.likeComment({ type, id }));
  };

  const renderedComments = comments.map((comment) => (
    <li key={comment.id}>
      <div className={styles.comment}>
        <div className={styles.buttons}>
          <button
            className={comment.liked ? styles.active : ""}
            onClick={likeCommentHandler.bind(null, "PLUS", comment.id)}
          >
            <IconPlus />
          </button>
          <span>{comment.score}</span>
          <button
            className={comment.disliked ? styles.active : ""}
            onClick={likeCommentHandler.bind(null, "MINUS", comment.id)}
          >
            <IconMinus />
          </button>
        </div>

        <div className={styles["comment-info"]}>
          <img src={comment.user.image.png} alt={`${comment.user.username}`} />
          <p>{comment.user.username}</p>
          {comment.user.username === currentUser.username && <span>you</span>}
          <p className={styles.date}>{comment.createdAt}</p>
          {comment.user.username !== currentUser.username && (
            <button onClick={setReplyHandler.bind(null, comment.user.username)}>
              <IconReply /> Reply
            </button>
          )}
          {comment.user.username === currentUser.username && (
            <div className={styles["user-buttons"]}>
              <button onClick={deleteCommentHandler.bind(null, comment.id)}>
                <IconDelete /> Delete
              </button>
              <button>
                <IconEdit /> Edit
              </button>
            </div>
          )}
        </div>
        <div className={styles["comment-content"]}>
          <p>{comment.content}</p>
        </div>
      </div>
      {isReplying.status && isReplying.receiver === comment.user.username && (
        <NewComment />
      )}
      {comment.replies.length !== 0 && (
        <Replies replies={comment.replies} thread={comment.user.username} />
      )}
    </li>
  ));

  return (
    <div>
      <ul className={styles.comments}>{renderedComments}</ul>
    </div>
  );
};

export default Comments;
