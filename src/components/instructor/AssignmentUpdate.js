import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { Button, TextField } from '@mui/material';
import {SERVER_URL} from '../../Constants';
//  instructor updates assignment title, dueDate 
//  use an mui Dialog
//  issue PUT to URL  /assignments with updated assignment

const AssignmentUpdate = (props)  => {
    const [openDialog, setOpenDialog] = useState(false)
    const [assignment, setAssingment] = useState(props.assignment)

    const saveEdit = async()=>{
      try{
        let response = await fetch(`${SERVER_URL}/assignments`,
          {
            method: "PUT",
            headers:{
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(assignment)
          })
          setOpenDialog(false)
          props.setRefreshFlag(props.refreshFlag+1)
      }catch (err){
        alert(`${err}`)
      }
    }
    return (
        <>
          <Button variant="outlined" onClick={()=>setOpenDialog(true)}>Edit</Button>
          <Dialog open={openDialog}>
            <DialogTitle>Update Assignment</DialogTitle>
            <DialogContent  style={{paddingTop: 20}} >
              <TextField style={{padding:10}} fullWidth label="title" name="title" value={assignment.title} onChange={(e)=>{setAssingment(prevAssignment=>({...prevAssignment, title: e.target.value}))}}/> 
              <TextField style={{padding:10}} type='date' fullWidth label="due date" name="credits" value={assignment.dueDate} onChange={(e)=>{setAssingment(prevAssignment=>({...prevAssignment, dueDate: e.target.value}))}} /> 
            </DialogContent>
            <DialogActions>
              <Button onClick={()=>saveEdit()}>Save</Button>
              <Button onClick={()=>{
                setAssingment(props.assignment)
                setOpenDialog(false)}}>Cancel</Button>
            </DialogActions>
          </Dialog>
          
        </>                       
    )
}

export default AssignmentUpdate;
