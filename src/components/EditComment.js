import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { editCommentThunk, getCommentById } from '../feature/followingPost/followingPostSlice';

function EditCommentModal({ show, onClose, postId, commentId }) {
  const [commentContent, setCommentContent] = useState('');
  const dispatch = useDispatch();

  useEffect(() => {
    if (show) {
      // Fetch the existing comment content when the modal is opened
      dispatch(getCommentById(commentId))
        .then((response) => {
          if (response.meta.requestStatus === 'fulfilled') {
            setCommentContent(response.payload.content); // Set the current comment content
          } else {
            toast.error('Error loading comment.');
            onClose(); // Close the modal if there's an error
          }
        });
    }
  }, [commentId, dispatch, show, onClose]);

  const handleContentChange = (e) => {
    setCommentContent(e.target.value);
  };

  const handleSubmit = () => {
    dispatch(editCommentThunk({ postId, commentId, newContent: commentContent }))
      .then((result) => {
        if (result.meta.requestStatus === 'fulfilled') {
          toast.success('Comment updated successfully!');
          onClose(); // Close the modal upon success
        } else {
          toast.error('Failed to update comment.');
          onClose();
        }
      });
  };

  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Comment</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="editCommentContent">
            <Form.Label>Comment Content</Form.Label>
            <Form.Control
              type="text"
              value={commentContent}
              onChange={handleContentChange}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Update Comment
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default EditCommentModal;
