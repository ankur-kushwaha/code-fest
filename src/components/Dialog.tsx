import React from 'react'


import { AiOutlineCloseCircle } from "react-icons/ai";


export default function Dialog({children,onOverlayClick, onClickClose}) {

  function handleClick(e){
    if(e.target.className == 'dialog-container'){
      onOverlayClick && onOverlayClick()
    }
  }

  const escFunction = React.useCallback((e)=>{
    if(e.key == 'Escape'){
      onClickClose && onClickClose();
    }
  },[onClickClose])

  React.useEffect(() => {
    document.addEventListener("keydown", escFunction, false);

    return () => {
      document.removeEventListener("keydown", escFunction, false);
    };
  }, [escFunction]);

  return (
    <div className="dialog-container" onClick={handleClick}>
      <div className="dialog">
        <div className="icon" onClick={onClickClose}>
          <AiOutlineCloseCircle/>
        </div>
        {children}
      </div>
      
    </div>
  )
}
