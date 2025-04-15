import React, {useState, useEffect} from 'react';
import {SERVER_URL_GRADEBOOK} from '../../Constants';
import { useLocation } from 'react-router-dom';
import { Button } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import AssignmentUpdate from './AssignmentUpdate';
import AssignmentAdd from './AssignmentAdd';
import AssignmentGrade from "./AssignmentGrade";
// instructor views assignments for their section
// use location to get the section value 
// 
// GET assignments using the URL /sections/{secNo}/assignments
// returns a list of AssignmentDTOs
// display a table with columns 
// assignment id, title, dueDate and buttons to grade, edit, delete each assignment

const AssignmentsView = () => {
    const [assignments, setAssignments] = useState()
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
    const [deletingAssignment, setDeletingAssignment] = useState({})
    const [refreshFlag, setRefreshFlag] = useState(-1)
    const location = useLocation()
    const {secNo, title} = location.state || {}
    const tableHeaders = ["Id", "Title", "Due Date", "", "", ""]
    const getAssignments = async()=>{
        try{
            let response = await fetch(`${SERVER_URL_GRADEBOOK}/sections/${secNo}/assignments`)
            if(response.status === 200){
                let data = await response.json()
                setAssignments(data)
                console.log(data)
            }
        }catch(err){
            alert(`${err}`)
        }
    }

    const deleteAssignments = async(id)=>{
        try{
            let response = await fetch(`${SERVER_URL_GRADEBOOK}/assignments/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    }})
            if (response.status === 200){
                getAssignments()
                setOpenDeleteDialog(false)
            }
        }catch (err){
            alert(`${err}`)
        }
    }

    useEffect(()=>{
        getAssignments()
    }, [, refreshFlag])
    return(
        <>
           <h3>Assignments for <br></br>{title}</h3>
            <table className='Center'>
                <thead>
                    <tr>
                        {tableHeaders.map((th, idx)=>(
                            <th key={idx}>{th}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                {assignments && assignments.map(assignment =>(
                    <tr key={assignment.id}>
                        <td>{assignment.id}</td>
                        <td>{assignment.title}</td>
                        <td>{assignment.dueDate}</td>
                        <td><AssignmentGrade assignment={assignment} refreshFlag={refreshFlag} setRefreshFlag={setRefreshFlag}/></td>
                        <td><AssignmentUpdate assignment={assignment} refreshFlag={refreshFlag} setRefreshFlag={setRefreshFlag}/></td>
                        <td><Button variant="outlined" onClick={()=>{
                            setDeletingAssignment(assignment)
                            setOpenDeleteDialog(true)}}>Delete</Button></td>
                    </tr>
                ))}
                </tbody>
            </table>
            <AssignmentAdd secNo={secNo} refreshFlag={refreshFlag} setRefreshFlag={setRefreshFlag}/>
            <Dialog open={openDeleteDialog}>
                <DialogTitle>Delete Assignment</DialogTitle>
                <DialogContent  style={{paddingTop: 20}} >
                    Would you like to delete {deletingAssignment.title}?
                </DialogContent>
                <DialogActions>
                    <Button variant='outlined' onClick={()=>{
                        deleteAssignments(deletingAssignment.id)
                    }}  color="error">Delete</Button>
                    <Button variant='outlined' onClick={()=>{
                        setDeletingAssignment({})
                        setOpenDeleteDialog(false)}}>Cancel</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

export default AssignmentsView;
