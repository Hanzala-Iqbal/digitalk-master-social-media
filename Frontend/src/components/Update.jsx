import React,{useContext,useEffect,useState} from 'react'
import { UniversityContext } from '../context/UniversityContext';
import {
    Container,
    Row,
    Col,
    Form,
    FormGroup,
    Label,
    Input,
    Button,
    Modal,
    Table,
    Alert,
  } from "reactstrap";

const Update = ({uni,setidClicked,idClicked}) => {
    const { addUniversity,updateUniversity,deleteUniversity,fetchUniversities,universities,setEditedUniversities } = useContext(UniversityContext);
    const [university, setuniversity] = useState({
        name:uni.name,
        extension:uni.extension
    })

    const handleChange = (e) => {
        const nameAtt = e.target.name;

        setuniversity((prevState) => ({ ...prevState, [nameAtt]: e.target.value }));
    
        // console.log(formData)
    
    
      }
      const HandleSubmit = (event)  => {
        event.preventDefault();
        
        const updatedData = {
          name: university.name,
          extension: university.extension,
        };
        updateUniversity(idClicked, updatedData);

        setidClicked("")
      };
  return (
    <div>
        <form onSubmit={HandleSubmit}>
          <Row>
            <Col md={12}>
              <FormGroup>
              <Label for="name">University Name</Label>
                <Input
                  type="text"
                  name="name"
                  id="name"
                  onChange={handleChange}
                  value={university.name}
                  required
                />
              </FormGroup>
              <FormGroup>
                <Label for="extension">Title</Label>
                <Input
                  type="text"
                  name="extension"
                  id="extension"
                  onChange={handleChange}
                  value={university.extension}
                  required
                />
              </FormGroup>
             
            </Col>
            
          
          </Row>
          <div className="text-center">
            <button
              color="primary"   
              type="submit"
              className='btn btn-primary'
            >
              Update
            </button>
          </div>
        </form>
    </div>
  )
}

export default Update