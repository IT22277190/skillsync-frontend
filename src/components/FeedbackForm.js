import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Form, Button, Container, Row, Col, Card } from "react-bootstrap";
import { 
  submitFeedback, 
  getUserFeedback,
  deleteFeedback // Add this import
} from "../feature/feedback/feedbackSlice";
import { ToastContainer, toast } from "react-toastify";
import { RiFeedbackLine } from "react-icons/ri";


function FeedbackForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [feedbackContent, setFeedbackContent] = useState("");
  const [feedbackCategory, setFeedbackCategory] = useState("general");
  const [feedbackTitle, setFeedbackTitle] = useState("");
  const [characterCount, setCharacterCount] = useState(0);
  const [submitDisabled, setSubmitDisabled] = useState(true);
  
  const loading = useSelector(state => state.feedbackReducer.loading);
  const userFeedback = useSelector(state => state.feedbackReducer.userFeedback);

  useEffect(() => {
    if (localStorage.getItem("psnToken") === null) {
      navigate("/unauthorized");
    }
    
    dispatch(getUserFeedback());
  }, [dispatch, navigate]);

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
    
    const feedbackData = {
      userId: localStorage.getItem("psnUserId"),
      title: feedbackTitle,
      content: feedbackContent,
      category: feedbackCategory
    };
    
    dispatch(submitFeedback(feedbackData))
      .unwrap()
      .then(() => {
        toast.success("Feedback submitted successfully!");
        setFeedbackContent("");
        setFeedbackTitle("");
        setFeedbackCategory("general");
      })
      .catch((error) => {
        toast.error("Failed to submit feedback: " + error);
      });
  };

  return (
    <Container className="mt-3">
      <Row>
        <Col>
          <h2><RiFeedbackLine className="me-2" />Submit Feedback</h2>
          <p className="text-muted">
            We value your input! Please share your thoughts, suggestions, or report any issues.
          </p>
          
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
            
            <Button 
              variant="primary" 
              type="submit" 
              disabled={submitDisabled || loading}
              className="mt-3"
            >
              {loading ? "Submitting..." : "Submit Feedback"}
            </Button>
          </Form>

          <h3 className="mb-4">Your Previous Feedback</h3>
          {loading && !userFeedback ? (
            <div className="text-center">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : userFeedback && userFeedback.length > 0 ? (
            userFeedback.map((feedback) => (
              <Card key={feedback.id} className="mb-3">
                <Card.Header className="d-flex justify-content-between align-items-center">
                  <div>
                    <strong>{feedback.title}</strong>
                    <span className="badge bg-secondary ms-2">{feedback.category}</span>
                  </div>
                  <span className="text-muted small">
                    {new Date(feedback.createdAt).toLocaleDateString()}
                  </span>
                </Card.Header>
                <Card.Body>
                  <Card.Text>{feedback.content}</Card.Text>
                </Card.Body>
                <Card.Footer className="text-muted d-flex justify-content-between">
                  <span>Status: <strong>{feedback.status || "Pending"}</strong></span>
                  {(feedback.status === "new" || !feedback.status) && (
                    <div>
                      <Button 
                        variant="outline-primary" 
                        size="sm" 
                        className="me-2"
                        onClick={() => navigate(`/newsfeed/feedback/${feedback.id}/edit`)}
                      >
                        Edit
                      </Button>
                      <Button 
                        variant="outline-danger" 
                        size="sm"
                        onClick={() => {
                          if(window.confirm("Are you sure you want to delete this feedback?")) {
                            dispatch(deleteFeedback(feedback.id));
                          }
                        }}
                      >
                        Delete
                      </Button>
                    </div>
                  )}
                </Card.Footer>
              </Card>
            ))
          ) : (
            <div className="text-center p-4 bg-light rounded">
              <p className="mb-0">You haven't submitted any feedback yet.</p>
            </div>
          )}
        </Col>
      </Row>
      <ToastContainer position="bottom-center" />
    </Container>
  );
}

export default FeedbackForm;