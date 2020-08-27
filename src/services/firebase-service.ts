
// Firebase App (the core Firebase SDK) is always required and must be listed first
import * as React from 'react';
import * as firebase from "firebase/app";

// If you enabled Analytics in your project, add the Firebase SDK for Analytics
import "firebase/analytics";

// Add the Firebase products that you want to use
import "firebase/auth";
import "firebase/database";
import {NoteType} from '../domain/model';


const firebaseConfig = {
  apiKey: "AIzaSyDgT0tv0xqN6el-LaGzItjlpZuW6fjJNZE",
  authDomain: "collabedit-clone.firebaseapp.com",
  databaseURL: "https://collabedit-clone.firebaseio.com",
  projectId: "collabedit-clone",
  storageBucket: "collabedit-clone.appspot.com",
  messagingSenderId: "474364891165",
  appId: "1:474364891165:web:474338e3164670b94b36f4",
  measurementId: "G-CQT4P6L1E9"
};

firebase.initializeApp(firebaseConfig);

var database = firebase.database();


function useFirebase(userId){
  function createNewDocument(subject):NoteType|undefined{
    let newNoteRef = database.ref('/noteList/').push();
    if(newNoteRef.key){
      let doc:NoteType = {
        userId,
        text:"",
        subject:subject,
        key:newNoteRef.key
      }
      newNoteRef.set(doc)
      database.ref('users/' + userId+'/noteList/'+newNoteRef.key).set({
        key:newNoteRef.key,
        subject:subject
      })
      return doc; 
    }
  }

  function setNoteSubject({key,subject}){
    database.ref('/users/' + userId+"/noteList/"+key).update({
      subject
    })
    database.ref('/noteList/'+key).update({
      subject
    })
  }

  const getUserDocs = React.useCallback((callback)=>{
    let notelistref = database.ref('/users/'+userId+"/noteList")
    notelistref.on('value',function(snapshot){
      if(snapshot.val()){
        callback(Object.values(snapshot.val()).reverse())
      }else{
        callback([])
      }
    })
  },[userId])

  function watchDoc(key, callback){
    let noteref = database.ref('/noteList/'+key)
    noteref.on('value', function(snapshot) {

      if(snapshot.val()){
        callback(snapshot.val())
      }
    });
  }

  const getCurrentDoc = React.useCallback(async (key)=>{
    let snapshot = await database.ref('/noteList/'+key).once('value');
    return snapshot.val() as NoteType;
  },[])

  return {
    getCurrentDoc,
    setNoteSubject,
    getUserDocs,
    watchDoc,
    createNewDocument
  }
}

export default useFirebase;


let currentUserId;
export function setNoteSubject({
  key,subject
}){
  firebase.database().ref('/users/' + currentUserId+"/noteList/"+key).update({
    subject
  })

  firebase.database().ref('/noteList/'+key).update({
    subject
  })


}


export function getAllNotes(userId,callback){

  currentUserId = userId;
  
  let userRef = firebase.database().ref('/users/' + userId+"/noteList")

  userRef.on('value',function(snapshot){
    console.log(snapshot.val());
    
    if(snapshot.val()){
      callback(Object.values(snapshot.val()).reverse())
    }else{
      callback([])
    }
  })
}

export function watchNote(noteId,callback){
  let noteref = database.ref('/noteList/'+noteId)
  noteref.on('value', function(snapshot) {

    if(snapshot.val()){
      callback(snapshot.val())
    }
    
  });
}

export async function getNoteData(noteId){
  let snapshot = await database.ref('/noteList/'+noteId).once("value")
  return snapshot.val();
}


export function saveText(noteId,text){
  database.ref('/noteList/'+noteId).update({
    text:text
  });
}

export async function deleteNote(noteId){
  console.log(noteId);

  let snapshot = await firebase.database().ref('/noteList/'+noteId).once('value')
  console.log(snapshot.val());
  
  if(snapshot.val()){
    let userId = snapshot.val().userId;
    firebase.database().ref('/users/' + userId+"/noteList/"+noteId).remove();

    firebase.database().ref('/noteList/'+noteId).remove();
  }else{
    return []
  }

  database.ref('/noteList/'+noteId).remove()
}