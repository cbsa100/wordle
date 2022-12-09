import { useState, useEffect, KeyboardEvent } from 'react';
import './App.css';
import { wordList } from './wordlist';
const word = wordList[Math.floor(Math.random() * wordList.length)];
function App() {
  const [activeLine, setActiveLine] = useState(0);
  const [lines, setLines] = useState([
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
  ]);
  const focusAdj = (e: KeyboardEvent<HTMLInputElement>) => {
    let target: HTMLInputElement = e.target as HTMLInputElement;
    if (e.code !== 'Backspace' && e.code !== 'Enter' && target.value !== '') {
      while ((target = target.nextElementSibling as HTMLInputElement)) {
        if (target == null) break;
        if (target.tagName.toLowerCase() == 'input') {
          target.focus();
          break;
        }
      }
    }

    if (e.code === 'Backspace' && target.value === '') {
      while ((target = target.previousElementSibling as HTMLInputElement)) {
        if (target == null) break;
        if (target.tagName.toLowerCase() == 'input') {
          target.focus();
          target.select();
          break;
        }
      }
    }
  };
  const checkLine = async () => {
    if (activeLine > 4) {
      location.reload();
      return;
    }
    if (lines[activeLine].some(e => e === '')) {
      alert('fill all letters');
      return;
    }
    if (wordList.indexOf(lines[activeLine].join('')) === -1) {
      alert('word doesnt exist');
      return;
    }
    if (lines[activeLine].join('') === word) {
      setActiveLine(200);
    } else {
      await setActiveLine(e => e + 1);
      const firstActiveInput = document.querySelector('input:not([disabled])') as HTMLElement;
      firstActiveInput.focus();
    }
  };
  useEffect(() => {
    const keyDownHandler = (event: { key: string; preventDefault: () => void }) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        document?.getElementById('submit')?.click();
      }
    };

    document.addEventListener('keydown', keyDownHandler);

    return () => {
      document.removeEventListener('keydown', keyDownHandler);
    };
  }, []);

  return (
    <div className='App'>
      <h1>SHARONDLE</h1>
      <Line
        word={word}
        setLines={setLines}
        lineIndex={0}
        activeLine={activeLine}
        focusAdj={focusAdj}
      />
      <Line
        word={word}
        setLines={setLines}
        lineIndex={1}
        activeLine={activeLine}
        focusAdj={focusAdj}
      />
      <Line
        word={word}
        setLines={setLines}
        lineIndex={2}
        activeLine={activeLine}
        focusAdj={focusAdj}
      />
      <Line
        word={word}
        setLines={setLines}
        lineIndex={3}
        activeLine={activeLine}
        focusAdj={focusAdj}
      />
      <Line
        word={word}
        setLines={setLines}
        lineIndex={4}
        activeLine={activeLine}
        focusAdj={focusAdj}
      />
      <button id='submit' onClick={checkLine}>
        {activeLine > 4 ? 'Play Again' : 'Check Word'}
      </button>
    </div>
  );
}

export default App;
interface LineParams {
  word: string;
  setLines: Function;
  lineIndex: number;
  activeLine: number;
  focusAdj: Function;
}
function Line({ word, setLines, lineIndex, activeLine, focusAdj }: LineParams) {
  const [currentLine, setCurrentLine] = useState(['', '', '', '', '']);
  const [success, setSuccess] = useState(['', '', '', '', '']);
  const setLetter = (letterIndex: number, value: string, e: HTMLElement) => {
    setCurrentLine((e: Array<string>) => {
      e[letterIndex] = value.toLowerCase();
      return [...e];
    });
    setLines((lines: Array<Array<string>>) => {
      lines[lineIndex] = currentLine;
      return [...lines];
    });
  };
  useEffect(() => {
    if (activeLine > lineIndex) {
      let leftover: Array<string> = [];
      let buildSuccess = ['', '', '', '', ''];
      buildSuccess = buildSuccess.map((e, i) => {
        if (word[i] === currentLine[i]) {
          return 'green';
        } else {
          leftover.push(word[i]);
          return '';
        }
      });
      buildSuccess = buildSuccess.map((e, i) => {
        if (e === 'green' || e === 'orange') return e;
        if (leftover.indexOf(currentLine[i]) !== -1) {
          leftover.splice(leftover.indexOf(currentLine[i]), 1);
          return 'orange';
        }
        return '';
      });
      setSuccess(buildSuccess);
    }
  }, [activeLine]);
  return (
    <div className='line'>
      {Array.from('a'.repeat(5)).map((ele, letterIndex) => {
        return (
          <input
            style={{ color: 'white', backgroundColor: success[letterIndex] }}
            key={letterIndex}
            type='text'
            maxLength={1}
            value={currentLine[letterIndex]}
            onChange={e => {
              setLetter(letterIndex, e.target.value, e.target);
              focusAdj(e);
            }}
            onKeyUp={e => {
              focusAdj(e);
            }}
            disabled={activeLine !== lineIndex}
            className='letter'
          />
        );
      })}
    </div>
  );
}
