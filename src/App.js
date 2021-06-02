import React, { useState, useRef } from 'react'
import AceEditor from "react-ace";
import { CircularProgress } from '@material-ui/core';
import axios from 'axios';
import "./styles/App.css";
import "ace-builds/src-noconflict/mode-c_cpp";
import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/theme-solarized_light";
import "ace-builds/src-noconflict/theme-tomorrow_night";
import "ace-builds/src-noconflict/theme-xcode";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/mode-golang";


const App = () => {
  const default_codes = [
    "#include <bits/stdc++.h>"+"\n"+"using namespace std;"+"\n"+"int main() {"+"\n"+"\tcout<<\"Hello, World!\";"+"\n"+"}",
    "console.log('Hello, World!');",
    "print('Hello, World!')",
    "public class HelloWorld"+"\n"+"{"+"\n\t"+"public static void main(String args[])"+" {\n\t\t"+"System.out.println(\"Hello, World\");"+"\n\t}\n"+"}",
    "package main"+"\n"+"import \"fmt\"\n\n"+"func main() {"+"\n\t"+"fmt.Println(\"Hello World\")"+"\n"+"}"
  ];
  const langForserver = [
    'cpp',
    'nodejs',
    'python3',
    'java',
    'go'
  ];
  const lang = [
    'c_cpp',
    'javascript',
    'python',
    'java',
    'golang'
  ];
  const themes = [
    'monokai',
    'solarized_light',
    'xcode',
    'tomorrow_night'
  ]
  const [loadingIcon, setLoadingIcon] = useState('');
  const [language, setLanguage] = useState('c_cpp');
  const [codeValue, setCodeValue] = useState(default_codes[0]);
  const [index, setIndex] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const [btnDisabled, setBtnDisabled] = useState(false);
  const [output, setOutput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [cpu, setCpu] = useState('');
  const [cpuMsg, setCpuMsg] = useState('');
  const [compilation, setCompilation] = useState('');
  const [theme, setTheme] = useState('monokai');
  const btnRef = useRef();
  const handleSnippetChange = e => {
    console.log(e.target.value);
    setCodeValue(default_codes[parseInt(e.target.value)]);
    setLanguage(lang[parseInt(e.target.value)]);
    setIndex(e.target.value);
  }

  const handleReset = e => {
    setCodeValue(default_codes[index]);
  }

  const handleRun = e => {
    e.preventDefault();
    setBtnDisabled(true);
    btnRef.current.style.backgroundColor="grey";
    btnRef.current.style.cursor='no-drop';
    setLoadingIcon(<CircularProgress className="loading" size='26px'/>);
    setOutput('');
    setCpuMsg('');
    setErrorMsg('');
    setCompilation('');
    setCpu('');
    axios.post('http://localhost:5000',{
      "code" : codeValue,
      "lang" : langForserver[index],
      "input": inputValue
    }).then(res => {
      if(res.data.memory) {
        console.log(res.data);
        setOutput(res.data.output);
        setCpuMsg('CPU Time:');
        setCpu(`${res.data.cpuTime}s`);
      } else {
        console.log(res.data);
        setCompilation('Compilation Error!');
        setErrorMsg(res.data.output);
        setCpu('');
      }
      setBtnDisabled(false);
      btnRef.current.style.backgroundColor="rgb(158, 109, 204)";
      btnRef.current.style.cursor='pointer';
      setLoadingIcon('');
    }).catch(err=> {
      setErrorMsg(err.data.output);
      setBtnDisabled(false);
      btnRef.current.style.backgroundColor="rgb(158, 109, 204)";
      btnRef.current.style.cursor='pointer';
      setLoadingIcon('');
    })
  }

  const handleInput = e => {
    setInputValue(e.target.value);
    console.log(inputValue);
  }

  const handleThemeChange = e => {
    setTheme(themes[parseInt(e.target.value)]);
  }
  
  return (
    <div className="editor-parent">
    <div id='options'>
        <select onChange={handleSnippetChange} name="languages" id='select-box'>
          <option value="0">C++</option>
          <option value="1">Javascript</option>
          <option value="2">Python3</option>
          <option value="3">Java</option>
          <option value="4">Go</option>
        </select>
        <select onChange={handleThemeChange} name="theme" id='select-theme-box'>
          <option value="0">Monokai</option>
          <option value="1">Solarized Light</option>
          <option value="2">XCode</option>
          <option value="3">Tomorrow night</option>
        </select>
      </div>
      <div className="editor-window">
        <AceEditor
          onChange={e=>setCodeValue(e)}
          height="100%"
          width="100%"
          fontSize={14}
          mode={language}
          theme={theme}
          highlightActiveLine={true}
          value={codeValue}
          setOptions={{
            enableBasicAutocompletion: true,
            enableLiveAutocompletion: true,
            showLineNumbers: true,
            tabSize: 4,
          }}
        />     
      </div>
      <div className="io-section">
        {/* <Run/><Reset/> */}
        <button ref={btnRef} className="run-btn" disabled={btnDisabled} onClick={handleRun}>Run</button> 
        {loadingIcon}
        <button className="reset-btn" onClick={handleReset}>Reset</button> 
        {/* <Input/> */}
        <textarea onChange={handleInput} className="input-section" placeholder="Input"/>
        {/* <Output/> */}
        <textarea className="output-section" placeholder="Output" value={output}/>
        <div className="error-field">
          <p className="cpu">{cpuMsg} {cpu}</p>
          <p className="compile">{compilation}</p>
          <textarea value={errorMsg} className="error-msg-field"></textarea>
        </div>
      </div>
    </div>
  )
}

export default App;

