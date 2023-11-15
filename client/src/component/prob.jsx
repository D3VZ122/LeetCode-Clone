import React from "react";
import { Link } from "react-router-dom";


export default function Problemcomp(props) {
  const handleClick = () => {
    console.log("Clicked on problem ID:", props.id);
 
  };

  return (
    <tr onClick={handleClick} >
      <td>{props.id}</td>
      <td>{props.rating}</td>
      <td>{props.difficulty}</td>
      <td>
        <Link to={`/problems/${props.id}`} onClick={handleClick}>
          {props.title}
        </Link>
      </td>
      
    </tr>
  );
}
