import * as React from 'react';
import {setNoteSubject,deleteNote} from '../services/firebase-service';
import { AiFillCloseCircle,AiFillEdit } from "react-icons/ai";
import CreateNewDialog from './CreateNewDialog';


function NoteItem({currentNote, note, setCurrentNote, editSubject}){

  let [showDialog, setShowDialog]  = React.useState(false);
  function onClickEdit(){
    setShowDialog(true);
  }

  function closeDialog(){
    setShowDialog(false)
  }

  return (
    <>
      <div className={"note "+(currentNote == note.key?'selected':'')} onClick={()=>setCurrentNote(note)} >
        <div className="noteSubject">{note.subject} 
      
        </div>
        <div className="edit-icon" onClick={onClickEdit}>
          <AiFillEdit/>
        </div>
        <div className="delete-icon" onClick={()=>deleteNote(note.key)}>
          <AiFillCloseCircle/>
        </div>  

   
      </div>
      {showDialog &&
        <CreateNewDialog initialSubject={note.subject} editMode={true} onClose={closeDialog} onClickCreate={(subject)=>{editSubject(note,subject);setShowDialog(false)}}/>
      }
    </>
  ) 
}
 

export default NoteItem