'use client';

import AudioTypingTest from "./components/AudioTypingTest";
import TypingBox from "./components/TypingBox";
import {generate} from 'random-words';
import { useState } from "react";

export default function Home() {

  const [wordsArray, setWordsArray] = useState(() => {
    return generate(50);  
  })
  const [audioFlag, setAudioFlag] = useState(false);

  return (
    <div>
      {audioFlag ? (
        <AudioTypingTest audioFlag={audioFlag} setAudioFlag={setAudioFlag} wordsArray={wordsArray} setWordsArray={setWordsArray} />
      ) : (
        <TypingBox wordsArray={wordsArray} setWordsArray={setWordsArray} audioFlag={audioFlag} setAudioFlag={setAudioFlag} />
      )
      }
    </div>
  );
}
