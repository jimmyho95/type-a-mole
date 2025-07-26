import React, { useState, useEffect, useRef } from "react";

// const WORDS = ['apple', 'banana', 'cat', 'dog', 'egg', 'fire', 'giant', 'hippo']
const DIFFICULTY = {
    noob: 3000,
    mid: 2000,
    heroic: 1500,
    legendary: 1000,
};

function GameBoard({ difficulty, currentScore, setScore, selectedList }) {
    const [activeWord, setActiveWord] = useState(""); //active word
    const [wordList, setWordList] = useState([]);
    const [position, setPosition] = useState({ top: "0%", left: "0%" }); //active word position
    const [typedLetters, setTypedLetters] = useState([]); //user input
    const intervalRef = useRef(null); //current interval ref
    const [isGameActive, setIsGameActive] = useState(false);
    const [timeLeft, setTimeLeft] = useState(30);
    const [playerName, setPlayerName] = useState("");
    const gameAreaRef = useRef(null);
    const [isGameOver, setIsGameOver] = useState(false);
    const finalScoreRef = useRef(0);
    const finalWpmRef = useRef(0);

    //load word list
    useEffect(() => {
        const fetchWords = async () => {
            try {
                const res = await fetch(`/api/words/list?list=${selectedList}`);
                const data = await res.json();
                setWordList(data);
            } catch (err) {
                console.error("Failed to load word list:", err);
            }
        };

        fetchWords();
    }, [selectedList]);

    //word list selected, restart
    useEffect(() => {
        if (!isGameActive && !isGameOver) return;

        // Reset everything when a new list is chosen
        clearInterval(intervalRef.current);
        setIsGameActive(false);
        setIsGameOver(false);
        setActiveWord("");
        setTypedLetters([]);
        setTimeLeft(30);
        setScore(0); // optional: clear score on list change
        startGame();
        console.log(`Switched to list: ${selectedList}`);
    }, [selectedList]);

    //update ref whenever currentScore changes
    useEffect(() => {
        finalScoreRef.current = currentScore;
        finalWpmRef.current = currentScore * 2;
    }, [currentScore]);

    //start game
    const startGame = () => {
        setIsGameActive(true);
        setTimeLeft(30);
        generateWord();
        startInterval();

        setTimeout(() => {
            gameAreaRef.current?.focus();
        }, 0);
    };

    //end game
    const endGame = async () => {
        setIsGameActive(false);
        setIsGameOver(true);
        clearInterval(intervalRef.current);

        const finalScore = finalScoreRef.current;
        const finalWpm = finalScore * 2;

        try {
            console.log("Submitting score: ", {
                player: playerName,
                score: finalScore,
                wpm: finalWpm,
                difficulty,
            });
            await fetch("/api/scores", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    player: playerName,
                    score: finalScore,
                    wpm: finalWpm,
                    difficulty: difficulty,
                }),
            });
        } catch (err) {
            console.error("Failed to post score:", err);
        }
    };

    //timer
    useEffect(() => {
        if (!isGameActive) return;

        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    endGame();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [isGameActive]);

    useEffect(() => {
        if (isGameActive) {
            clearInterval(intervalRef.current);
            startInterval();
        }
    }, [difficulty]);

    //generate word
    const generateWord = () => {
        if (!wordList.length) return;

        const randIndex = Math.floor(Math.random() * wordList.length);
        const word = wordList[randIndex];
        const top = Math.floor(Math.random() * 80) + 5;
        const left = Math.floor(Math.random() * 80) + 5;

        setActiveWord(word.toLowerCase());
        setPosition({ top: `${top}%`, left: `${left}%` });
        setTypedLetters([]);
    };

    //fix for words being skipped
    const startInterval = () => {
        const delay = DIFFICULTY[difficulty] || 2000;
        intervalRef.current = setInterval(generateWord, delay);
    };

    //rebuild interval
    const handleWordComplete = () => {
        setScore((prev) => prev + 1);
        clearInterval(intervalRef.current);
        generateWord();
        startInterval();
    };

    //event listener
    const handleKeyDown = (e) => {
        const key = e.key;

        //if delete key pressed
        if (key === "Backspace") {
            setTypedLetters((prev) => prev.slice(0, -1));
            return;
        }

        //input tracking
        if (/^[a-zA-Z ]$/.test(key)) {
            const nextIndex = typedLetters.length;
            const expectedChar = activeWord[nextIndex];
            const updated = [...typedLetters, key];

            if (key === expectedChar) {
                setTypedLetters(updated);

                if (updated.join("") === activeWord) {
                    console.log("Correct! +1 point");
                    handleWordComplete();
                }
            } else {
                console.log("Incorrect letter!");
                setTypedLetters(updated);
            }
        }
    };

    const renderColoredWord = (word, input) => {
        return word.split("").map((char, index) => {
            let className = "untyped-letter";

            if (typedLetters[index] !== undefined) {
                if (typedLetters[index] === char) {
                    className = "correct-letter";
                } else {
                    className = "incorrect-letter";
                }
            }
            return (
                <span key={index} className={className}>
                    {char}
                </span>
            );
        });
    };

    return (
        <div
            ref={gameAreaRef}
            className="game-area"
            tabIndex={0}
            onKeyDown={handleKeyDown}
        >
            {isGameOver ? (
                <div className="end-screen">
                    <h2>Game Over</h2>
                    <p>
                        <strong>{playerName}</strong>
                    </p>
                    <p>Score: {currentScore}</p>
                    <p>WPM: {currentScore * 2}</p>
                    <button
                        onClick={() => {
                            setIsGameOver(false);
                            setScore(0);
                            setPlayerName("");
                            setTimeLeft(30);
                            setIsGameActive(false);
                            setPlayerName("");
                        }}
                    >
                        Play Again
                    </button>
                </div>
            ) : !isGameActive ? (
                (
                    <div className="game-stats">
                        <span className="score"> Score: {currentScore}</span>
                        <span className="timer">Time Left: {timeLeft}s</span>
                    </div>
                ) && (
                    <div className="start-screen">
                        <input
                            className="name-input"
                            type="text"
                            value={playerName}
                            onChange={(e) => setPlayerName(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && playerName.trim()) {
                                    startGame();
                                }
                            }}
                            placeholder="Enter your name"
                        />
                    </div>
                )
            ) : (
                <>
                    <div className="timer">Time Left: {timeLeft}s</div>
                    {activeWord && (
                        <div className="floating-word" style={position}>
                            {renderColoredWord(activeWord, typedLetters)}
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

export default GameBoard;
