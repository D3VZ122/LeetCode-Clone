import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import './styles/submission.css';
import { useUser } from "./UserContext";

export default function Submissions() {
  const { id, username } = useParams();
  const [data,setdata] = useState([]);

  const { user } = useUser();

  useEffect(() => {
    subtable();
  }, []);

  async function subtable() {
    try {
      const resp = await axios.post("http://localhost:3001/api/problem/reqsubtable", {
        id: id,
        username: user.username,
      });

      setdata(resp.data);
      console.log(user.username);
      
    } catch (error) {
      console.error("Error making the API request:", error);
    }
  }

  return (
    <div className="Subtable">
      <table>
      <thead>
      <tr>
      <th>Submissions_ID</th>
        <th>User</th>
        <th>Language</th>
        <th>Result</th>
        <th>passed</th>
        <th>Total</th>
        <th>Date_TIME</th>
        </tr>
        </thead>
        <tbody>
        {/* {console.log(data)} */}
  {data.length>0? data.map((values) => (
    <tr key={values.submission_id}>
      <td>{values.submission_id}</td>
      <td>{values.username}</td>
      <td>{values.lang}</td>
      <td>{values.Result}</td>
      <td>{values.correct}</td> 
      <td>{values.total}</td>
      <td>{values.created_at}</td>
      <button onClick={async()=>{
        await navigator.clipboard.writeText(values.BODE);
        alert("copied");
      }}>copy code</button>
    </tr>
  )):<h3>No Submissions Made</h3>}
</tbody>

      </table>
    </div>
  );
}
