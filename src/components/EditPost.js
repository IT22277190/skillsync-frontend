import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import axios from "axios"; // For API requests
import { useDispatch } from "react-redux";
import { editPostThunk } from "../feature/followingPost/followingPostSlice";
import { ToastContainer, toast } from "react-toastify";
import compressImageFile from "browser-image-compression";

function EditPost() {
  const { postId } = useParams(); // Get post ID from route parameters
  const navigate = useNavigate(); // For navigation
  const dispatch = useDispatch();

  // State to hold the existing post data
  const [postContent, setPostContent] = useState("");
  const [postContentCount, setPostContentCount] = useState(0);
  const [disableEditButton, setDisableEditButton] = useState(true);
  const [file64StringWithType, setFile64StringWithType] = useState(null);

  // Load existing post data when component mounts
  useEffect(() => {
    async function fetchPostData() {
      try {
        const response = await axios.get(`/api/v1/getpost/${postId}`, {
          headers: {
            Authorization: localStorage.getItem("psnToken"), // Auth token
          },
        });

        if (response.status === 200) {
          const postData = response.data.payload; // Extracting post data from response
          setPostContent(postData.content); // Set the post content
          setPostContentCount(postData.content.length); // Set the character count
          setFile64StringWithType(postData.image); // Set the existing image
          setDisableEditButton(
            postData.content.length === 0 || postData.content.length > 200
          );
        }
      } catch (error) {
        console.error("Failed to retrieve post data:", error);
      }
    }

    fetchPostData(); // Fetch the post data when the component mounts
  }, [postId]); // Re-run when postId changes

  const handleContentChange = (e) => {
    const content = e.target.value;
    setPostContent(content);
    setPostContentCount(content.length);
    setDisableEditButton(content.length === 0 || content.length > 200);
  };

  const handleUpdatePost = async (e) => {
    e.preventDefault();

    const updatedPost = {
      id: postId, // Post ID from route parameters
      content: postContent,
      image: file64StringWithType, // Existing or new image
    };

    dispatch(editPostThunk(updatedPost))
      .unwrap() // Access the resolved or rejected result
      .then(() => {
        toast.success("Post updated successfully!");
        navigate("/newsfeed"); // Navigate back to another page
      })
      .catch((error) => {
        toast.error("Failed to update the post.");
        console.error("Error updating post:", error);
      });
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="border rounded-3 border-primary p-4 shadow">
            <ToastContainer />
            <Form onSubmit={handleUpdatePost}>
              <Form.Group className="mb-3">
                <Form.Control
                  as="textarea"
                  rows={4}
                  value={postContent}
                  onChange={handleContentChange}
                  style={{ resize: "none" }}
                  placeholder="Enter your post content..."
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Change Image (Optional)</Form.Label>
                <Form.Control
                  type="file"
                  accept=".jpg, .jpeg, .png"
                  onChange={(e) => compressImageFile(e)}
                />
              </Form.Group>

              <div className="d-flex justify-content-between align-items-center">
                <span>Characters: {postContentCount}/200</span>
                <Button
                  variant="success"
                  disabled={disableEditButton}
                  type="submit"
                >
                  Update
                </Button>
              </div>

              {file64StringWithType && (
                <img
                  src={file64StringWithType}
                  alt="existing or new image"
                  className="mt-3 img-fluid"
                />
              )}
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditPost;
