import React, {useState, useEffect} from 'react';
import { useLocation } from 'react-router-dom';
import {SERVER_URL} from '../../Constants';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

// instructor views a list of sections they are teaching 
// use the URL /sections?email=dwisneski@csumb.edu&year= &semester=
// the email= will be removed in assignment 7 login security
// The REST api returns a list of SectionDTO objects
// The table of sections contains columns
//   section no, course id, section id, building, room, times and links to assignments and enrollments
// hint:  
// <Link to="/enrollments" state={section}>View Enrollments</Link>
// <Link to="/assignments" state={section}>View Assignments</Link>

const InstructorSectionsView = (props) => {
    const [sections, setSections] = useState([])
    const [myName, setMyName] = useState("")
    const tableHeaders = ["Section No", "Section ID", "Course Id", "Title", "Semester", "Days+Times", "Building", "Room", "Sec No", "", ""]
    const location = useLocation()
    const term = location.state

    const whoAmI = async() =>{
        try{
            let response = await fetch(`${SERVER_URL}/user?email=dwisneski@csumb.edu`)
            let data = await response.json()
            setMyName(data.name.split(' ').map(word=>{return word.charAt(0).toUpperCase()+word.slice(1)}).join(' '))
        }catch(err){
            alert(`${err}`)
        }
    }

    const getSections = async()=>{
        try{
            let response = await fetch(`${SERVER_URL}/sections?email=dwisneski@csumb.edu&year=${term.year}&semester=${term.semester}`)
            if (response.status === 200){
                let data = await response.json()
                setSections(data)
                console.log(data)
            }
        }catch(err){
            alert(`${err}`)
        }

    }
    useEffect(()=>{
        getSections()
        whoAmI()
    }, [])
     
    return(
        <> 
           <h2>Viewing sections taught by {myName}</h2>
           <table className='Center'>
            <thead>
            <tr>
                {tableHeaders.map((header, idx)=>(
                    <th key={idx}>{header}</th>
                ))}
            </tr>
            </thead>
            <tbody>
                {sections && sections.map((section)=>(
                        <tr key={section.secNo}>
                            <td>{section.secNo}</td>
                            <td>{section.secId}</td>
                            <td>{section.courseId}</td>
                            <td>{section.title}</td>
                            <td>{section.semester+" "+section.year}</td>
                            <td>{section.times}</td>
                            <td>{section.building}</td>
                            <td>{section.room}</td>
                            <td>{section.secNo}</td>
                            <td><Link className="rowLinks" to="/enrollments" state={{secNo: section.secNo, title: section.title}}>ENROLLMENTS</Link></td>
                            <td><Link className="rowLinks" to="/assignments" state={{secNo: section.secNo, title: section.title}}>ASSIGNMENTS</Link></td>
                        </tr>
                ))}
            </tbody>
           </table>
        </>
    );
}

export default InstructorSectionsView;

