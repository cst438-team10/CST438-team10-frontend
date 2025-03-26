import React, {useEffect, useState} from 'react';
import {SERVER_URL} from "../../Constants";

// student views a list of assignments and assignment grades 
// use the URL  /assignments?studentId= &year= &semester=
// The REST api returns a list of SectionDTO objects
// Use a value of studentId=3 for now. Until login is implemented in assignment 7.

// display a table with columns  Course Id, Assignment Title, Assignment DueDate, Score

const AssignmentsStudentView = (props) => {

    const [ assignments, setAssignments ] = useState([ ]);

    const [ message, setMessage ] = useState('');

    const  fetchAssignments = async () => {
        try {
            const response = await fetch(`${SERVER_URL}/assignments?studentId=3&year=2025&semester=Spring`);
            if (response.ok) {
                const assignments = await response.json();
                setAssignments(assignments);
                console.log(assignments);
            } else {
                const json = await response.json();
                setMessage("response error: "+json.message);
            }
        } catch (err) {
            setMessage("network error: "+err);
        }
    }
    useEffect( () => {
        fetchAssignments();
    },  []);
     
    return(
        <>
            <h1>Assignments</h1>
            <table className="Center">
                <thead>
                <tr>
      <th>Course ID</th>
      <th>Assignment Title</th>
      <th>Due Date</th>
      <th>Score</th>
                </tr>
                </thead>
                <tbody>
                {assignments.map((a) => (
                    <tr key={a.assignmentId}>
                        <td>{a.courseId}</td>
                        <td>{a.title}</td>
                        <td>{a.dueDate}</td>
                        <td>{a.score}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </>
    );
}

export default AssignmentsStudentView;