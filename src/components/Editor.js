import React, { useState, useRef, useEffect, useCallback } from 'react'
import AceEditor from "react-ace";
import { CircularProgress, Modal } from '@material-ui/core';
import axios from 'axios';
import "../styles/Editor.css";
import ActiveUsers from './ActiveUsers.js';
import {langForserver, lang, themes, default_codes} from '../utils/codeExecution.js';
import {randomColor} from '../utils/randomColor.js'
import "ace-builds/src-noconflict/mode-c_cpp";
import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/theme-solarized_light";
import "ace-builds/src-noconflict/theme-tomorrow_night";
import "ace-builds/src-noconflict/theme-xcode";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/mode-golang";
import local from '../utils/local.js'
const URL = (local?'http://localhost:8000':window.location.href);


const Editor = ({userID, username, activeUsers, setActiveUsers, socket}) => {  
  const langRef = useRef();
  const themeRef = useRef();
  const btnRef = useRef();
  const [loadingIcon, setLoadingIcon] = useState('');
  const [openResetModal, setOpenResetModal] = useState(false);
  const [language, setLanguage] = useState('c_cpp');
  const [codeValue, setCodeValue] = useState(default_codes[0]);
  const [index, setIndex] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const [btnDisabled, setBtnDisabled] = useState(false);
  const [output, setOutput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [cpu, setCpu] = useState('');
  const [position, setPosition] = useState({});
  const [cpuMsg, setCpuMsg] = useState('');
  const [compilation, setCompilation] = useState('');
  const [theme, setTheme] = useState('monokai');
  const [editorSession, setEditorSession] = useState('');

  useEffect(() => {
    socket.emit('code-change', {"code":"", "user":userID});
  }, [])
  
  const handleSnippetChange = e => {
    setCodeValue(default_codes[parseInt(e.target.value)]);
    setLanguage(lang[parseInt(e.target.value)]);
    setIndex(e.target.value);
    socket.emit('snippet-change', {
      "codeVal":default_codes[parseInt(e.target.value)],
      "lang":lang[parseInt(e.target.value)],
      "ind":e.target.value
    })
  }

  const handleResetModalClose = () => {
    setOpenResetModal(true);
  }

  const handleReset = e => {
    setCodeValue(default_codes[index]);
    socket.emit('code-change',{"code":default_codes[index], "user":userID});
    setOpenResetModal(false);
  }

  const handleRun = e => {
    e.preventDefault();
    setBtnDisabled(true);
    btnRef.current.style.backgroundColor="grey";
    btnRef.current.style.cursor='no-drop';
    setLoadingIcon(<CircularProgress className="loading" size='20px'/>);
    setOutput('');
    setCpuMsg('');
    setErrorMsg('');
    setCompilation('');
    setCpu('');
    axios.post(URL,{
      "code" : codeValue,
      "lang" : langForserver[index],
      "input": inputValue
    }).then(res => {
      if(res.data.memory) {
        setOutput(res.data.output);
        setCpuMsg('CPU Time:');
        setCpu(`${res.data.cpuTime}s`);
      } else {
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
  }

  const handleThemeChange = e => {
    setTheme(themes[parseInt(e.target.value)]);
    socket.emit('theme-change', {
      "theme":themes[parseInt(e.target.value)],
      "ind":e.target.value
    });
  }

  const handleOnChange = e => {
    setCodeValue(e);
    socket.emit('code-change', {"code":e, "user":userID});
  }

  const handleCancel = () => {
    setOpenResetModal(false);
  }

  const handleCursorChange = (selection) => {
    setPosition(selection.getCursor());
  }

  const modalPop = () => {
    setOpenResetModal(true);
  }

  socket.on('code-change',code => {
      setCodeValue(code);
  }) 

  socket.on('theme-change', theme => {
    setTheme(theme.theme);
    themeRef.current.value = theme.ind;
  })

  socket.on('user-typing', users => {
    setActiveUsers(users);
  })

  socket.on('snippet-change',data => {
    setCodeValue(data.codeVal);
    setLanguage(data.lang);
    setIndex(data.ind);
    langRef.current.value=data.ind;
  })

  const body = (
    <div className="modal-for-reset">
      <p className="modal-question">Are you sure you want to reset the code</p>
      <div className="btn-modal">
        <button onClick={handleReset} className="yes">Reset</button>
        <button onClick={handleCancel} className="cancel">Cancel</button>
      </div>
    </div>
  )

  return (
    <>
      <Modal open={openResetModal} onClose={handleResetModalClose}>
        {body}
      </Modal>
      <div className="parent">
        <div className="editor-parent">
          <div id='options'>
            <select ref={langRef} onChange={handleSnippetChange} name="languages" id='select-box'>
              <option value="0">C++</option>
              <option value="1">Javascript</option>
              <option value="2">Python3</option>
              <option value="3">Java</option>
              <option value="4">Go</option>
            </select>
            <select ref={themeRef} onChange={handleThemeChange} name="theme" id='select-theme-box'>
              <option value="0">Monokai</option>
              <option value="1">Solarized Light</option>
              <option value="2">XCode</option>
              <option value="3">Tomorrow night</option>
            </select>
          </div>
          <div className="editor-window">
            <AceEditor
              onChange={handleOnChange}
              onCursorChange={handleCursorChange}
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
                enableSnippets: true,
                showLineNumbers: true,
                tabSize: 4,
                cursorStyle: "slim",
                mergeUndoDeltas: "always"
              }}
            />     
          </div>
          <div className="io-section">
            <button ref={btnRef} className="run-btn" disabled={btnDisabled} onClick={handleRun}>Run</button> 
            {loadingIcon}
            <button className="reset-btn" onClick={modalPop}>Reset</button> 
            <textarea onChange={handleInput} className="input-section" placeholder="Input"/>
            <textarea className="output-section" placeholder="Output" value={output}/>
            <div className="error-field">
              <p className="cpu">{cpuMsg} {cpu}</p>
              <p className="compile">{compilation}</p>
              <textarea value={errorMsg} className="error-msg-field"></textarea>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Editor;