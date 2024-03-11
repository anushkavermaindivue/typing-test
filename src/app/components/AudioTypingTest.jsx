'use client';

import Image from 'next/image';
import resetIcon from '/public/resetIcon.png';
import nextIcon from '/public/nextIcon.png';
import {generate} from 'random-words';
import {useState, useMemo, createRef, useRef, useEffect} from 'react';

const AudioTypingTest = ({wordsArray, setWordsArray, audioFlag, setAudioFlag}) => {
    const inputRef = useRef(null);

    const testTime = 15;

    const [countDown, setCountDown] = useState(testTime);
    const [correctChars, setCorrectChars] = useState(0);
    const [wrongChars, setWrongChars] = useState(0);
    const [missedChars, setMissedChars] = useState(0);
    const [extraChars, setExtraChars] = useState(0);
    // const [correctWords, setCorrectWords] = useState(0);
    const [currWordIndex, setCurrWordIndex] = useState(0);
    const [currCharIndex, setCurrCharIndex] = useState(0);
    const [intervalId, setIntervalId] = useState(null);
    const [testStart, setTestStart] = useState(false);
    const [testEnd, setTestEnd] = useState(false);
    const [textareaVal, setTextareaVal] = useState("");
    const [isAudioPlaying, setIsAudioPlaying] = useState(false);

    const msg = new SpeechSynthesisUtterance();
    msg.text = wordsArray.join(" ");

    const wordsSpanRef = useMemo(() => {
      return Array(wordsArray.length)
        .fill(0)
        .map((i) => createRef(null));
  }, [wordsArray]);

  const calculateWPM = () => {
    return Math.round(correctChars / 5 / (15 / 60));
};

const calculateAccuracy = () => {
    // return Math.round((correctWords / wordsSpanRef.length) * 100);
    return Math.round((correctChars / (correctChars + wrongChars + missedChars)) * 100);
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
  resetTest();
}, [testTime]);

useEffect(() => {
    focusInput();
    wordsSpanRef[0].current.childNodes[0].className = "current";
    const allCurrChars = wordsSpanRef[currWordIndex].current.childNodes;
    allCurrChars[0].className = "unique";
}, []);

const startTimer = () => {
  const intervalId = setInterval(timer, 1000);
  setIntervalId(intervalId);

  function timer() {
    setCountDown((latestCountDown) => {
      // setCorrectChars((correctChars) => {
      //     setGraphData((graphData) => {
      //         return [...graphData, [
      //             testTime-latestCountDown+1,
      //             (correctChars/5)/((testTime-latestCountDown+1)/60)
      //         ]];
      //     })
      //     return correctChars;
      // })
      if (latestCountDown === 1) {
        speechSynthesis.cancel();
        setIsAudioPlaying(false);
        setTestEnd(true);
        clearInterval(intervalId);
        return 0;
      }
      return latestCountDown - 1;
    });
  }
};

  function audioTest() {
    setAudioFlag(false);
  }

  const resetTest = () => {
    clearInterval(intervalId);
    setTextareaVal("");
    setCountDown(testTime);
    setCurrWordIndex(0);
    setCurrCharIndex(0);
    setTestStart(false);
    setTestEnd(false);
    setWordsArray(generate(50));
    resetWordSpanRefClassname();
    setCorrectChars(0);
    setWrongChars(0);
    // setCorrectWords(0);
    setMissedChars(0);
    focusInput();
  };

  const handleUserInput = (e) => {

    if (!testStart) {
      startTimer();
      setTestStart(true);
      
    }
  
      const allCurrChars = wordsSpanRef[currWordIndex].current.childNodes;
      allCurrChars[0].classList.remove("unique");
      
      if (e.keyCode === 32) {
        setTextareaVal(prev => prev+e.key);
        let correctCharsInWords =
          wordsSpanRef[currWordIndex].current.querySelectorAll(".correct");
  
        // if (correctCharsInWords.length === allCurrChars.length) {
        //   setCorrectWords((prev) => prev + 1);
        // }
  
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
          setTextareaVal(prev => prev.slice(0, -1));
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
      setTextareaVal(prev => prev+e.key);
  
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

      if(e.keyCode == 16) return;
      if(e.keyCode == 20) return;
  
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

    

    function handlePlay(e) {
      setIsAudioPlaying(true);
      msg.rate = 0;
      setTimeout(() => {
       speechSynthesis.speak(msg);
      }, 1000);
    }

  return (
    <div className='text-[#4D4D4D] h-[95vh] font-semibold mt-8 tracking-wide'>
      <div className='bg-[#D3F1FF] p-4 pr-8 flex items-center justify-between'>
        <h1 className='text-2xl text=[#737373]'>Steno Test</h1>
        <h1 className='text-green-500 text-right'><span className='text-black'>Time : </span>{countDown}</h1>
      </div>
      <div className={`${audioFlag && 'hidden'} words flex flex-wrap w-[80%] m-auto p-5 leading-8 text-xl mt-5 bg-[#F7F7F7]`}>
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
      <div className='flex justify-center w-[80%] m-auto p-5  mt-8 bg-[#F7F7F7]'>
        <button onClick={handlePlay} className='bg-[#188FA7] text-white rounded-md text-smp px-4 py-1' disabled={testEnd ? true : false}>{isAudioPlaying ? 'playing' : 'paused'}</button>
      </div>
      <div className='flex justify-evenly items-center mt-5 m-auto w-[40%]'>
        <button onClick={audioTest}><Image width={35} src={nextIcon} alt='nextIcon' /> </button>
        <button onClick={resetTest}><Image width={30} src={resetIcon} alt='resetIcon' /></button>
      </div>
      {testEnd ? (
        <div className='mt-20 p-2 flex justify-around w-[70%] m-auto text-center'>
          <div>
            <h2 className='text-xl font-semibold text-[#A5A5A5]'>acc</h2>
            <h1 className='text-[#188FA7] text-3xl font-bold'>{`${calculateAccuracy()} %`}</h1>
          </div>
          <div>
            <h2 className='text-xl font-semibold text-[#A5A5A5]'>time</h2>
            <h1 className='text-[#188FA7] text-3xl font-bold'>15 s</h1>
          </div>
          <div>
            <h2 className='text-xl font-semibold text-[#A5A5A5]'>consistency</h2>
            <h1 className='text-[#188FA7] text-3xl font-bold'>40%</h1>
          </div>
          <div>
            <h2 className='text-xl font-semibold text-[#A5A5A5]'>wpm</h2>
            <h1 className='text-[#188FA7] text-3xl font-bold'>{calculateWPM()}</h1>
          </div>
          <div>
            <h2 className='text-xl font-semibold text-[#A5A5A5]'>characters</h2>
            <h1 className='text-[#188FA7] text-3xl font-bold'>{`${correctChars}/${wrongChars}/${missedChars}`}</h1>
          </div>
        </div>
      ) : (
        <div className=''>
          <textarea value={textareaVal} type='text' ref={inputRef} onKeyDown={handleUserInput} className='border resize-none bg-[#F7F7F7] underline w-[80%] ml-[10%] mt-20 p-5 outline-none h-[30vh]' disabled={isAudioPlaying ? false : true} />
        </div>
      )}
    </div>
  )
}

export default AudioTypingTest;
