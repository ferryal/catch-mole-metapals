"use client";

import { useEffect, useMemo, useState } from "react";
import styles from "./page.module.scss";
import { Hole } from "@/app/components/Hole";
import useTimer from "@/app/hooks/useTimer";
import Engine, { GameState } from "@/app/lib/engine";

export default function Home() {
  const [isFinished, setIsFinished] = useState(false);
  const [gameState, setGameState] = useState<GameState>({
    isRunning: false,
    score: 0,
    mole: null,
    moleVisible: true,
    holes: 3,
    clicked: 0,
  });

  const timer = useTimer();

  const gameEngine = useMemo(() => {
    return new Engine(3, setGameState);
  }, []);

  const startGameHandler = () => {
    if (isFinished) {
      gameEngine.reset();
      timer.reset();
      timer.start();
      setIsFinished(false);
    } else {
      gameEngine.start();
      timer.start();
    }
  };

  const clickHoleHandler = (index: number) => {
    gameEngine.clickHole(index);
  };

  useEffect(() => {
    if (gameState.score >= 1) {
      gameEngine.finish();
      setIsFinished(true);
      timer.stop();
      alert("You already catch the mole, restart the game!");
    }
  }, [gameState.score, gameState.holes]);

  return (
    <>
      <div className={styles.container}>
        {!gameState.isRunning && (
          <h1 className={styles.title}>MetaPals Catch a Mole!</h1>
        )}
      </div>

      <div className={styles.container}>
        <div className={styles.holeContainer}>
          {gameState &&
            [...Array(gameState?.holes)].map((_, index) => (
              <Hole
                isMoleVisible={
                  gameState.mole === index && gameState.moleVisible
                }
                key={index}
                onClick={() => {
                  gameState?.isRunning && clickHoleHandler(index);
                  gameState.moleVisible && clickHoleHandler(index);
                }}
              />
            ))}
        </div>

        {(gameState?.isRunning || isFinished) && (
          <div className={styles.stats}>
            <p>Clicked : {gameState?.clicked} </p>
            <p className={styles.score}>Score: {gameState.score}</p>
            <p>
              Accuracy :{" "}
              {gameState.clicked
                ? ((gameState.score / gameState.clicked) * 100).toFixed(2)
                : 0}{" "}
              %
            </p>
            <p>Elapsed time: {timer.time} seconds</p>
          </div>
        )}

        <button
          disabled={gameState.isRunning}
          className={`${styles.startButton} ${
            !gameState?.isRunning || !isFinished ? styles.paddingButton : ""
          }`}
          onClick={() => startGameHandler()}
        >
          {gameState.isRunning ? "Running" : "Start"}
        </button>
      </div>
    </>
  );
}
