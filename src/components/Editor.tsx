import React from 'react'
import {saveText, watchNote, setNoteSubject} from '../services/firebase-service';
import AceEditor from "react-ace";

import "ace-builds/src-noconflict/mode-java";

import "ace-builds/src-noconflict/mode-javascript";

import "ace-builds/src-noconflict/theme-monokai";

export interface NoteType {
  subject:string;
  text:string
}


export default function Editor({noteId,onload=(title)=>{}}) {

  let [text, setText]  = React.useState("");
  let [language,setLanguage] = React.useState("java");


  let callback = React.useCallback((note:NoteType)=>{
    if(!text){
      onload && onload(note.subject)
    }
    setText(note.text)
  },[onload, text])

  React.useEffect(() => {
    watchNote(noteId,callback)
  }, [callback, noteId])

  function onChange(newValue) {
    saveText(noteId,newValue);
  }

  return (
    <div style={{position:"relative"}}> 
      
      <AceEditor
        mode={language}
        theme="monokai"
        value = {text}
        onChange={onChange}
        name="ace-editor"
        width="100%" 
        height={(window.innerHeight-50)+"px"}
        editorProps={{ $blockScrolling: true }}
      />
      <select name="language" value = "javascript" className="language-selector" onChange={(e)=>{setLanguage(e.target.value)}}>
        <option value="plainText" >plain text</option>
        <option value="java">java</option>
        <option value="javascript">javascript</option>
      </select>
    </div>
  )
}
