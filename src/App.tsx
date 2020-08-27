import React from 'react';
import './App.scss';

import Spacer from './components/spacer'

import useFirebase from './services/firebase-service';
import Editor from './components/Editor';
import Dialog from './components/Dialog';
import CreateNewDialog from './components/CreateNewDialog';
import getBrowserFingerprint from 'get-browser-fingerprint';
import logo from './assets/logo.png'
import NoteItem from './components/NoteItem'
import {NoteType} from './domain/model';




interface Note{
  subject:string,
  key:string
}


/**
 * 
 * if key is available
 * fetch the note,subject from backend
 * add that note to list
 * 
 * if(key) is not available{
 * fetch all notes from the users collection
 * 
 * clicking a note make that note current
 * 
 */

function App(){

  let userId = getBrowserFingerprint()
  let [notelists,setNoteLists] = React.useState<Note[]>([]);
  let [currentNote, setCurrentNote]  = React.useState<NoteType>();
  let [showDialog, setShowDialog]  = React.useState<boolean>();
  let [loading,setLoading]  = React.useState<boolean>(true);
  let currentNoteData;
  let {createNewDocument,getUserDocs,getCurrentDoc,setNoteSubject} = useFirebase(userId);


  React.useEffect(()=>{
    getUserDocs((notes)=>{
      console.log(notes);
      
      setNoteLists(notes);
    })

    async function setCurrentDoc(){
      let key = window.location.pathname.substring(1);
      if(key){
        var note:NoteType = await getCurrentDoc(key)
        setCurrentNote(note);
      }      
    }
    setCurrentDoc();

  },[getCurrentDoc, getUserDocs])


  function closeDialog(){
    setShowDialog(false)
  }

  function showCreateNewDialog(){
    setShowDialog(true);
  }

  function createNewNote(title){
    closeDialog();
    let currentNote = createNewDocument(title);
    if(currentNote){
      setCurrentNote(currentNote);
      setNoteLists([currentNote,...notelists])
    }
  }  

  React.useEffect(()=>{
    if(currentNote){
      window.history.pushState({},currentNote.subject,currentNote.key);
      document.title = currentNote.subject
    }
    
  },[currentNote])

  const handleNotesClick = (note)=>{
    setCurrentNote(note)
  }

  function editNote(note,subject){
    setNoteSubject({
      key:note.key, subject
    })
  }

  return (
    <div className="App">
      
      {showDialog &&
        <CreateNewDialog initialSubject={"New Doc "+(notelists?.length+1)} onClose={closeDialog} onClickCreate={createNewNote}/>
      }

      <div className="top-header">
        <div className="logo"> <img width="140" src={logo} className="App-logo" alt="logo" /></div>
      </div>

      <div className="container">

        <div className="left-aside" style={{height:window.innerHeight-50}}>
          <button className="create-new-btn" onClick={showCreateNewDialog}>Create New Document</button>
          
          {/* {currentNote &&
          <>
            <Spacer margin={10}>
              <span>Current Document</span>
            </Spacer>
            <NoteItem currentNote={currentNote} note={currentNote} setCurrentNote={setCurrentNote}/>
          </>
          } */}

          <div className="notes-container">
            <div className="notes">
              
              {notelists && notelists.map((note)=>{
                return (<NoteItem key={note.key} currentNote={currentNote} note={note} setCurrentNote={handleNotesClick} editSubject={editNote}/>)
              })
              }
            </div>
          </div>
        </div>
        {currentNote &&
        <div className="editor-container">
          <Editor  noteId={currentNote.key}/>
        </div>
        }
        

      </div>

     
    </div>
  );
}

export default App;
