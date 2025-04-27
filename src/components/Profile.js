import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getProfilePosts } from "../feature/checkProfile/checkProfileSlice";
import { getProfileInfo } from "../feature/checkProfile/checkProfileSlice";
import PostItem from "./PostItem";
import { Table } from "react-bootstrap";


function Profile() {
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.checkProfileReducer.profileId);
  const postList = useSelector((state) => state.checkProfileReducer.postList);
  const userInfo = useSelector(
    (state) => state.checkProfileReducer.profileInfo
  );

  useEffect(() => {
    if (userId !== null) {
      dispatch(getProfilePosts(userId));
      dispatch(getProfileInfo(userId));
    }
  }, []);

  return (
    <div>
      <h2>{userInfo.firstName} {userInfo.lastName}</h2>

      <Table striped bordered hover className="mt-5 mb-5">
        <thead>
          <tr>
            <th>Attribute</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Name</td>
            <td>{userInfo.firstName} {userInfo.lastName}</td>
          </tr>
          <tr>
            <td>Email</td>
            <td>{userInfo.email}</td>
          </tr>
          <tr>
            <td>Birthday</td>
            <td>{userInfo.birthday}</td>
          </tr>
          <tr>
            <td>ID</td>
            <td>{userInfo.id}</td>
          </tr>
        </tbody>
      </Table>

      {postList !== null ? (
        postList.map((postItem) => {
          return (
            <div>
              <div>                   
                
              </div>
              
            <PostItem
              key={postItem.id}
              postId={postItem.id}
              userId={postItem.userId}
              firstName={userInfo.firstName}
              lastName={userInfo.lastName}
              content={postItem.content}
              image={postItem.image}
              loveList={postItem.love}
              shareList={postItem.share}
              commentList={postItem.comment}
              postDate={postItem.createdAt}
            />
            </div>
          );
        })
      ) : (
        <span></span>
      )}
    </div>
  );
}

export default Profile;
