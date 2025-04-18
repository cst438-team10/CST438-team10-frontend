import React, {useState, useEffect} from 'react';
import {SERVER_URL} from "../../Constants";

// students gets a list of all courses taken and grades
// use the URL /transcripts?studentId=
// the REST api returns a list of EnrollmentDTO objects 
// the table should have columns for 
//  Year, Semester, CourseId, SectionId, Title, Credits, Grade

const Transcript = (props) => {

    const [transcript, setTranscript] = useState([ ]);
    const jwt = sessionStorage.getItem('jwt')
    // fetch the transcript
    useEffect(() => {
        fetch(`${SERVER_URL}/transcripts`, {
            method: 'GET',
            headers:{
                    'Authorization': jwt
                }
            }
        )
            .then((response) => {
                if(!response.ok){
                    throw new Error(`failed to fetch transcript: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => setTranscript(data))
            .catch((error) => {
                console.error('error fetching transcript:', error);
                alert(`error: ${error.message}`);
            });
    }, []);

    return (
        <div>
            <h2>Transcript</h2>
            <table className="Center" border="1" cellPadding="5">
                <thead>
                <tr>
                    <th>Year</th>
                    <th>Semester</th>
                    <th>Course ID</th>
                    <th>Section ID</th>
                    <th>Title</th>
                    <th>Credits</th>
                    <th>Grade</th>
                </tr>
                </thead>
                <tbody>
                {transcript.length > 0 ? (
                    transcript.map((item) => (
                        <tr key={item.enrollmentId}>
                            <td>{item.year}</td>
                            <td>{item.semester}</td>
                            <td>{item.courseId}</td>
                            <td>{item.sectionId}</td>
                            <td>{item.title}</td>
                            <td>{item.credits}</td>
                            <td>{item.grade || ''}</td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="7">No transcript data available</td>
                    </tr>
                )}
                </tbody>
            </table>
        </div>
    );
}

export default Transcript;
