import React,{useEffect,useState,useContext} from "react";

import axios from "axios";
import { DomainURL } from "../constants";

//import { localStorage } from "../App";
import {Tweet} from "./Tweet";



function Profile(props) {
  const [activeTab, setActiveTab] = useState('my-tweets');
  const [list, setList] = useState({ following: [], follower: [], all: [], myTweets: [] });
  const [openCommentBoxId, setOpenCommentBoxId] = useState(null);
  const [followedUsers, setFollowedUsers] = useState(new Set());
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility
  const [isUploading, setIsUploading] = useState(false);
  

  let myDetails = localStorage.getItem('loginInfo');
  myDetails = JSON.parse(myDetails);
console.log("myDetails profile",myDetails)

  useEffect(() => {
    const getList = async () => {
      try {
        const followingRes = await axios.get(`${DomainURL}/follow/following-list/${myDetails._id}/0`);
       
        var followingIds = new Set();
        followingRes.data.data.forEach((ele) => {
          followingIds.add(ele._id);
        });
        
       
        const followerRes = await axios.get(`${DomainURL}/follow/follower-list/${myDetails._id}/0`);
        

        const res = await axios.get(`${DomainURL}/tweets/get-my-tweets`, { params: { userId: myDetails._id } });
        followedUsers.size === 0 && setFollowedUsers(followingIds);
        setList((ps) => ({ ...ps,following: followingRes.data.data, follower: followerRes.data.data, myTweets: res.data.data }));
        myDetails.followerCount=followerRes.data.data.length
        myDetails.followingCount = followingRes.data.data.length
        myDetails.tweetsCount = res.data.data.length
        localStorage.setItem('loginInfo',JSON.stringify(myDetails))

      } catch (err) {
        console.log(err);
      }
    };
    getList();
  }, []);
  

  const handleTabClick = async (tab) => {
    if (tab === 'following') {
      const res = await axios.get(`${DomainURL}/follow/following-list/${myDetails._id}/0`);
      setList((ps) => ({ ...ps, following: res.data.data }));
      var followingIds = new Set();
      res.data.data?.forEach((ele) => {
        followingIds.add(ele._id);
      });
      followedUsers.size === 0 && setFollowedUsers(followingIds);
    } else if (tab === 'followers') {
      const res = await axios.get(`${DomainURL}/follow/follower-list/${myDetails._id}/0`);
      setList((ps) => ({ ...ps, follower: res.data.data }));
    } else if (tab === 'all' && list.all.length === 0) {
      const res = await axios.get(`${DomainURL}/auth/all-users`);
      setList((ps) => ({ ...ps, all: res.data.data[0].data }));
    } else if (tab === 'my-tweets') {
      const res = await axios.get(`${DomainURL}/tweets/get-my-tweets`, { params: { userId: myDetails._id } });
      setList((ps) => ({ ...ps, myTweets: res.data.data }));

    }
    setActiveTab(tab);
  };

  const handleCommentBoxToggle = (id) => {
    setOpenCommentBoxId((prevId) => (prevId === id ? null : id));
  };

  const returnList = () => {
    if (activeTab === 'all') return list.all;
    else if (activeTab === 'following') return list.following;
    else if (activeTab === 'followers') return list.follower;
  };

  const handleUploadProfilePic = async (e) => {
    e.preventDefault();
    setIsUploading(true)
    const formData = new FormData();
    formData.append('image', document.getElementById('profilePicInput').files[0]);
    formData.append('userId', myDetails._id);
    try {
      const response = await fetch(`${DomainURL}/auth/upload-profile`, {
        method: 'POST',
        body: formData,
        params:{userId:myDetails._id},
        query:{userId:myDetails._id}
      });

      if (response.ok) {
        const result = await response.json();
        // Handle successful profile picture upload
      
        setIsUploading(false)
        setIsModalOpen(false);
        myDetails.profileImg=result.file
        localStorage.setItem('loginInfo',JSON.stringify(myDetails))
        console.log(result,myDetails)
      } else {
        console.error('Upload failed');
      }
      
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="ml-8 w-2/3">
      <div className="flex border border-gray-200 px-6 py-8 rounded-md shadow-sm">
        <div id="profile" className="flex flex-col items-center w-1/3 relative">
          <img
            src={myDetails?.profileImg}
            alt={myDetails.username}
            className="h-12 w-12 aspect-w-16 object-cover rounded-full object-cover mt-2"
            onClick={() => setIsModalOpen(true)}
          />
          
          <p className="text-xs mt-2">{myDetails.username}</p>
          <p className="text-xs">{myDetails.email}</p>
        </div>
        <div className="flex flex-grow justify-around">
         
          <div id="my-tweets" className="flex flex-col items-center">
            <p className="text-center">{myDetails.tweetsCount}</p>
            <p className="text-center">Tweets</p>
          </div>
          <div id="follower" className="flex flex-col items-center">
            <p className="text-center">{myDetails.followerCount}</p>
            <p className="text-center">Followers</p>
          </div>
          <div id="following" className="flex flex-col items-center">
            <p className="text-center">{followedUsers.size}</p>
            <p className="text-center">Following</p>
          </div>
        </div>
      </div>
      <div>
        <div className="flex text-xs font-semibold justify-around">
          <a onClick={() => handleTabClick('my-tweets')} className={`border text-center py-1 border-gray-200 w-full ${activeTab === 'my-tweets' ? 'bg-blue-500 text-white' : ''}`}>
            My Tweets
          </a>
          <a onClick={() => handleTabClick('followers')} className={`border text-center py-1 border-gray-200 w-full ${activeTab === 'followers' ? 'bg-blue-500 text-white' : ''}`}>
            Followers
          </a>
          <a onClick={() => handleTabClick('following')} className={`border text-center py-1 border-gray-200 w-full ${activeTab === 'following' ? 'bg-blue-500 text-white' : ''}`}>
            Following
          </a>
          <a onClick={() => handleTabClick('all')} className={`border text-center py-1 border-gray-200 w-full ${activeTab === 'all' ? 'bg-blue-500 text-white' : ''}`}>
            Suggestions
          </a>
        </div>
        <ul id="list">
          {activeTab === 'my-tweets' ? (
            list.myTweets.map((tweet) => (
              <div key={tweet._id} className="border mb-2 shadow-md border-gray-300 rounded-md">
                <Tweet
                  tweet={tweet}
                  isCommentBoxOpen={openCommentBoxId === tweet._id}
                  onCommentBoxToggle={() => handleCommentBoxToggle(tweet._id)}
                />
              </div>
            ))
          ) : (
            <UserItem userList={returnList()} activeTab={activeTab} myDetails={myDetails} followedUsers={followedUsers} setFollowedUsers={setFollowedUsers} />
          )}
        </ul>
      </div>

      {/* Modal for uploading profile picture */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
          <img
            src={myDetails?.profileImg}
            alt={myDetails.username}
            className="w-full h-auto border border-gray-500 rounded-xl object-cover mb-4"
          />
            <form onSubmit={handleUploadProfilePic}>
              <input
                type="file"
                id="profilePicInput"
                name="file"
                accept="image/*"
                className="mb-2 text-xs"
                required
              />
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => {setIsModalOpen(false); setIsUploading(false)}}
                  className="px-4 py-1 text-sm bg-blue-500 text-white rounded-md mr-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1 text-sm bg-blue-500 text-white rounded-md"
                >
                   {isUploading ? <div className="spinner"></div> : 'Upload'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}




const UserItem = function (props) {
  const { userList, activeTab, myDetails,followedUsers, setFollowedUsers } = props;
  //const [state, setState] = useContext(localStorage)

 
  const handleFollow = async(e, userId) => {
    e.stopPropagation(); // Prevents event from bubbling up
    if (activeTab === 'all' || activeTab == 'following') {
      const res= await followUser(myDetails._id,userId)
      if(res.status == 200){
        setFollowedUsers(prevState => new Set(prevState).add(userId));
       // setState(ps=>({...ps,followingCount : ps.followingCount+1}))
      }     
    }
  }

  const handleUnFollow = async(e, userId) => {
    e.stopPropagation(); // Prevents event from bubbling up
    if (activeTab === 'all' || activeTab == 'following') {
      const res= await unFollowUser(myDetails._id,userId)
     
      if(res.status == 200){
        setFollowedUsers(prevState => {
          const newSet = new Set(prevState);
          newSet.delete(userId);
          return newSet;
        });
        //setState(ps=>({...ps, followingCount: ps.followingCount - 1}))
      }
      
    }
    
  };

  return (
    <ul>
      {userList?.map(user => (
        <li
          key={user._id}
          className="flex container items-center border border-gray-200 p-4 rounded-md shadow-sm mb-1"
         
        >
          <img
            src={user?.profileImg}
            alt={user.username}
            className="h-12 w-12 rounded-full object-cover mr-4"
          />
          <div className='flex-1'>
            <h2 className="text-lg pb-0 mb-0 font-semibold text-gray-800">{user.username}</h2>
            <p className="text-xs text-gray-500">{user.name}</p>
          </div>
          { (activeTab === 'all' || activeTab == 'following') && typeof(followedUsers)=='object'? 
              followedUsers?.has(user._id)? 
              <button onClick={(e) => handleUnFollow(e, user._id)} className="border border-black-500 shadow-md bg-grey-500 rounded-md px-4 py-1">UnFollow</button>
              :  <button onClick={(e) => handleFollow(e, user._id)} className="border border-black-500 shadow-md bg-grey-500 rounded-md px-4 py-1">Follow</button>
            : ''
          }
        </li>
      ))}
    </ul>
  );
};

async function followUser  (myId,followingId){

  try{
    const res = await axios.post(`${DomainURL}/follow/follow-user`,{
      followingUserId:followingId,
      myUserId:myId
   })
    return res
  }
  catch(err){
    return err
  }
}
async function unFollowUser  (myId,followingId){
  try{
  const res = await axios.post(`${DomainURL}/follow/unfollow-user`,{
    followingUserId:followingId,
    myUserId:myId
  })
  return res
  }
  catch(err){
    return err
  }
  }


export {Profile}