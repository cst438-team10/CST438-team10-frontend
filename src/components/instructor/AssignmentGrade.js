import React, { useState, useEffect } from 'react';
import { SERVER_URL_GRADEBOOK } from '../../Constants';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Button from "@mui/material/Button";
import {Table} from "@mui/material";

// instructor enters students' grades for an assignment
// fetch the grades using the URL /assignments/{id}/grades
// REST api returns a list of GradeDTO objects
// display the list as a table with columns 'gradeId', 'student name', 'student email', 'score'
// score column is an input field
//  <input type="text" name="score" value={g.score} onChange={onChange} />


const AssignmentGrade = (props) => {
    const [grades, setGrades] = useState();
    const [openDialog, setOpenDialog] = useState(false);
    const [assignment, setAssingment] = useState(props.assignment);
    const tableHeaders = ["GradeId", "Student", "Student Email", "Score"]

    const fetchGrades = async () => {
        try {
            let response = await fetch(`${SERVER_URL_GRADEBOOK}/assignments/${assignment.id}/grades`);
            if (response.ok) {
                let data = await response.json();
                setGrades(data);
                console.log(data);
            } else {
                alert('Failed to fetch grades');
            }
        } catch (err) {
            console.error('Failed to fetch grades:', err);
        }
    };

    const saveGrades = async () => {
        try {
            let response = await fetch(`${SERVER_URL_GRADEBOOK}/grades`, {
                method: "PUT",
                headers:{
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(grades)
            })
            setOpenDialog(false)
            props.setRefreshFlag(props.refreshFlag+1)
        }catch (err){
            alert(`${err}`)
        }
    }

    useEffect(()=>{
        fetchGrades()
    }, [])

    return(
        <>
            <Button variant="outlined" onClick={()=>setOpenDialog(true)}>Grade</Button>
            <Dialog open={openDialog}>
                <DialogTitle>Update Grades for {assignment.title}</DialogTitle>
                <DialogContent  style={{paddingTop: 20}} >
                    <Table>
                        <tr>
                            {tableHeaders.map((th, idx)=>(
                                <th key={idx}>{th}</th>
                            ))}
                        </tr>
                        {grades && grades.map(grade =>(
                            <tbody>
                           <tr key={grade.gradeId}>
                               <td>{grade.gradeId}</td>
                            <td>{grade.studentName}</td>
                            <td>{grade.studentEmail}</td>
                               <TextField style={{padding:10}} fullWidth label="title" name="Score" value={grade.score} onChange={(e)=>{setGrades(grades.map(myGrade => myGrade.gradeId=== grade.gradeId?{...myGrade, score: e.target.value}:myGrade))}}/>
                           </tr>
                            </tbody>
                        ))}
                    </Table>
                </DialogContent>
                <DialogActions>
                    <Button onClick={()=>saveGrades()}>Save Grades</Button>
                    <Button onClick={()=>{
                        setAssingment(props.assignment)
                        setOpenDialog(false)}}>Cancel</Button>
                </DialogActions>
            </Dialog>

        </>
    );
}

export default AssignmentGrade;