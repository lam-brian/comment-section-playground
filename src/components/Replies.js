import { useSelector, useDispatch } from "react-redux";
import styles from "./Replies.module.css";
import { ReactComponent as IconMinus } from "../icons/icon-minus.svg";
import { ReactComponent as IconPlus } from "../icons/icon-plus.svg";
import { ReactComponent as IconReply } from "../icons/icon-reply.svg";
import { ReactComponent as IconDelete } from "../icons/icon-delete.svg";
import { ReactComponent as IconEdit } from "../icons/icon-edit.svg";
import { commentActions, uiActions } from "../store";
import NewComment from "./NewComment";

const Replies = (props) => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.comment.currentUser);
  const isReplying = useSelector((state) => state.ui.isReplying);

  const setReplyingHandler = (replyingTo) => {
    dispatch(
      uiActions.setIsReplying({
        status: true,
        receiver: replyingTo,
        thread: props.thread,
      })
    );
  };

  const deleteReplyHandler = (id) => {
    dispatch(commentActions.deleteReply({ id: id, thread: props.thread }));
  };

  const likeReply = (type, thread, id) => {
    dispatch(commentActions.likeReply({ type, thread, id }));
  };

  const renderedReplies = props.replies.map((reply) => (
    <li key={reply.id}>
      <div className={styles.reply}>
        <div className={styles.buttons}>
          <button
            onClick={likeReply.bind(null, "PLUS", props.thread, reply.id)}
          >
            <IconPlus />
          </button>
          <span>{reply.score}</span>
          <button
            onClick={likeReply.bind(null, "MINUS", props.thread, reply.id)}
          >
            <IconMinus />
          </button>
        </div>

        <div className={styles["reply-info"]}>
          <img src={reply.user.image.png} alt={`${reply.user.username}`} />
          <p>{reply.user.username}</p>
          {reply.user.username === currentUser.username && <span>you</span>}
          <p className={styles.date}>{reply.createdAt}</p>
          {reply.user.username !== currentUser.username && (
            <button
              onClick={setReplyingHandler.bind(null, reply.user.username)}
            >
              <IconReply /> Reply
            </button>
          )}
          {reply.user.username === currentUser.username && (
            <div className={styles["user-buttons"]}>
              <button onClick={deleteReplyHandler.bind(null, reply.id)}>
                <IconDelete /> Delete
              </button>
              <button>
                <IconEdit /> Edit
              </button>
            </div>
          )}
        </div>
        <div className={styles["reply-content"]}>
          <p>
            <span>@{reply.replyingTo}</span> {reply.content}
          </p>
        </div>
      </div>
      {isReplying.status && isReplying.receiver === reply.user.username && (
        <NewComment />
      )}
    </li>
  ));

  return (
    <div className={styles.replies}>
      <ul>{renderedReplies}</ul>
    </div>
  );
};

export default Replies;
