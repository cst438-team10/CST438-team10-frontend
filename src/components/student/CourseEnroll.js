import React, {useState, useEffect} from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import {SERVER_URL} from '../../Constants';

// students displays a list of open sections for a 
// use the URL /sections/open
// the REST api returns a list of SectionDTO objects

// the student can select a section and enroll
// issue a POST with the URL /enrollments/sections/{secNo}?studentId=3
// studentId=3 will be removed in assignment 7.

const CourseEnroll = (props) => {
    const [openSections, setOpenSections] = useState([])
    const [enrollingSection, setEnrollingSection] = useState({})
    const [openConfirmEnrollment, setOpenConfirmEnrollment] = useState(false)
    const tableHeaders = ["Course Id", "Title", "Semester", "Days+Times", "Instructor Name", "Instructor Email", "Building", "Room", "Sec No", ""]
    const getOpenSections = async()=>{
        try{
            let response = await fetch(`${SERVER_URL}/sections/open`)
            const courses = await response.json()
            if(response.status == 200){
                setOpenSections(courses)
            }else{
                alert(`Error ${response.status}\nProblem retrieving sections`)
            }
        }catch(err){
            alert(`${err}`)
        }
        
    }   
    const enrollMe = async(secNo)=>{
        try{
            let response = await fetch(`${SERVER_URL}/enrollments/sections/${secNo}?studentId=3`)
            
        }catch(err){
            alert(`${err}`)
        }
        setOpenConfirmEnrollment(false)
    }
    useEffect(()=>{
        getOpenSections()
    }, [])
 
    return(
        <>
           <table className="Center">
            <tr>
                {tableHeaders.map((header, idx)=>(
                    <th id={idx}>{header}</th>
                ))}
            </tr>
            {openSections.map((s, idx)=>(
                <tr id={s.secId}>
                    <td>{s.courseId}</td>
                    <td>{s.title}</td>
                    <td>{s.semester+" "+s.year}</td>
                    <td>{s.times}</td>
                    <td>{s.instructorName}</td>
                    <td>{s.instructorEmail}</td>
                    <td>{s.building}</td>
                    <td>{s.room}</td>
                    <td>{s.secNo}</td>
                    <td><Button onClick={()=>{
                        setOpenConfirmEnrollment(true)
                        setEnrollingSection(s)
                        }}>Enroll</Button></td>
                </tr>
            ))}
           </table>
           <Dialog open={openConfirmEnrollment}>
                <DialogTitle>Are you sure you would like to enroll in {enrollingSection.title} for {enrollingSection.semester+" "+enrollingSection.year}</DialogTitle>
                <DialogActions>
                    <Button color='primary' onClick={()=>{
                        enrollMe(enrollingSection.secNo)
                    }}>Enroll</Button>
                    <Button color="secondary" onClick={()=>{
                        setOpenConfirmEnrollment(false)
                    }}>Cancel</Button>
                </DialogActions>
           </Dialog>
        </>
    );
}

export default CourseEnroll;
