import React, {useState} from 'react';

// student can view schedule of sections 
// use the URL /enrollments?studentId=3&year= &semester=
// The REST api returns a list of EnrollmentDTO objects
// studentId=3 will be removed in assignment 7

// to drop a course 
// issue a DELETE with URL /enrollments/{enrollmentId}

const ScheduleView = (props) => {
    const [year, setYear] = useState('');
    const [semester, setSemester] = useState('');
    const [schedule, setSchedule] = useState([]);

    //fetch the schedule
    const fetchSchedule = async () => {
        try {
            const response = await fetch(
                `http://localhost:8080/enrollments?studentId=3&year=${year}&semester=${semester}`
            );
            if (!response.ok) {
                throw new Error('failed to fetch schedule');
            }
            const data = await response.json();
            setSchedule(data);
        } catch (error) {
            console.error('error fetching schedule:', error);
            alert(`error: ${error.message}`);
        }
    };

    const dropCourse = async (enrollmentId) => {
        try {
            const response = await fetch(
                `http://localhost:8080/enrollments/${enrollmentId}`,
                {
                    method: 'DELETE',
                }
            );
            if (!response.ok) {
                throw new Error(`failed to drop course ${enrollmentId}`);
            }
            setSchedule((prev) => prev.filter((item) => item.enrollmentId !== enrollmentId));
        } catch (error) {
            console.error('error dropping course:', error);
            alert(`error: ${error.message}`);
        }
    };

    return (
        <div>
            <h2>View Class Schedule / Drop a Course</h2>
            <p>Enter year and semester to see your current schedule. Then click Drop to withdraw from a course.</p>

            <table className="Center">
                <tbody>
                <tr>
                    <td>Year:</td>
                    <td>
                        <input
                            type="text"
                            value={year}
                            onChange={(e) => setYear(e.target.value)}
                        />
                    </td>
                </tr>
                <tr>
                    <td>Semester:</td>
                    <td>
                        <input
                            type="text"
                            value={semester}
                            onChange={(e) => setSemester(e.target.value)}
                        />
                    </td>
                </tr>
                </tbody>
            </table>
            <br />
            <button onClick={fetchSchedule}>Show Schedule</button>
            <br /><br />

            {schedule.length > 0 && (
                <table className="Center" border="1" cellPadding="5">
                    <thead>
                    <tr>
                        <th>Enrollment ID</th>
                        <th>Course ID</th>
                        <th>Title</th>
                        <th>Grade</th>
                        <th>Drop</th>
                    </tr>
                    </thead>
                    <tbody>
                    {schedule.map((enroll) => (
                        <tr key={enroll.enrollmentId}>
                            <td>{enroll.enrollmentId}</td>
                            <td>{enroll.courseId}</td>
                            <td>{enroll.title}</td>
                            <td>{enroll.grade || ''}</td>
                            <td>
                                <button onClick={() => dropCourse(enroll.enrollmentId)}>
                                    Drop
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
            {schedule.length === 0 && (
                <p>No courses found. Enter year & semester, then click "Show Schedule".</p>
            )}
        </div>
    );

}

export default ScheduleView;
