import React from 'react';

const UserItem = function (props){
  const {userDetails,activeTab} =props
  console.log(props)
  const handelMessage=(e)=>{
    console.log('send message',e)
  }
  const handelFollow=()=>{
    console.log('follow him')
  }
  return (
    <div className="flex container items-center border border-gray-200 p-4 rounded-md shadow-sm mb-1">
      <img
        src={userDetails.avatarUrl}
        alt={userDetails.username}
        className="h-12 w-12 rounded-full object-cover mr-4"
      />
      <div className='flex-1'>
        <h2 className="text-lg pb-0 mb-0 font-semibold text-gray-800">{userDetails.username}</h2>
        <p className="text-xs   text-gray-500">{userDetails.name}</p>
      </div>
      <div className="">
        <button className='' onClick={activeTab == 'all'? handelFollow : handelMessage}>{activeTab == 'all' ? 'Follow' : 'Message'}</button>
      </div>
    </div>

  );
};



export  {UserItem};
