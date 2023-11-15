import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import "./styles/problem.css";
import AceEditor from "react-ace";
import 'ace-builds/src-noconflict/mode-c_cpp';
import 'ace-builds/src-noconflict/mode-java';
import 'ace-builds/src-noconflict/mode-python';
import 'ace-builds/src-noconflict/mode-javascript';

import 'ace-builds/src-noconflict/theme-monokai';
import 'ace-builds/src-noconflict/theme-dracula';
import 'ace-builds/src-noconflict/theme-solarized_dark';
import 'ace-builds/src-noconflict/theme-github';

export default function Problempage() {
  const { id } = useParams();
  const [ques, setQues] = useState([]);
  const [value, updateValue] = useState("");
  const [lang, updatelang] = useState("c_cpp");
  const [theme, settheme] = useState("dracula");
  const [sampinp, setsamp] = useState("");
  const [outp, setout] = useState({ answer: "", err: "" });
  const [click,setclicked]= useState(false);
  const [corr,setcorr] = useState(0);
  const [total,settotal] = useState(0);
  const [expe,setexp]= useState({input:"",exptectedoutput:"",youroutput:""});
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post('http://localhost:3001/api/problem', {
          Id: id
        });
        setQues(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [id]);

  async function run() {
    try {
      const res = await axios.post('http://localhost:3001/api/problem/run', {
        Code: value,
        language: lang,
        input: sampinp
      });

      setclicked(false);
      setout({ answer: res.data.output, err: res.data.error });
    } catch (error) {
      setout({ answer: "", err: error.message });
    }
  }
  async function setinsubtable(corr,total){
      try {
          const sub = await axios.post('http://localhost:3001/api/problem/subtable',{
              Id: id,
              Correct: corr,
              Total: total,
              User : "user1",
              language:lang,
              code : value
          });
      } catch (error) {
        
      }
  }
  async function submit() {
    setclicked(true);
    setout("");
    try {
      const conn = await axios.post('http://localhost:3001/api/problem/submit', {
        user: "user1",
        Code: value,
        language: lang,
        input: sampinp,
        Id: id
      });
      const outputResults = conn.data.outputResults;
      let correctCount = 0; 
      settotal(outputResults.length);
     
  
      const animateCorrectCount = (index) => {
        if (index >= outputResults.length) {
          setexp("");
          setinsubtable(correctCount, outputResults.length); // Pass correctCount
          return;
        }
  
        const result = outputResults[index];
        if (result.match === true) {
          correctCount++;
          setcorr(correctCount);
        }
  
        if(result.match===false){
            setinsubtable(correctCount,outputResults.length);
            setexp({input:result.input,exptectedoutput:result.expectedOutput,youroutput:result.output});
            setcorr(corr)
            return;
        }
  
        setTimeout(() => {
          animateCorrectCount(index + 1); 
        }, index/10000); 
      };
  
      animateCorrectCount(0);
    } catch (error) {
    }
  }
  
  

  const changelang = (event) => {
    updatelang(event.target.value);
    console.log(event.target.value);
  }
  return (
    <div>
    <div className="container">
      <div className="problem-container">
        <h1>{ques[0]?.title}</h1>
        <h2>{ques[0]?.difficulty}</h2>
        <p>{ques[0]?.problem}</p>
        <p>{ques[0]?.description}</p>
      </div>
      <textarea onChange={(e) => {
        setsamp(e.target.value);
      }}></textarea>
      <div className="Editor">
        <select onChange={changelang}>
          <option value="c_cpp">CPP</option>
          <option value="python">Python</option>
          <option value="java">Java</option>
          <option value="javascript">Javascript</option>
        </select>
        <select onChange={(e) => {
          settheme(e.target.value)
        }}>
          <option value="dracula">Dark Theme</option>
          <option value="github">Light Theme</option>
        </select>
        <AceEditor
          mode={lang}
          theme={theme}
          name="code-editor"
          editorProps={{ $blockScrolling: true }}
          setOptions={{ useWorker: false }}
          onChange={(e) => {
            updateValue(e);
          }}
          value={value}
        />
        <button onClick={run}>Run</button>
         <button onClick={submit}>submit</button> 
      </div>
      </div>
      <div className={`Result ${click ? 'active' : ''}`}>
  <h1>{outp.err}</h1>
  <h1>{outp.answer}</h1>
  {click ? <h1>{corr}/{total}</h1> : ""}
  
</div>
   <Link to={`/submissions/${id}/${'user1'}`} >
          submissions
        </Link>
{corr<total ? (<div className="Result" >
<h1>Input: {expe.input}</h1>
<h1>Expected Output: {expe.exptectedoutput}</h1>
<h1>Your Output: {expe.youroutput}</h1>
</div>):<span></span>
}
   
</div>
    
    
  );
}
