import React, { useState } from "react";
import { Hashicon } from "@emeraldpay/hashicon-react";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en.json";
import { useNavigate } from "react-router-dom";
import EditCommentModal from './EditComment';
import { toast } from 'react-toastify';


import {
  RiHeartFill,
  RiHeartLine,
  RiMessage2Fill,
  RiShareForwardFill,
  RiSendPlane2Fill,
  RiDeleteBin6Line,
  RiEditLine,
  RiMoreFill,
} from "react-icons/ri";
import { Button, Col, Form, Row, Dropdown, DropdownButton } from "react-bootstrap";

import styles from "./styles/PostItem.module.css";
import { useDispatch } from "react-redux";
import {
  addLove,
  addShare,
  addComment,
  deletePostThunk,
  deleteCommentThunk,
  editCommentThunk
  
} from "../feature/followingPost/followingPostSlice";

function PostItem(props) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [loveStatus, setLoveStatus] = useState(false);
  const [commentStatus, setCommentStatus] = useState(false);
  const [commentContent, setCommentContent] = useState("");
  const [sendButtonDisable, setSendButtonDisable] = useState(true);
  const [currentUserId, setCurrentUserId] = useState(
    localStorage.getItem("psnUserId")
  );
  const [postId, setPostId] = useState(props.postId);

  const [showEditCommentModal, setShowEditCommentModal] = useState(false);
  const [editCommentId, setEditCommentId] = useState(null);
  const [editCommentContent, setEditCommentContent] = useState("");

  TimeAgo.addLocale(en);
  const timeAgo = new TimeAgo("en-US");

  const handleEditCommentClick = (commentId, commentContent) => {
    setEditCommentId(commentId); // Set the ID of the comment to be edited
    setEditCommentContent(commentContent); // Set the content of the comment
    setShowEditCommentModal(true); // Show the modal
  };

  const handleCloseEditCommentModal = () => {
    setShowEditCommentModal(false); // Close the modal
  };

  const handleEditCommentSubmit = (newContent) => {
    dispatch(editCommentThunk({ postId: props.postId, commentId: editCommentId, newContent }))
      .then((result) => {
        if (result.meta.requestStatus === "fulfilled") {
          toast.success("Comment updated successfully!");
          handleCloseEditCommentModal(); // Close the modal upon success
        } else {
          toast.error("Failed to update comment.");
        }
      });
  };
  function handleLoveClick() {
    setLoveStatus(!loveStatus);
    dispatch(addLove({ postId, userId: currentUserId }));
  }

  function handleShareClick() {
    dispatch(addShare({ postId, userId: currentUserId }));
  }

  function handleCommentButtonClick() {
    setCommentStatus(!commentStatus);
  }

  function handleCommentContentChange(e) {
    const content = e.target.value;
    setCommentContent(content);
    setSendButtonDisable(content.length === 0 || content.length > 100);
  }

  function sendComment() {
    dispatch(
      addComment({
        postId,
        newComment: {
          userId: localStorage.getItem("psnUserId"),
          userFullname:
            localStorage.getItem("psnUserFirstName") + " " +
            localStorage.getItem("psnUserLastName"),
          content: commentContent,
        },
      })
    );
    setCommentContent("");
  }

  const handleDeleteComment = (commentId) => {
    dispatch(deleteCommentThunk({ postId: props.postId, commentId }))
      .then((result) => {
        if (result.meta.requestStatus === 'fulfilled') {
          toast.success('Comment deleted successfully!', { autoClose: 2000 }); 
        } else {
          toast.error('Failed to delete comment.', { autoClose: 2000 }); // Show error toast
        }
      })
      .catch((error) => {
        toast.error(`Error: ${error.message}`, { autoClose: 2000 });
      });
  };

 

  // Function to handle delete post
  function handleDeletePost() {
    dispatch(deletePostThunk(props.postId)); 
  }

  function handleEditPost() {
    navigate(`/editpost/${props.postId}`); // Redirect to the edit page
  }


  return (
    <div className="border shadow rounded-3 border-primary p-3 mt-3">
      <Row>
        {/* Three-dot menu for delete and edit */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div className="d-flex align-items-center">
            <Hashicon value={props.userId} size={50} className="me-3" />
            <div className="d-flex flex-column">
              <div className="fw-bold">{props.firstName + " " + props.lastName}</div>
              <div className="text-secondary">
                {timeAgo.format(new Date(props.postDate).getTime())}
              </div>
            </div>
          </div>
          {props.userId === currentUserId && (
            <Dropdown>
              <Dropdown.Toggle variant="outline-secondary" id="dropdown-basic">
                <RiMoreFill size={20} />
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item onClick={handleEditPost}>
                  <RiEditLine className="me-2" /> Edit Post
                </Dropdown.Item>
                <Dropdown.Item onClick={handleDeletePost}>
                  <RiDeleteBin6Line className="me-2" /> Delete Post
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          )}
        </div>

        <div className="mx-3">
          <p>{props.content}</p>
          {props.image && (
            <div className="d-flex justify-content-center align-items-center mb-3">
              <img src={props.image} alt="" />
            </div>
          )}
        </div>

        {/* Sub-functions of a post */}
        <div className="d-flex justify-content-center align-items-center">
          {/* Sub-function love button */}
          <div className="mx-3">
            <span
              className={`${styles.loveButton} mx-1 fs-4`}
              onClick={handleLoveClick}
            >
              {loveStatus ? (
                <RiHeartFill className="text-danger" />
              ) : (
                <RiHeartLine className="text-danger" />
              )}
            </span>
            <span>{props.loveList.length > 0 ? props.loveList.length : ""}</span>
          </div>

          {/* Sub-function comment button */}
          <div className="mx-3">
            <span
              className={`${styles.commentButton} mx-1 fs-4`}
              onClick={handleCommentButtonClick}
            >
              <RiMessage2Fill className="text-primary" />
            </span>
            <span>{props.commentList.length > 0 ? props.commentList.length : ""}</span>
          </div>

          {/* Sub-function share button */}
          <div className="mx-3">
            <span
              className={`${styles.shareButton} mx-1 fs-4`}
              onClick={handleShareClick}
            >
              <RiShareForwardFill className="text-success" />
            </span>
            <span>{props.shareList.length > 0 ? props.shareList.length : ""}</span>
          </div>
        </div>

        {/* List of comments and comment input box */}
        {commentStatus && (
          <div className="mt-3">
            <div className="d-flex align-items-center">
              <Form className="w-100 mx-1">
                <Form.Group>
                  <Form.Control
                    type="text"
                    placeholder="Write a comment..."
                    value={commentContent}
                    onChange={handleCommentContentChange}
                  />
                </Form.Group>
              </Form>
              <span className="mx-1">{commentContent.length}/100</span>
              <Button
                variant="success"
                className="p-1"
                disabled={sendButtonDisable}
                onClick={sendComment}
              >
                <RiSendPlane2Fill className="fs-4" />
              </Button>
            </div>
            {props.commentList.map((commentItem) => (
              <div className="border rounded border-info my-3 px-2 pb-2" key={commentItem.id}>
                <div className="d-flex align-items-center my-2">
                  <Hashicon value={commentItem.userId} size={30} className="me-2" />
                  <span className="w-100 fw-bold">{commentItem.userFullname}</span>
                  {commentItem.userId === currentUserId && (
                      <div className="d-flex">
                        {/* Edit and delete icons */}
                        <Button
                          variant="outline-primary"
                          onClick={() =>
                            handleEditCommentClick(commentItem.id, commentItem.content)
                          }
                        >
                          <RiEditLine size={20} />
                        </Button>
                        <Button
                          variant="danger"
                          onClick={() => handleDeleteComment(commentItem.id)}
                        >
                          <RiDeleteBin6Line size={20} />
                        </Button>
                      </div>
                    )}
                </div>
                <div>{commentItem.content}</div>
              </div>
            ))}
          </div>
        )}
        {editCommentId && (
        <EditCommentModal
          show={showEditCommentModal}
          onClose={handleCloseEditCommentModal}
          postId={props.postId}
          commentId={editCommentId}
        />
      )}
      </Row>
    </div>
  );
}

export default PostItem;
