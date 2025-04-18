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
    const [unEnrollingSection, setUnEnrollingSection] = useState({})
    const [openConfirmEnrollment, setOpenConfirmEnrollment] = useState(false)
    const [openConfirmUnEnrollment, setOpenConfirmUnEnrollment] = useState(false)
    const [currentEnrollments, setCurrentEnrollments] = useState([])
    const tableHeaders = ["Course Id", "Title", "Semester", "Days+Times", "Instructor Name", "Instructor Email", "Building", "Room", "Sec No", ""]
    const jwt = sessionStorage.getItem('jwt')
    console.log(jwt)
    const getOpenSections = async()=>{
        try{
            let response = await fetch(`${SERVER_URL}/sections/open`, 
                {
                    method: 'GET',
                    headers:{
                        'Authorization': jwt
                    }
                }
            )
            const courses = await response.json()
            console.log(courses)
            if(response.status === 200){
                setOpenSections(courses)
                console.log(courses)
            }else{
                alert(`Status ${response.status}\nProblem retrieving sections`)
            }
        }catch(err){
            alert(`${err}`)
        }
        
    }   

    const getMyEnrollments = async()=>{
        try{
            let response  = await fetch(`${SERVER_URL}/transcripts`, 
                {
                    method: 'GET',
                    headers:{
                        'Authorization': jwt
                    }
                })
            if (response.status === 200){
                let data = await response.json()
                setCurrentEnrollments(data)
                console.log(data)
            }else{
                alert(`Status ${response.status}\nProblem retrieving sections`)
            }
        }catch(err){
            alert(`${err}`)
        }
    }
    const enrollMe = async(secNo)=>{
        try{
            let response = await fetch(`${SERVER_URL}/enrollments/sections/${secNo}`, 
                {
                    method: 'POST',
                    headers: {
                        'Authorization': jwt,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(enrollingSection)
                }
            )
            if (response.status === 200){
                let status = await response.json()
                console.log(status)
                getMyEnrollments()
            }
        }catch(err){
            alert(`${err}`)
        }
        setOpenConfirmEnrollment(false)
    }
    const unenrollMe = async()=>{
        try{
            let response = await fetch(`${SERVER_URL}/enrollments/${unEnrollingSection.enrollmentId}`, 
                {
                    method: 'DELETE',
                    headers: {
                        'Authorization': jwt,
                        'Content-Type': 'application/json',
                    },
                }
            )
            getMyEnrollments()
        }catch(err){
            console.log("here")
            alert(`${err}`)
        }
        setOpenConfirmUnEnrollment(false)
        
    }
    useEffect(()=>{
        getOpenSections()
        getMyEnrollments()
    }, [])
 
    return(
        <>
           <table className="Center">
            <thead>
            <tr>
                {tableHeaders.map((header, idx)=>(
                    <th key={idx}>{header}</th>
                ))}
            </tr>
            </thead>
            <tbody>
            {openSections.map((s, idx)=>(
                <tr key={s.secNo} id={s.secNo}>
                    <td>{s.courseId}</td>
                    <td>{s.title}</td>
                    <td>{s.semester+" "+s.year}</td>
                    <td>{s.times}</td>
                    <td>{s.instructorName}</td>
                    <td>{s.instructorEmail}</td>
                    <td>{s.building}</td>
                    <td>{s.room}</td>
                    <td>{s.secNo}</td>
                    <td>{currentEnrollments.find(enrollment => enrollment.sectionNo == s.secNo)?
                        <Button onClick={()=>{
                            const enrollment = currentEnrollments.find(enrollment => enrollment.sectionNo == s.secNo)
                            setUnEnrollingSection(enrollment)
                            setOpenConfirmUnEnrollment(true)
                        }}variant="contained">
                            Drop
                        </Button>
                        :
                        <Button variant="contained" onClick={()=>{
                        setOpenConfirmEnrollment(true)
                        setEnrollingSection(s)
                        }}>Enroll</Button>
                    }</td>
                </tr>
            ))}
            </tbody>
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
           <Dialog open={openConfirmUnEnrollment}>
                <DialogTitle>Are you sure you would like to drop {unEnrollingSection.title} for {unEnrollingSection.semester+" "+unEnrollingSection.year}</DialogTitle>
                <DialogActions>
                    <Button color='primary' onClick={()=>{
                        unenrollMe(unEnrollingSection.secNo)
                    }}>Unenroll</Button>
                    <Button color="secondary" onClick={()=>{
                        setOpenConfirmUnEnrollment(false)
                    }}>Cancel</Button>
                </DialogActions>
           </Dialog>
        </>
    );
}

export default CourseEnroll;
