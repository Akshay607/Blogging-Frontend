import { FaComments, FaHeart,FaShare} from "react-icons/fa";
import React,{useState,useEffect} from "react";
import axios from "axios";
import { DomainURL } from "../constants";

//import { localStorage } from "../App";




function TweetsPage(props) {
  const [tweets, setTweets] = useState([]); // State to hold the tweets
  var [userDetails,setUserDetails]=useState({})
  const [loading, setLoading] = useState(true); // State to handle loading state
  const [error, setError] = useState(null); // State to handle errors
  const [openCommentBoxId, setOpenCommentBoxId] = useState(null)
  const [isFormVisible, setIsFormVisible]=useState(false)
  
 // const [state]= useContext(localStorage)
  let myDetails = localStorage.getItem('loginInfo')
  myDetails = JSON.parse(myDetails)


  useEffect(() => {
    const fetchTweets = async () => {
      try {
        const res = await getAllTweets();
        let userRes = await getAllUserOfTweets(res)

        setTweets(res); // Assuming res is the array of tweets
        setUserDetails(userRes)
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTweets(); // Call the async function
  }, []); // Empty dependency array means this effect runs once on mount
  console.log('userDetails',userDetails)
  const handleCommentBoxToggle=(id)=>{
    setOpenCommentBoxId(prevId => (prevId==id ? null : id))
  }
  const handleCreateTweet=async (e)=>{
    e.preventDefault()
    const res = await createTweet(e.target[0].value, e.target[1].value, myDetails._id)
    

  }

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <>
      <div className="tweet list ml-8 w-2/3" style={{ paddingBottom: '100px', overflowX: 'hidden' }}>
        {/* Ensure there is enough padding at the bottom to avoid overlap with the form */}
        {tweets?.length === 0 ? (
          <p>No tweets available.</p>
        ) : (
          <ul>
            {tweets?.map((tweet) => (
              <TweetWithUser
                key={tweet._id}
                tweet={tweet}
                user={userDetails[tweet.userId]}
                isCommentBoxOpen={openCommentBoxId === tweet._id}
                onCommentBoxToggle={() => handleCommentBoxToggle(tweet._id)}
              />
            ))}
          </ul>
        )}
      </div>
      
         <div className="fixed flex align-end flex-col w-1/2  bottom-0">
         <button
           className={`rounded-t-lg text-sm border-gray-600 self-end h-6 w-28 px-2 py-1 mr-2 bg-gray-200 shadow-lg drop-shadow-lg transition-all duration-1000 ease-in-out ${
            !isFormVisible ? 'bg-gray-200 ' : ' bg-blue-200 '
          }`}
           onClick={()=>setIsFormVisible(prevState=>!prevState)}
         >
            <span
          className={`absolute inset-0 flex items-center justify-center transition-all duration-1000 ease-in-out ${
            isFormVisible ? 'opacity-0' : 'opacity-100'
          }`}
        >
          Create Tweet
        </span>
        <span
          className={`absolute inset-0 flex items-center justify-center transition-all duration-1000 ease-in-out ${
            isFormVisible ? 'opacity-100' : 'opacity-0 '
          }`}
        >
          ↓
        </span>
         </button>
         <div style={{	transitionDuration:'2s'}}
            className={`transition-all duration-1000  delay-0 ease-in-out overflow-hidden ${
              isFormVisible ? 'max-h-screen opacity-100' : 'max-h-0 opacity-50'
            }`}>
            <form
             id="tweet-create"
             onSubmit={handleCreateTweet}
             className="flex ml-4 flex-col flex-grow item-center rounded-lg shadow-lg drop-shadow-lg   bg-blue-50 border-gray-200 border-4 p-4 shadow-lg"
             style={{ overflowX: 'hidden' }}
           >
             <input
               type="text"
               placeholder="Title"
               className="w-10/12 border border-gray-400 rounded-md my-1 px-2 text-sm focus:outline-none focus:shadow-lg transition duration-150 ease-in-out"
             />
             <div className="flex items-start gap-2 p-1">
               <textarea
                 placeholder="What’s on your mind?"
                 className="border border-gray-300 rounded-lg p-2 text-sm resize-none focus:outline-none focus:shadow-lg transition duration-150 ease-in-out flex-grow"
               ></textarea>
               <button
                 type="submit"
                 className="bg-blue-500 text-white self-end rounded-lg px-3 py-1 text-sm hover:bg-blue-600 focus:outline-none focus:ring-blue-300 transition duration-150 ease-in-out"
               >
                 Create Tweet
               </button>
             </div>
           </form>
         </div>
        </div>
 
         
    </>
  );
}




function TweetWithUser(props) {
  const { user, tweet, isCommentBoxOpen, onCommentBoxToggle} = props;
  

  return (
    <div className="bg-white shadow-lg  rounded-lg overflow-hidden border border-gray-200 mb-2">
      <div className="flex items-start p-1 border-b border-grey-300">
        <img 
          src={user?.profileImg}
          alt={user?.username}
          className="h-6 w-6 rounded-full object-cover my-auto mx-3"
        />
        <div className="flex-1">
          <p className="font-semibold text-sm text-gray-800">{user?.username}</p>
          <p className="text-gray-600 text-xs p-0">{user?.name}</p>
        </div>
       
      </div>
      <Tweet  tweet={tweet}  isCommentBoxOpen={isCommentBoxOpen} onCommentBoxToggle={onCommentBoxToggle}></Tweet>
    </div>
  );
}

function Tweet(props){
  const { tweet, isCommentBoxOpen, onCommentBoxToggle} = props;
  const [likeCount,setLikeCount]=useState(0)

  return(
    < >
     <div className="py-1 px-4 flex  border border-grey-200 items-start justify-between">
        <div className="flex-grow">
          <p className="text-sm font-semibold text-gray-900">{tweet?.title}</p>
          <pre className="my-2 text-xs text-gray-700 whitespace-pre-wrap">{tweet?.bodyText}</pre>
        </div>
        <p className="text-xs text-gray-400 self-start" style={{ fontSize:'10px'}}>
          {tweet?.creationDateTime?.slice(0, 21).replace('T','  ')}
        </p>
      </div>
      <div className="flex justify-around p-0.5   border-gray-200 bg-gray-50">
        <button onClick={()=>{setLikeCount(likeCount+1)}} className="flex text-sm items-center text-red-400 hover:text-red-500">
          <FaHeart className="mr-1" />
           {likeCount}
        </button>
        <button onClick={onCommentBoxToggle}className="flex text-sm items-center text-gray-500 hover:text-blue-500">
          <FaComments className="mr-1" />
          Comment
        </button>
        <button className="flex items-center text-sm text-gray-500 hover:text-green-500">
          <FaShare className="mr-1" />
          Share
        </button>
      </div>
      {isCommentBoxOpen && 
        <div className=" p-1  flex items-center">
          <textarea
          className="flex-grow border text-sm border-gray-300 rounded-md p-1 mx-2 resize-y overflow-auto min-h-8"
          placeholder="Write a comment..."
            rows="1"  
          ></textarea>
          <button className="border text-xs border-gray-500 rounded-md p-1">
            Comment
          </button>
        </div>
      }
    </>
  )
}

export  {TweetsPage, Tweet};

//all util functions
const getAllTweets=async ()=>{
  try{
    const res = await axios.get(`${DomainURL}/tweets/get-all-tweets`)
    
    return res.data.data

  }catch(err){
    return err
  }

}

//need to improve
const getAllUserOfTweets=async (tweets)=>{
  let tweetsUserIds = new Set()
  
  tweets.forEach((tweet)=>{
    tweetsUserIds.add(tweet.userId)
  })
  let userDetails={}
  try{
    let res = await axios.get(`${DomainURL}/auth/all-users`)
    res=res.data.data[0].data
    res.forEach((ele)=>{
      if(tweetsUserIds.has(ele._id)){
        userDetails[`${ele._id}`]=ele
      }
    })
    return userDetails
  }
  catch(err){
    return err
  }
}

const createTweet=async(title,bodyText,userId) =>{
  try{
    
   
    const res = await axios.post(`${DomainURL}/tweets/create-tweet`,{title, bodyText, userId})
  
  }catch(err){
    return err;
  }

}


