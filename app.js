/****************
 * STARTER CODE
 ****************/

/**
 * shuffle()
 * Shuffle the contents of an array
 *   depending the datatype of the source
 * Makes a copy. Does NOT shuffle the original.
 * Based on Steve Griffith's array shuffle prototype
 * @Parameters: Array or string
 * @Return: Scrambled Array or string, based on the provided parameter
 */


const { useState, useEffect } = React;

function shuffle(src) {
  const copy = [...src];

  const length = copy.length;
  for (let i = 0; i < length; i++) {
    const x = copy[i];
    const y = Math.floor(Math.random() * length);
    const z = copy[y];
    copy[i] = z;
    copy[y] = x;
  }

  if (typeof src === "string") {
    return copy.join("");
  }

  return copy;
}

// MY Code //


function ScrambleGame() {
  const wordsArray = ["civic", "corolla", "mustang", "camaro", "charger", "tesla", "accord", "focus", "altima", "fusion"];
  const maxStrikes = 3;
  const maxPasses = 3;

  const [words, setWords] = useState(shuffle(wordsArray));
  const [currentWord, setCurrentWord] = useState(shuffle(wordsArray[0]));
  const [guess, setGuess] = useState("");
  const [points, setPoints] = useState(0);
  const [strikes, setStrikes] = useState(0);
  const [passes, setPasses] = useState(maxPasses);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    const savedState = JSON.parse(localStorage.getItem("scrambleGameState"));
    if (savedState) {
      setWords(savedState.words);
      setCurrentWord(savedState.currentWord);
      setGuess(savedState.guess);
      setPoints(savedState.points);
      setStrikes(savedState.strikes);
      setPasses(savedState.passes);
      setGameOver(savedState.gameOver);
    }
  }, []);

  useEffect(() => {
    const gameState = {
      words,
      currentWord,
      guess,
      points,
      strikes,
      passes,
      gameOver,
    };
    localStorage.setItem("scrambleGameState", JSON.stringify(gameState));
  }, [words, currentWord, guess, points, strikes, passes, gameOver]);

  const handleGuessChange = (e) => {
    setGuess(e.target.value);
  };

  const handleGuessSubmit = (e) => {
    e.preventDefault();
    if (guess.toLowerCase() === currentWord) {
      setPoints(points + 1);
      nextWord();
    } else {
      setStrikes(strikes + 1);
      if (strikes + 1 >= maxStrikes) {
        setGameOver(true);
      }
    }
    setGuess("");
  };

  const nextWord = () => {
    if (words.length > 1) {
      const remainingWords = words.slice(1);
      setWords(remainingWords);
      setCurrentWord(shuffle(remainingWords[0]));
    } else {
      setGameOver(true);
    }
  };

  const handlePass = () => {
    if (passes > 0) {
      setPasses(passes - 1);
      nextWord();
    }
  };

  const handlePlayAgain = () => {
    setWords(shuffle(wordsArray));
    setCurrentWord(shuffle(wordsArray[0]));
    setGuess("");
    setPoints(0);
    setStrikes(0);
    setPasses(maxPasses);
    setGameOver(false);
  };

  if (gameOver) {
    return (
      <div>
        <h1>Game Over!</h1>
        <p>Your score: {points}</p>
        <button onClick={handlePlayAgain}>Play Again</button>
      </div>
    );
  }

  return (
    <div>
      <h1>Scramble Game</h1>
      <p>Points: {points}</p>
      <p>Strikes: {strikes}</p>
      <p>Passes: {passes}</p>
      <p>Scrambled Word: {shuffle(currentWord)}</p>
      <form onSubmit={handleGuessSubmit}>
        <input
          type="text"
          value={guess}
          onChange={handleGuessChange}
          autoFocus
        />
        <button type="submit">Guess</button>
      </form>
      <button onClick={handlePass} disabled={passes <= 0}>
        Pass
      </button>
    </div>
  );
}

ReactDOM.render(<ScrambleGame />, document.getElementById('root'));