import React, {useState, useEffect} from 'react';
import {useLocation} from 'react-router-dom';
import {SERVER_URL_GRADEBOOK} from '../../Constants';
// instructor view list of students enrolled in a section
// use location to get section no passed from InstructorSectionsView
// fetch the enrollments using URL /sections/{secNo}/enrollments
// display table with columns
//   'enrollment id', 'student id', 'name', 'email', 'grade'
//  grade column is an input field
//  hint:  <input type="text" name="grade" value={e.grade} onChange={onGradeChange} />

const EnrollmentsView = (props) => {

    const location = useLocation();
    const {secNo, courseId, secId, title} = location.state;
    const [enrollments, setEnrollments] = useState([]);
    const [grades, setGrades ] = useState({});

    // fetch enrollments
    // --
    useEffect(() => {
        fetch(`${SERVER_URL_GRADEBOOK}/sections/${secNo}/enrollments`)
        .then(response => {
            if(!response.ok){
                throw new Error('failed to fetch enrollments');
            }
            return response.json();
        })
        .then(data => {
            setEnrollments(data);
            // init grade state forevery enrollment
            const initialGrades = {};
            data.forEach((e) => {
                initialGrades[e.enrollmentId] = e.grade || '';
            });
            setGrades(initialGrades);
        })
        .catch(error => {
            console.error('there was a problem fetching the enrollments', error);
        });
    }, [secNo]);

    // handles grade input change
    const onGradeChange = (event, enrollmentId) => {
        const newGrade = event.target.value;
        setGrades((prevGrades) => ({ ...prevGrades, [enrollmentId]: newGrade }));
    };

    // -------
    // handles updating grades
    const updateGrades = async () => {
        const updatedEnrollments = enrollments.map(e => ({
            enrollmentId: e.enrollmentId,
            grade: grades[e.enrollmentId]
        }));

        try {
            const response = await fetch(`${SERVER_URL_GRADEBOOK}/enrollments`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedEnrollments)
            });

            if (!response.ok) {
                throw new Error(`error updating grades: ${response.statusText}`);
            }
            alert('grades updated successfully');
        } catch (error) {
            console.error('error updating grades:', error);
            alert(`error updating grades: ${error.message}`);
        }
    };

    return (
        <div>
            <h2>Enrollments for Section {secNo} - {title}</h2>
            <table className="Center" border="1" cellPadding="5">
                <thead>
                <tr>
                    <th>Enrollment ID</th>
                    <th>Student ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Grade</th>
                </tr>
                </thead>
                <tbody>
                {enrollments.map(e => (
                    <tr key={e.enrollmentId}>
                        <td>{e.enrollmentId}</td>
                        <td>{e.studentId}</td>
                        <td>{e.name}</td>
                        <td>{e.email}</td>
                        <td>
                            <input
                                type="text"
                                name="grade"
                                value={grades[e.enrollmentId] || ''}
                                onChange={(event) => onGradeChange(event, e.enrollmentId)}
                            />
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
            <br />
            <button onClick={updateGrades}>Update Grades</button>
        </div>
    );
}

export default EnrollmentsView;
