import React, {useCallback, useEffect, useState} from 'react';
import 'quill/dist/quill.snow.css';
import Quill from 'quill';
import '../styles/TextEditor.css';

const TOOLBAR = [
    [{header: [1,2,3,4,5,6,false]}],
    [{list: "ordered"}, {list: "bullet"}],
    ["bold", "italic", "underline"],
    [{script:"sub"}, {script: "super"}],
    [{align:[]}],
    ["image", "blockquote", "code-block"],
    ["clean"]
]

const TextEditor = ({userID, username, socket}) => {
    const [quill, setQuill] = useState(null);
    const wrapperRef = useCallback((wrapper) => {
            if(!wrapper) return;
            wrapper.innerHTML = "";
            const editor = document.createElement('div');
            wrapper.append(editor);
            const q = new Quill(editor, {theme:"snow", modules: {
                toolbar:TOOLBAR
            }})
            setQuill(q);
            socket.emit('send-changes', {"data":"", "tp":true, "contents": q.getContents()});
        }, []
    )
    useEffect(() => {
        if(socket==null || quill==null) return;
        const handler =  (delta, oldDelta, source) => {
            if(source !== 'user') return;
            socket.emit('send-changes', {"data":delta, "tp":false, "contents": quill.getContents()});
        }
        quill.on('text-change', handler);
        return () => {
            quill.off('text-change', handler);
        }
    }, [socket, quill]);

    socket.on('recieve-changes', data => {
        if(quill==null) return;
        console.log(data);
        quill.updateContents(data);
    })


    // useEffect(() => {
    //     if(socket==null || quill==null) return;
        
    // }, [socket, quill]);
    
    return (
        <div className="texteditor">
            <div className="container" ref={wrapperRef}>
                
            </div>
        </div>
    )
}

export default TextEditor
