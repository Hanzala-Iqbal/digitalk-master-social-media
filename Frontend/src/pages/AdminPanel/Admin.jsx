import React, { useContext, useEffect, useState } from 'react';
import { UniversityContext } from '../../context/UniversityContext';
import { DigiTalkContext } from '../../context/DigitalkContext';
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
import Update from '../../components/Update';
import "./Admin.css";

const Admin = () => {
    const { addUniversity, updateUniversity, deleteUniversity, fetchUniversities, universities, editeduniversities, setEditedUniversities } = useContext(UniversityContext);
    const { checkAdmin } = useContext(DigiTalkContext);
    const [university, setuniversity] = useState({
        name: "",
        extension: ""
    });
    const [render, setrender] = useState(false);
    const [idClicked, setidClicked] = useState("");
    const [isAdmin, setIsAdmin] = useState(false);

    const handleChange = (e) => {
        const nameAtt = e.target.name;
        setuniversity((prevState) => ({ ...prevState, [nameAtt]: e.target.value }));
    };

    useEffect(() => {
        fetchUniversities();
        const checkAdminStatus = async () => {
            console.log("Email from Local Storage: ", JSON.parse(localStorage.getItem("user")).email);
            const isAdmin = await checkAdmin(JSON.parse(localStorage.getItem("user")).email);
            setIsAdmin(isAdmin);
        };
        checkAdminStatus();
    }, []);

    const handleAdd = () => {
        addUniversity(university);
        setuniversity({
            name: "",
            extension: ""
        });
    };

    const handleDelete = (id) => {
        deleteUniversity(id);
    };

    const handleUpdate = (id) => {
        setrender(!render);
        setidClicked(id);
    };

    return (
        <div className='p-2 main_container'>
            {isAdmin ? (
                <div>
                    { <div>
                    <Container fluid style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                        <div className="text-center mb-4">
                            <h2 className="display-4 font-weight-bold">Add University</h2>
                        </div>
                        <Row className='text-center' >
                            <Col>
                                <FormGroup>
                                    <input
                                        type="text"
                                        placeholder="Enter University Name"
                                        className='p-1'
                                        style={{ width: "40%" }}
                                        id='name'
                                        name="name"
                                        value={university.name}
                                        onChange={(e) => handleChange(e)}
                                        required
                                    />
                                </FormGroup>
                                <FormGroup>
                                    <input
                                        type="text"
                                        placeholder="Enter Valid University Extension"
                                        name='extension'
                                        className='p-1'
                                        style={{ width: "40%" }}
                                        id='extension'
                                        value={university.extension}
                                        onChange={(e) => handleChange(e)}
                                        required
                                    />
                                </FormGroup>
                                <p style={{ color: "red" }}>Add correct extension e.g for roll number bsef19m026@pucit.edu.pk extension will be<span style={{ fontWeight: "bold" }}> pucit.edu.pk</span></p>
                                <button className='btn btn-primary' onClick={handleAdd}>Add University</button>
                            </Col>
                        </Row>
                    </Container>
                    <hr />
                    <Container fluid className='p-3'>
                        <div className="text-center mb-4">
                            <h4 className="display-4 font-weight-bold">List of University</h4>
                        </div>
                        <Table responsive striped bordered hover style={{ color: "white" }}>
                            <thead>
                                <tr>
                                    <th>University Name</th>
                                    <th>Extension</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {editeduniversities.map((uni, index) => (
                                    <React.Fragment key={uni._id}>
                                        <tr>
                                            <td style={{ color: "white" }}>{uni.name}</td>
                                            <td style={{ color: "white" }}>{uni.extension}</td>
                                            <td style={{ color: "white" }}>
                                                <Button className='btn btn-success m-3' onClick={() => handleUpdate(uni._id)}>Update</Button>
                                                <Button className='btn btn-danger' onClick={() => handleDelete(uni._id)}>Delete</Button>
                                            </td>
                                        </tr>
                                        <tr>
                                            {render && idClicked === uni._id && <Update uni={uni} setidClicked={setidClicked} idClicked={idClicked} />}
                                        </tr>
                                    </React.Fragment>
                                ))}
                            </tbody>
                        </Table>
                    </Container>
                    </div>}
                </div>
            ) : (
                <div>
                    <h1 className='text-center mt-5'>You don't have Admin Privileges.</h1>
                </div>
            )}
        </div>
    );
};

export default Admin;
