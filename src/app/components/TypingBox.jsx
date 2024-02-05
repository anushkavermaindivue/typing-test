'use client';

import {generate} from 'random-words';
import { useRef, useState, useEffect, useMemo, createRef } from 'react';

const TypingBox = () => {

    const inputRef = useRef(null);
    const [wordsArray, setWordsArray] = useState(() => {
        return generate(50);
    })

    const [correctChars, setCorrectChars] = useState(0);
    const [wrongChars, setWrongChars] = useState(0);
    const [missedChars, setMissedChars] = useState(0);
    const [extraChars, setExtraChars] = useState(0);
    const [correctWords, setCorrectWords] = useState(0);
    const [currWordIndex, setCurrWordIndex] = useState(0);
     const [currCharIndex, setCurrCharIndex] = useState(0);

    const wordsSpanRef = useMemo(() => {
        return Array(wordsArray.length)
          .fill(0)
          .map((i) => createRef(null));
    }, [wordsArray]);
    
    const calculateWPM = () => {
        return Math.round(correctChars / 5 / (testTime / 60));
    };

    const calculateAccuracy = () => {
        return Math.round((correctWords / currWordIndex) * 100);
    };

    const resetWordSpanRefClassname = () => {
        wordsSpanRef.map((i) => {
            Array.from(i.current.childNodes).map((j) => {
            j.className = "";
            });
        });
        wordsSpanRef[0].current.childNodes[0].className = "current";
    };

    function focusInput() {
        inputRef.current.focus();
    }

    useEffect(() => {
        focusInput();
        wordsSpanRef[0].current.childNodes[0].className = "current";
    }, []);

    const handleUserInput = (e) => {
    
        const allCurrChars = wordsSpanRef[currWordIndex].current.childNodes;
    
        if (e.keyCode === 32) {
          let correctCharsInWords =
            wordsSpanRef[currWordIndex].current.querySelectorAll(".current");
    
          if (correctCharsInWords.length === allCurrChars.length) {
            setCorrectWords(correctWords + 1);
          }
    
          if (allCurrChars.length <= currCharIndex) {
            allCurrChars[currCharIndex - 1].classList.remove("current-right");
          } else {
            setMissedChars(missedChars + (allCurrChars.length - currCharIndex));
            allCurrChars[currCharIndex].classList.remove("current");
          }
    
          wordsSpanRef[currWordIndex + 1].current.childNodes[0].className =
            "current";
          setCurrWordIndex(currWordIndex + 1);
          setCurrCharIndex(0);
          return;
        }
    
        if (e.keyCode === 8) {
          if (currCharIndex !== 0) {
            if (allCurrChars.length === currCharIndex) {
              if (allCurrChars[currCharIndex - 1].className.includes("extra")) {
                allCurrChars[currCharIndex - 1].remove();
                allCurrChars[currCharIndex - 2].className += "current-right";
              } else {
                allCurrChars[currCharIndex - 1].className = "current";
              }
              setCurrCharIndex(currCharIndex - 1);
              return;
            }
            allCurrChars[currCharIndex].className = "";
            allCurrChars[currCharIndex - 1].className = "current";
            setCurrCharIndex(currCharIndex - 1);
          }
          return;
        }
    
        if (currCharIndex === allCurrChars.length) {
          let newSpan = document.createElement("span");
          newSpan.innerText = e.key;
          newSpan.className = "wrong extra current-right";
          allCurrChars[currCharIndex - 1].classList.remove("current-right");
          wordsSpanRef[currWordIndex].current.appendChild(newSpan);
          setCurrCharIndex(currCharIndex + 1);
          setExtraChars(extraChars + 1);
          return;
        }
    
        if (e.key === allCurrChars[currCharIndex].innerText) {
          allCurrChars[currCharIndex].className = "correct";
          setCorrectChars(correctChars + 1);
        } else {
          allCurrChars[currCharIndex].className = "wrong";
          setWrongChars(wrongChars + 1);
        }
    
        if (currCharIndex + 1 === allCurrChars.length) {
          allCurrChars[currCharIndex].className += " current-right";
        } else {
          allCurrChars[currCharIndex + 1].className = "current";
        }
    
        setCurrCharIndex(currCharIndex + 1);
      };

  return (
    <div className='bg-[#ff9fae] h-[95vh]'>
      <div className='words flex flex-wrap border border-black w-[80%] m-auto p-5 leading-8 text-xl'>
        {
            wordsArray.map((word, index) => (
                <span className='word mr-2' ref={wordsSpanRef[index]}>
                    {word.split("").map((char) => (
                        <span>{char}</span>
                    ))}
                </span>
            ))
        }
      </div>
      <div className=''>
        <textarea type='text' ref={inputRef} onKeyDown={handleUserInput} className='w-[80%] ml-[10%] mt-20 p-5 outline-none h-[30vh]' />
      </div>
    </div>
  )
}

export default TypingBox
