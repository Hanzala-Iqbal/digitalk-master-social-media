import React, { useContext, useState,useEffect } from 'react'
import { DigiTalkContext } from '../context/DigitalkContext';
import Loader from './Loader';
import PostItem from './PostItem';

const Posts = ({Arr,count}) => {
  const {isLoading} = useContext(DigiTalkContext);

  // const [count, setcount] = useState(0)
  // const [Arr, setArr] = useState([])
  // useEffect(() => {
  //   console.log("Array receivers:")
  //   // console.log(Arr)
  //   // if(status==="self")
  //   // {
  //   //   setArr(selfpostsArr)
  //   //   setcount(selfpostsArr.length);
  //   // }
  //   // else
  //   // {
  //   //   setArr(postsArr)
  //   //   setcount(postsArr.length);
  //   // }
  
  // }, [])
  

  
  return (
    <>
      {count > 0 ?
        <div className="container-fluid mt-5">
          <div className="row">
            {isLoading ?
              <Loader />
              :
              <div className='content mr-auto ml-auto posts_container'>

                {Arr.map((post, i) => {
                  return (
                    <PostItem post={post} key={i} />
                  )
                })
                }

              </div>
            }
          </div>
        </div> :
        <p className='text-center'>
          Write a post
        </p>

      }

    </>



  )
}

export default Posts