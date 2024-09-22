import React, { createRef, useEffect, useRef, useState } from 'react'
import './App.css'
import Note from './componets/Note'

const App = () => {

  const [notes,setNotes] = useState([{
    id:0,
    text: "this is first note"
  },{
    id:2,
    text: "this is 2nd note"
  }
])

const notesRef = useRef([])

const [positionNote,setPositionNote] = useState(JSON.parse(localStorage.getItem("notes")) || [])

// capture key down event
 const  handleMousedown = (e,note) =>{

  const noteRef = notesRef.current[note.id].current
  let rect = noteRef.getBoundingClientRect()
  let offSetX = e.clientX - rect.left 
  let offSetY = e.clientY - (rect.top-50)

  let startPos = note.position

 const handleMouseMove=(e)=>{
  let newX = e.clientX - offSetX 
  let newY = e.clientY - (offSetY  )
   noteRef.style.top = newY+"px"
   noteRef.style.left = newX+"px"
}
 const handleMouseUp=()=>{

 document.removeEventListener("mousemove",handleMouseMove)
 document.removeEventListener("mouseup",  handleMouseUp)

 
 let finalRect = noteRef.getBoundingClientRect()
 let newPosition = {positionX:finalRect.top,positionZ:finalRect.left }
 
 //check for overLap 
 console.log(checkForOverLap(note.id))
   if(!checkForOverLap(note.id)){
  console.log("overlap word")
   noteRef.style.top = startPos.positionY+"px"
    noteRef.style.left = startPos.positionX+"px"
    console.log(noteRef)
  } else {
  console.log("postion wala")
    updateNewPosition(note,newPosition)
  }




 function updateNewPosition(note,newPosition){
  let updatedNote = positionNote.map((po)=>{
   return   po.id ===  note.id ? {...po, position: newPosition}: po
   })
   setPositionNote(updatedNote)
    localStorage.setItem("notes", JSON.stringify(updatedNote))
}

 updateNewPosition(note,newPosition)
 }

 document.addEventListener("mousemove", handleMouseMove)
 document.addEventListener("mouseup",  handleMouseUp )

}

const checkForOverLap = (id) =>{
 let currentNoteRef =  notesRef.current[id].current
 console.log(currentNoteRef)
 const rect = currentNoteRef.getBoundingClientRect()
 return positionNote.some((n)=> {
  if(n.id === id) return false

let otherNoteref =  notesRef.current[n.id].current
let otherRect = otherNoteref.getBoundingClientRect()
console.log(rect.right )
console.log(otherRect.left )

const overLap =   !(
  rect.right > otherRect.left ||  rect.left < otherRect.right  ||
  rect.bottom < otherRect.top ||  rect.top > otherRect.bottom
)
return overLap

 } )
}






useEffect(()=>{

  let newNotes =notes.map((note)=>{
    let CheckNote = positionNote.filter((e)=>e?.id === note?.id)
    if(CheckNote.length){


      return CheckNote[0]
    }else{
      return {...note, position: generateRandomPostion() }
    }


  })
  setPositionNote(newNotes)

  localStorage.setItem("notes",JSON.stringify(newNotes))
  

},[notes])





 //generate random position for the the
 function generateRandomPostion(){
  console.log("ramdome postion workd")
 let positionX = Math.floor(Math.random()*(window.innerWidth-330) )
 let positionZ = Math.floor(Math.random()*(window.innerHeight-330) )
 return {positionX,positionZ}
  
 }

  return (
    <div>

      <h2>Hello to the Draging Note App</h2>

      <div className='main'>
        {positionNote.map((note)=>(
          <div onMouseDown={(e)=>handleMousedown(e,note)}>
 <Note  ref={notesRef.current[note?.id] ? notesRef.current[note?.id] : notesRef.current[note?.id ]= createRef()}   data = {note}/>

          </div>
         ))}
      </div>


    </div>
  )
}

export default App