import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import './styles/home.css';
import axios from "axios";
import Problemcomp from "./prob";

export default function Home() {
  const [prob, setProblem] = useState([]);
  const [filteredProblems, setFilteredProblems] = useState([]);
 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/problems');
        setProblem(response.data);
        setFilteredProblems(response.data); 
      } catch (error) {
        console.log("Error Fetching problems", error);
      }
    };

    fetchData();
  }, []);



  const sot = (event) => {
    const a = [...filteredProblems];
    if (event.target.value === "sortasce") {
      a.sort((c, b) => c.rating - b.rating);
    } else if (event.target.value === "sortdsce") {
      a.sort((c, b) => b.rating - c.rating);
    }
    setFilteredProblems([...a]); 
  };

  const diff = (event) => {
    const a = [...prob];
    if(event.target.value==="ALL"){
        setFilteredProblems(a);
    }
    else{
    const filteredArray = a.filter((value) => {
      return value.difficulty === event.target.value;
    });
    setFilteredProblems(filteredArray);
  }
    
  };

  return (
    <div className="Home">
      <select name="sort" onChange={sot}>
        <option defaultChecked>Sort rating</option>
        <option value="sortasce">ascending</option>
        <option value="sortdsce">descending</option>
      </select>
      <select onChange={diff}>
        <option value="ALL">ALL</option>
        <option value="Easy">Easy</option>
        <option value="Medium">Medium</option>
        <option value="Hard">Hard</option>
      </select>
      <table className="myTable">
        <thead>
          <tr>
            <th>ID</th>
            <th>Rating</th>
            <th>Difficulty</th>
            <th>Title</th>
          </tr>
        </thead>
        <tbody>
          {filteredProblems.map((values) => (
            <Problemcomp
              key={values.id}
              difficulty={values.difficulty}
              title={values.title}
              id={values.id}
              rating={values.rating}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
