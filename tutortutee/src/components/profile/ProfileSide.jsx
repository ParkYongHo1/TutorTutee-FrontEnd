import { useState } from "react";

import PostItem from "../../components/profile/post/PostItem";
import FollowerList from "../../components/profile/follower/FollowerList";
import FollowingList from "./following/FollowingList";
import ChangeInfo from "../../components/profile/ChangeInfo";
import ProfileSideInfo from "./ProfileSideInfo";
import ProfileSideTab from "./ProfileSideTab";
import WritePost from "./post/WritePost";

const ProfileSide = ({ member, memberNum, mine, setRefreshList }) => {
  const [activeComponent, setActiveComponent] = useState("posts");

  const renderActiveComponent = () => {
    switch (activeComponent) {
      case "changeInfo":
        return <ChangeInfo />;
      case "posts":
        return <PostItem />;
      case "followers":
        return <FollowerList memberNum={memberNum} />;
      case "following":
        return <FollowingList memberNum={memberNum} />;
      case "writePost":
        return <WritePost />;
      default:
        return <ChangeInfo />;
    }
  };
  return (
    <>
      <div className="mb-[12px] w-[250px] min-h-[750px]">
        <ProfileSideInfo
          member={member}
          memberNum={memberNum}
          mine={mine}
          setActiveComponent={setActiveComponent}
        />
        <ProfileSideTab
          member={member}
          memberNum={memberNum}
          mine={mine}
          setActiveComponent={setActiveComponent}
          setRefreshList={setRefreshList}
        />
      </div>
      <div className="w-[750px] ml-[20px] border min-h-[800px] rounded-[5px] p-6">
        {renderActiveComponent()}
      </div>
    </>
  );
};
export default ProfileSide;
