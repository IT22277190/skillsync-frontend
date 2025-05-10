import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card, Container, Row, Col } from "react-bootstrap";
import { getPublicReviews } from "../feature/feedback/feedbackSlice";
import { Hashicon } from "@emeraldpay/hashicon-react";
import { RiStarFill } from "react-icons/ri";

function PublicReviews() {
  const dispatch = useDispatch();
  const publicReviews = useSelector(state => state.feedbackReducer.publicReviews);
  const loading = useSelector(state => state.feedbackReducer.loading);

  useEffect(() => {
    dispatch(getPublicReviews());
  }, [dispatch]);

  // Helper function to generate rating stars
  const renderRatingStars = (rating) => {
    const stars = [];
    const count = rating || 5; // Default to 5 if not provided
    
    for (let i = 0; i < count; i++) {
      stars.push(<RiStarFill key={i} className="text-warning" />);
    }
    
    return <div>{stars}</div>;
  };

  if (loading || !publicReviews) {
    return (
      <div className="text-center p-4">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (publicReviews.length === 0) {
    return null; // Don't show anything if no reviews
  }

  // Display only top 3 reviews
  const topReviews = publicReviews.slice(0, 3);

  return (
    <Container className="my-5">
      <h2 className="text-center mb-4">What Our Users Say</h2>
      <Row>
        {topReviews.map((review) => (
          <Col md={4} key={review.id} className="mb-4">
            <Card className="h-100 shadow-sm">
              <Card.Body>
                <div className="d-flex align-items-center mb-3">
                  <Hashicon value={review.userId} size={40} className="me-3" />
                  <div>
                    <h5 className="mb-0">{review.userFullName || "SkillSync User"}</h5>
                    {renderRatingStars(review.rating)}
                  </div>
                </div>
                <Card.Title>{review.title}</Card.Title>
                <Card.Text className="text-muted">
                  {review.content.length > 150 
                    ? review.content.substring(0, 150) + "..." 
                    : review.content}
                </Card.Text>
              </Card.Body>
              <Card.Footer className="text-muted bg-white">
                <small>
                  {new Date(review.createdAt).toLocaleDateString()}
                </small>
              </Card.Footer>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default PublicReviews;