import React, { useEffect, useContext } from 'react';
//import { DigiTalkContext } from './context/DigitalkContext';
import './App.css'
import Routers from './routes/Routers'
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer';
import { DigiTalkContext } from './context/DigitalkContext';
import Background from './components/Background';


function App() {
  //const { checkIfEthereumExists } = useContext(DigiTalkContext); 

  const { connectedAccounts, connectWallet } = useContext(DigiTalkContext);
  const user = localStorage.getItem("user")
  return (
    <>
     <Background/>
      <div>
     
        {
          connectedAccounts && user ? <Navbar /> : <></>
        }
        <Routers />

        {/* <Footer /> */}
      </div>
    </>

  );
}

export default App
