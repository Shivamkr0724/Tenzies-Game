import { useState, useRef, useEffect } from "react";
import Die from "./components/Die";
import { nanoid } from "nanoid";
import ReactConfetti from "react-confetti";

export default function App(){

  const [dice , setDice] = useState(() => getAllNewDice()); 
  const buttonRef = useRef(null)

   const GameWon = dice.every(die => die.isHeld) &&
    dice.every(die => die.value === dice[0].value);

    useEffect(() => {
      if(GameWon){
        buttonRef.current.focus()
      }
    })

   function getAllNewDice(){
      return new Array(10)
                  .fill(0)
                  .map(() => ({
                       value: Math.ceil(Math.random() * 6),
                       isHeld: false,
                       id: nanoid()    
                  }))
   }
   

    function rollDice(){
      if(!GameWon){
        setDice(oldDice => 
                   oldDice.map(die =>
                          die.isHeld ?
                           die :
                           {...die, value: Math.ceil(Math.random() * 6)}
                  ))
      }
      else{
        setDice(getAllNewDice())
      }
    }

    function hold(id){
       setDice(oldDice => {
          return oldDice.map(die =>{
               return die.id === id ? 
                      {...die, isHeld: !die.isHeld} :
                      die
          })  
        })  
    }

    const diceElement = 
               dice.map(dieObj => (
               <Die 
                    key={dieObj.id} 
                    value={dieObj.value} 
                    isHeld={dieObj.isHeld}
                    hold={() => hold(dieObj.id)}
                />)
    ) 
   

  return(
   <main>
    {GameWon && <ReactConfetti />}
      <div aria-live="polite" className="sr-only">
          {GameWon && <p>Congratulations! You won! Press "New Game" to start again.</p>}
      </div>
     <h1 className="title">Tenzies</h1>
            <p className="instructions">Roll until all dice are the same. Click each die to freeze it at its current value between rolls.</p>
    <div className="die-container">
     {diceElement}
    </div>
     <button ref={buttonRef} onClick={rollDice} className="btn">
           {GameWon ? "New Game" : "Roll" }
       </button>
   </main>
  )
}