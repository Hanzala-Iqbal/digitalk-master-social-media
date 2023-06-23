import React,{useContext, useEffect,useState} from 'react'
import Posts from '../components/Posts';
import ComposePost from '../components/Compose';
import { DigiTalkContext } from '../context/DigitalkContext';

const HomeFeed = ({status}) => {
// const HomeFeed = () => {

  const {selfpostsArr,postsArr,fetchPostyAddess,connectedAccounts,fetchFriends,friendList,getPostsByExtension,postsByExtension}=useContext(DigiTalkContext);
  const [PostsArrUp, setPostsArrUp] = useState(postsByExtension)
  
  const checkAutherExists=(_userID)=>{
    // 23829329382932

    if(_userID==JSON.parse(localStorage.getItem("user")).id)
    {
      return true;
    }
    else
    {
      const updatedList=friendList.filter((friend)=>{
        // console.log("friend is:")
        // console.log(friend)
        // console.log("userId is:")
        // console.log(_userID)
        return friend._id==_userID;
       })
    
      //  console.log("updated list::::")
      //  console.log(updatedList)
    
       if(updatedList.length==1)
       {
        return true;
       }
       else
       {
         return false;
       }
    }
   

  }
// const [count, setcount] = useState(0)
    useEffect(()=>{

      if(status==="home")
      {
        
      const updatedPostArr= postsByExtension.filter((post)=>{

        if(post.status==="private")
        {
          if(checkAutherExists(post.userId))
          {
            return true;
          }
          return false;
        }
        else 
        {
          return true;
        }

       })

       setPostsArrUp(updatedPostArr);
      //  console.log("Filtered Array for home feed:")
      //  console.log(PostsArrUp)
      //   // for (let index = 0; index < postsArr.length; index++) {
        //   if(arr[index].status=="private")
        //   {
            
        //    checkAutherExists( arr[index].auther)
        //   }
          
        // }
      }
        
    },[PostsArrUp])
    // },[friendList])

  
  useEffect(() => {
    fetchPostyAddess()
    const extension=JSON.parse(localStorage.getItem("user")).email.split("@")[1].toLowerCase();
    getPostsByExtension(extension)
    fetchFriends(JSON.parse(localStorage.getItem("user")).id)

  }, [])
  return (
    <>
        <ComposePost />
        {
          status==="profile"?<Posts Arr={selfpostsArr} count={selfpostsArr.length}/>:<Posts Arr={PostsArrUp}  count={PostsArrUp.length}/>
        }
    </>
  )
}

export default HomeFeed