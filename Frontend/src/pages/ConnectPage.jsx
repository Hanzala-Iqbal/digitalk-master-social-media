
import React, { useContext,useState,useEffect } from 'react'
import { DigiTalkContext } from '../context/DigitalkContext';
import { useNavigate } from "react-router-dom";
import logo from "../../public/Images/logo.png";

const ConnectPage = () => {
    const { connectedAccounts,connectWallet } = useContext(DigiTalkContext);
  return (
    <div>
        <div className='container text-center d-flex flex-column justify-content-center' style={{height:"90vh", display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}} >
           <img className="mb-4" src={logo} alt="" width="250" height="100"/>
          <h1>
            Connect to the wallet in order to continue👀
          </h1>
          <button type='button' className='btn btn-primary mt-3 ' onClick={connectWallet} style={{width:"200px",textAlign:"center"}}>
              Connect to Wallet
            </button>
        </div>
    </div>
  )
}

export default ConnectPage;