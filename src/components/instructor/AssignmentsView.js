import React, {useState, useEffect} from 'react';
import {SERVER_URL} from '../../Constants';
import { useLocation } from 'react-router-dom';
import { Button } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
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
    const location = useLocation()
    const {secNo, title} = location.state || {}
    const tableHeaders = ["Id", "Title", "Due Date", "", "", ""]
    const getAssignments = async()=>{
        try{
            let response = await fetch(`${SERVER_URL}/sections/${secNo}/assignments`)
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

        }catch (err){
            alert(`${err}`)
        }
    }

    useEffect(()=>{
        getAssignments()
    }, [])
    return(
        <> 
           <h3>Assignments for <br></br>{title}</h3>
            <table className='Center'>
                <thead>
                    <tr>
                        {tableHeaders.map(th=>(
                            <th>{th}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                {assignments && assignments.map(assignment =>(
                    <tr key={assignment.id}>
                        <td>{assignment.id}</td>
                        <td>{assignment.title}</td>
                        <td>{assignment.dueDate}</td>
                        <td><Button variant="outlined">Grade</Button></td>
                        <td><Button variant="outlined">Edit</Button></td>
                        <td><Button variant="outlined" onClick={()=>deleteAssignments(assignment.id)}>Delete</Button></td>
                    </tr>
                ))}
                </tbody>
            </table>

            <Dialog open={openDeleteDialog}>

            </Dialog>
        </>
    );
}

export default AssignmentsView;
