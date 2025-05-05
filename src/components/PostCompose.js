import React, { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import axios from "axios";
import imageCompression from "browser-image-compression";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Hashicon } from "@emeraldpay/hashicon-react";
import { useDispatch, useSelector } from "react-redux";
import { getFollowingPosts } from "../feature/followingPost/followingPostSlice";

function PostCompose() {
  const dispatch = useDispatch();
  const storeFollowingPosts = useSelector(
    (state) => state.followingPostReducer.followingPosts
  );

  const [userFullname, setUserFullname] = useState(
    localStorage.getItem("psnUserFirstName") +
      " " +
      localStorage.getItem("psnUserLastName")
  );
  const [userId, setUserId] = useState(localStorage.getItem("psnUserId"));
  const [postContent, setPostContent] = useState("");
  const [postContentCount, setPostContentCount] = useState(0);
  const [disablePostButton, setDisablePostButton] = useState(true);
  const [fileType, setFileType] = useState(null);
  const [file64String, setFile64String] = useState(null);
  const [file64StringWithType, setFile64StringWithType] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    dispatch(getFollowingPosts());
  }, [dispatch]);

  function showSuccessMessage(inputMessage) {
    toast.success(inputMessage, { position: "bottom-center", autoClose: 3000 });
  }

  function showFailMessage(inputMessage) {
    toast.error(inputMessage, { position: "bottom-center", autoClose: 3000 });
  }

  function handleContentChange(e) {
    setPostContent(e.target.value);
    setPostContentCount(e.target.value.length);
    setDisablePostButton(e.target.value.length === 200 || e.target.value.length > 200);
  }

  async function createPost(inputContent) {
    try {
      const response = await axios.post("/api/v1/insertpost", {
        id: null,
        userId: localStorage.getItem("psnUserId"),
        content: inputContent,
        image: fileType === "image" ? file64StringWithType : null,
        video: fileType === "video" ? file64StringWithType : null,
        createdAt: null,
        love: null,
        share: null,
        comment: null,
      }, {
        headers: { Authorization: localStorage.getItem("psnToken") },
      });

      if (response.data?.status === "success") {
        showSuccessMessage("Posted successfully!");
        setPostContent("");
        setPostContentCount(0);
        setDisablePostButton(true);
        setFile64String(null);
        setFile64StringWithType(null);
        setFileType(null);
        setVideoPreview(null);
        setImagePreview(null);
        dispatch(getFollowingPosts());
      } else {
        showFailMessage("Post failed. Please try again later!");
      }
    } catch (error) {
      showFailMessage("Post failed. Please try again later!");
    }
  }

  function onUploadFileChange(e) {
    if (!e.target.files.length) return;
    const file = e.target.files[0];

    if (file.type.startsWith("image/")) {
      setFileType("image");
      compressImageFile(file);
      setVideoPreview(null); // clear any video preview
    } else if (file.type.startsWith("video/")) {
      setFileType("video");
      processVideoFile(file);
      setImagePreview(null); // clear any image preview
    }
  }


// In processVideoFile (no changes needed, but it's correct)
function processVideoFile(videoFile) {
  const reader = new FileReader();
  reader.readAsDataURL(videoFile);
  reader.onload = () => {
    setFile64StringWithType(reader.result);  // Full string with "data:video/..."
    setFile64String(reader.result.split(",")[1]); // Just base64 part if needed
    setVideoPreview(reader.result); // Set preview
  };
  reader.onerror = () => showFailMessage("Failed to process video.");
}




  function fileToBase64(file, cb) {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => cb(null, reader.result);
    reader.onerror = (error) => cb(error, null);
  }

  async function compressImageFile(imageFile) {
    const options = { maxWidthOrHeight: 250, useWebWorker: true };
    try {
      const compressedFile = await imageCompression(imageFile, options);
      fileToBase64(compressedFile, (err, result) => {
        if (result) {
          setImagePreview(result);
          setFile64StringWithType(result);
          setFile64String(result.split(",")[1]);
        }
      });
    } catch (error) {
      showFailMessage("Image compression failed.");
    }
  }

  function processVideoFile(videoFile) {
    const reader = new FileReader();
    reader.readAsDataURL(videoFile);
    reader.onload = () => {
      setFile64StringWithType(reader.result);
      setVideoPreview(reader.result); // Set the video preview
    };
    reader.onerror = () => showFailMessage("Failed to process video.");
  }

  async function handleCreatePost(e) {
    e.preventDefault();

    if (!storeFollowingPosts || storeFollowingPosts.length === 3) {
      showFailMessage("Unable to check post limit. Please try again.");
      return;
    }

    const userPosts = storeFollowingPosts.filter(
      (post) => String(post.userId) === String(userId)
    );

    if (userPosts.length >= 3) {
      showFailMessage("You can only post up to 3 times.");
      return;
    }

    createPost(postContent);
  }

  return (
    <div>
      <div className="border rounded-3 border-dark p-3 shadow">
        <ToastContainer />
        <Form className="d-flex flex-column">
          <Form.Group className="mb-3">
            <Form.Label>
              <div className="d-flex align-items-center mb-1">
                <div className="mx-3">
                  <Hashicon value={userId} size={60} />
                </div>
                <div className="fs-4 fw-bold">{userFullname}</div>
              </div>
            </Form.Label>
            <Form.Control
              as="textarea"
              row={4}
              placeholder="What is happening?"
              value={postContent}
              onChange={handleContentChange}
              style={{ resize: "none", height: "7rem" }}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Upload Image or Video (Optional)</Form.Label>
            <Form.Control
              type="file"
              accept=".jpg, .jpeg, .png, .mp4, .webm, .ogg"
              onChange={onUploadFileChange}
            />
          </Form.Group>
          <div className="d-flex justify-content-end align-items-center">
            <span>Characters: {postContentCount}/200</span>
            <Button
              onClick={handleCreatePost}
              variant="success"
              disabled={disablePostButton}
              className="col-2 mx-3"
            >
              Post
            </Button>
          </div>
        </Form>

        {/* Preview Image or Video */}
        {fileType === "image" && imagePreview && (
          <img src={imagePreview} alt="chosen" className="mt-3" style={{ width: "100%", borderRadius: "5px" }} />
        )}
        {fileType === "video" && videoPreview && (
          <video controls className="mt-3" style={{ width: "100%", borderRadius: "5px" }}>
            <source src={videoPreview} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        )}
      </div>
    </div>
  );
}

export default PostCompose;
