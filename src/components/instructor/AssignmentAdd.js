import React, { useState } from 'react';
import { Button } from '@mui/material';
import {SERVER_URL} from '../../Constants';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
// complete the code.  
// instructor adds an assignment to a section
// use mui Dialog with assignment fields Title and DueDate
// issue a POST using URL /assignments to add the assignment

const AssignmentAdd = (props)  => {

    const [openDialog, setOpenDialog] = useState(false)
    const [assignment, setAssingment] = useState({secNo: props.secNo, title: '', dueDate: ''})
    const [errorMessage, setErrorMessage] = useState("")
    const addAssignment = async()=>{
        if (assignment.title == "" || assignment.dueDate == ""){
            setErrorMessage("All fields need to be filled out")
        }else{
            setErrorMessage("")
            try{
                let response  = await fetch(`${SERVER_URL}/assignments`,
                    {
                        method: "POST",
                        headers:{
                        'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(assignment)
                    })
                    setAssingment((prevAssignment) => ({...prevAssignment, title: "", dueDate: ""}))
                    if (response.status ===  200){
                        setOpenDialog(false)
                        props.setRefreshFlag(props.refreshFlag+1)
                    }
                
            }catch (err){
                alert(`${err}`)
            }
        }
    }
    return (
        <>
            <Button variant = "outlined" style={{marginTop: 20}} onClick={()=>setOpenDialog(true)}> Add Assignment + </Button>
            <Dialog open={openDialog}>
                <DialogTitle>Add Assignment</DialogTitle>
                <DialogContent  style={{paddingTop: 20}} >
                    {errorMessage.length > 0 && (
                        <p style={{color:"red"}}>{errorMessage}</p>
                    )}
                    <TextField style={{padding:12}} fullWidth label="title*" name="title" value={assignment.title} onChange={(e)=>{setAssingment(prevAssignment=>({...prevAssignment, title: e.target.value}))}}/> 
                    <TextField style={{padding:12}} type='date' fullWidth label="Due Date*" name="credits" value={assignment.dueDate} onChange={(e)=>{setAssingment(prevAssignment=>({...prevAssignment, dueDate: e.target.value}))}} /> 
                </DialogContent>
                <DialogActions>
                    <Button onClick={()=>addAssignment()}>Save</Button>
                    <Button onClick={()=>{
                        setAssingment((prevAssignment) => ({...prevAssignment, title: "", dueDate: ""}))
                        setOpenDialog(false)}}>Cancel</Button>
                </DialogActions>
            </Dialog>
        </>                       
    )
}

export default AssignmentAdd;
