import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { Form, Button, Container } from "react-bootstrap";
import { getFeedbackDetails, updateFeedback } from "../feature/feedback/feedbackSlice";
import { ToastContainer, toast } from "react-toastify";
import { RiEditLine } from "react-icons/ri";

function EditFeedback() {
  const { feedbackId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const [feedbackContent, setFeedbackContent] = useState("");
  const [feedbackTitle, setFeedbackTitle] = useState("");
  const [feedbackCategory, setFeedbackCategory] = useState("general");
  const [characterCount, setCharacterCount] = useState(0);
  const [submitDisabled, setSubmitDisabled] = useState(true);
  
  const currentFeedback = useSelector(state => state.feedbackReducer.currentFeedback);
  const loading = useSelector(state => state.feedbackReducer.loading);

  useEffect(() => {
    if (localStorage.getItem("psnToken") === null) {
      navigate("/unauthorized");
    }
    
    dispatch(getFeedbackDetails(feedbackId));
  }, [dispatch, navigate, feedbackId]);

  useEffect(() => {
    if (currentFeedback) {
      setFeedbackContent(currentFeedback.content);
      setFeedbackTitle(currentFeedback.title);
      setFeedbackCategory(currentFeedback.category || "general");
      setCharacterCount(currentFeedback.content.length);
    }
  }, [currentFeedback]);

  useEffect(() => {
    setCharacterCount(feedbackContent.length);
    setSubmitDisabled(
      feedbackTitle.trim().length < 5 || 
      feedbackContent.trim().length < 10 || 
      feedbackContent.length > 500
    );
  }, [feedbackContent, feedbackTitle]);

  const handleContentChange = (e) => {
    setFeedbackContent(e.target.value);
  };

  const handleTitleChange = (e) => {
    setFeedbackTitle(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setFeedbackCategory(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const updatedData = {
      feedbackId,
      content: feedbackContent,
      title: feedbackTitle,
      category: feedbackCategory
    };
    
    dispatch(updateFeedback(updatedData))
      .unwrap()
      .then(() => {
        toast.success("Feedback updated successfully!");
        setTimeout(() => {
          navigate("/newsfeed/feedback");
        }, 2000);
      })
      .catch((error) => {
        toast.error("Failed to update feedback: " + error);
      });
  };

  if (loading || !currentFeedback) {
    return (
      <div className="text-center p-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  // If the feedback has already been reviewed, don't allow editing
  if (currentFeedback.status && currentFeedback.status !== "new") {
    return (
      <Container className="mt-5">
        <div className="alert alert-warning">
          <h4>Cannot edit this feedback</h4>
          <p>This feedback has already been reviewed and can no longer be edited.</p>
          <Button variant="primary" onClick={() => navigate("/newsfeed/feedback")}>
            Return to Feedback
          </Button>
        </div>
      </Container>
    );
  }

  return (
    <Container className="mt-3">
      <h2><RiEditLine className="me-2" />Edit Feedback</h2>
      
      <Form onSubmit={handleSubmit} className="mb-5">
        <Form.Group className="mb-3">
          <Form.Label>Feedback Title</Form.Label>
          <Form.Control
            type="text"
            placeholder="Brief summary of your feedback"
            value={feedbackTitle}
            onChange={handleTitleChange}
            maxLength={100}
          />
          <Form.Text className="text-muted">
            Min 5 characters required
          </Form.Text>
        </Form.Group>
        
        <Form.Group className="mb-3">
          <Form.Label>Category</Form.Label>
          <Form.Select 
            value={feedbackCategory}
            onChange={handleCategoryChange}
          >
            <option value="general">General Feedback</option>
            <option value="bug">Bug Report</option>
            <option value="feature_request">Feature Request</option>
            <option value="improvement">Improvement Suggestion</option>
            <option value="question">Question</option>
          </Form.Select>
        </Form.Group>
        
        <Form.Group className="mb-3">
          <Form.Label>Your Feedback</Form.Label>
          <Form.Control
            as="textarea"
            rows={5}
            placeholder="Please describe your feedback in detail..."
            value={feedbackContent}
            onChange={handleContentChange}
            maxLength={500}
          />
          <div className="d-flex justify-content-end mt-2">
            <span className={characterCount > 450 ? "text-danger" : "text-muted"}>
              {characterCount}/500
            </span>
          </div>
        </Form.Group>
        
        <div className="d-flex justify-content-between">
          <Button 
            variant="secondary" 
            onClick={() => navigate("/newsfeed/feedback")}
          >
            Cancel
          </Button>
          <Button 
            variant="primary" 
            type="submit" 
            disabled={submitDisabled || loading}
          >
            Update Feedback
          </Button>
        </div>
      </Form>
      <ToastContainer position="bottom-center" />
    </Container>
  );
}

export default EditFeedback;