import React from 'react'
import Dialog from './Dialog'

export default function CreateNewDialog({onClickCreate,onClose, editMode=false, initialSubject=""}) {
  
  let [subject, setSubject] = React.useState<string>(initialSubject);
  const inputEl = React.useRef<HTMLInputElement>(null);

  React.useLayoutEffect(()=>{
    inputEl?.current?.focus()
  },[])

  function onKeyPress(e){
    if(e.which == 13){
      onClickCreate(subject) 
    }
  }

  return (
    <div>
      <Dialog onOverlayClick={onClose} onClickClose={onClose}>
        <div className="create-new-note-dialog">
          <input ref={inputEl} type="text" onKeyPress={onKeyPress} value={subject} onChange={(e)=>setSubject(e.target.value)}/>
          <button onClick={()=>{onClickCreate(subject)}}>{editMode?'Update':"Create"}</button>
        </div>
      </Dialog>
    </div>
  )
}
