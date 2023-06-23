import React,{useState,useEffect,useContext} from 'react';
import Cookie from "js-cookie"
import { BASE_URL } from '../utils/config';
import { ethers } from "ethers";
import axios from 'axios';


export const UniversityContext=React.createContext();

export const UniversityProvider=({children})=>{
    const [universities, setUniversities] = useState([]);
    const [editeduniversities, setEditedUniversities] = useState([]);
    const [singleuniversity, setSingleuniversity] = useState("");

    const addUniversity = async (universityObj) => {
        try {
          await axios.post(`${BASE_URL}/universities/add`,
          {
            name: universityObj.name,
            // publicKey:publicKey,
            extension:universityObj.extension,
          });
          fetchUniversities();
        } catch (error) {
          console.error(error);
        }
      };

    const fetchUniversities = async () => {
        try {
          const response = await axios.get(`${BASE_URL}/universities/fetch`);
          setUniversities(response.data);
          setEditedUniversities(response.data)
        } catch (error) {
          console.error(error);
        }
      };


      const deleteUniversity = async (id) => {
        try {
          await axios.delete(`${BASE_URL}/universities/delete/${id}`);
          fetchUniversities();
        } catch (error) {
          console.error(error);
        }
      };
    
      const updateUniversity = async (id, updatedData) => {
        try {
            console.log("Inside Update university context")
            console.log(updatedData)
          await axios.patch(`${BASE_URL}/universities/update/${id}`, 
          {
            name: updatedData.name,
            // publicKey:publicKey,
            extension:updatedData.extension,
          });
          fetchUniversities();
        } catch (error) {
          console.error(error);
        }
      };

          
      const getUniversityById = async (id) => {
        try {
            const response = await axios.get(`${BASE_URL}/universities/fetchByid/${id}`);
            setSingleuniversity(response.data);
          } catch (error) {
            console.error(error);
          }
      };

    return(
        <UniversityContext.Provider value={{
            universities,
            editeduniversities,
            setEditedUniversities,
            setUniversities,
            setSingleuniversity,
            singleuniversity,
            addUniversity,
            fetchUniversities,
            deleteUniversity,
            updateUniversity,
            getUniversityById
        }}>
            {children}
        </UniversityContext.Provider>
    );

}