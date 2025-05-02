import React, { useEffect, useState, useRef } from "react";
import "../style/fetch.scss";

const API_KEY = "aaae11e59edddfbd3cedb0a13b27b4e8";
const API_URL = `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=en-US&page=`;

function Fetch() {
    const [movie, setMovie] = useState(null);
    const [input, setInput] = useState("");
    const [started, setStarted] = useState(false);
    const [points, setPoints] = useState(0);
    const [timer, setTimer] = useState(300); // 5 minutter
    const [wrongGuesses, setWrongGuesses] = useState(0);
    const [showAnswer, setShowAnswer] = useState(false);
    const [loading, setLoading] = useState(false);

    const intervalRef = useRef();

    const fetchRandomMovie = async () => {
        setLoading(true);
        setInput("");
        setWrongGuesses(0);
        setShowAnswer(false);

        const page = Math.floor(Math.random() * 5) + 1;
        const res = await fetch(`${API_URL}${page}`);
        const data = await res.json();

        const random = data.results[Math.floor(Math.random() * data.results.length)];
        setMovie(random);
        setLoading(false);
    };

    const handleStart = () => {
        setStarted(true);
        setPoints(0);
        setTimer(300);
        fetchRandomMovie();

        intervalRef.current = setInterval(() => {
            setTimer((prev) => {
                if (prev <= 1) {
                    clearInterval(intervalRef.current);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    const handleGuess = () => {
        if (!movie) return;
        const userGuess = input.trim().toLowerCase();
        const correctTitle = movie.title.trim().toLowerCase();

        if (userGuess === correctTitle) {
            setPoints((p) => p + 1);
            fetchRandomMovie();
        } else {
            setWrongGuesses((w) => {
                const newGuesses = w + 1;
                if (newGuesses >= 3) {
                    setShowAnswer(true);
                    setTimeout(() => {
                        fetchRandomMovie();
                    }, 3000);
                }
                return newGuesses;
            });
        }

        setInput("");
    };

    useEffect(() => {
        return () => clearInterval(intervalRef.current);
    }, []);

    if (!started) {
        return (
            <div className="start-container">
                <button onClick={handleStart}>Start Quiz</button>
            </div>
        );
    }

    if (timer <= 0) {
        return (
            <div className="game-over">
                <h2>Tiden er gået!</h2>
                <p>Du fik {points} point.</p>
                <button onClick={handleStart}>Spil igen</button>
            </div>
        );
    }

    // Beregn slør baseret på forkerte gæt (0–3)
    const darkness = 0.85 - (wrongGuesses * 0.3); // går fra 0.85 -> 0.25

    return (
        <div className="quiz-container">
            <div className="top-bar">
                <p>⏱ Tid: {Math.floor(timer / 60)}:{String(timer % 60).padStart(2, "0")}</p>
                <p>🏆 Point: {points}</p>
            </div>

            {loading ? (
                <p className="loading">Indlæser film...</p>
            ) : (
                <>
                    <div className="movie-poster">
                        <img
                            src={`https://image.tmdb.org/t/p/w500${movie?.poster_path}`}
                            alt="Film"
                        />
                        {!showAnswer && (
                            <div
                                className="image-overlay"
                                style={{
                                    background: `rgba(0, 0, 0, ${darkness})`,
                                    backdropFilter: "blur(5px)",
                                }}
                            />
                        )}
                        {showAnswer && <div className="answer-overlay">Svaret var: {movie.title}</div>}
                    </div>

                    {!showAnswer && (
                        <div className="guess-section">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Gæt filmens titel..."
                            />
                            <button onClick={handleGuess}>Gæt</button>
                            <p className="wrong-count">Forkerte gæt: {wrongGuesses}/3</p>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

export default Fetch;
