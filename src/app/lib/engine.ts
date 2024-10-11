import { Dispatch, SetStateAction } from "react";
import { debounce } from "./utils";

export type GameState = {
  isRunning: boolean;
  clicked: number;
  score: number;
  mole: number | null;
  holes: number;
  moleVisible: boolean;
};

class Engine {
  private isRunning: boolean;
  private clicked: number;
  private score: number;
  private mole: number | null;
  private holesCount: number;
  private holes: number;
  private setGameState: Dispatch<SetStateAction<GameState>>;
  private moleVisible: boolean;

  constructor(
    holesCount: number,
    setGameState: Dispatch<SetStateAction<GameState>>
  ) {
    this.isRunning = false;
    this.clicked = 0;
    this.score = 0;
    this.mole = null;
    this.holesCount = holesCount;
    this.holes = holesCount;
    this.setGameState = setGameState;
    this.moleVisible = true;
    this.debounceClick = debounce(this.debounceClick.bind(this), 800);
  }

  start() {
    this.isRunning = true;
    this.updateState();
    this.gameLoop();
  }

  stop() {
    this.isRunning = false;
    this.updateState();
  }

  finish() {
    this.isRunning = false;
    this.moleVisible = false;
    this.updateState();
  }

  reset() {
    this.holes = this.holesCount;
    this.moleVisible = true;
    this.isRunning = true;
    this.clicked = 0;
    this.score = 0;
    this.updateState();
    this.gameLoop();
  }

  showMole() {
    this.moleVisible = true;
    this.updateState();
  }

  hideMole() {
    this.moleVisible = false;
    this.updateState();
  }

  setDifficulty(difficulty: number) {
    this.holes = difficulty;
  }

  private gameLoop() {
    if (!this.isRunning) return;

    this.moveMole();
    this.updateState();

    setTimeout(() => {
      this.gameLoop();
    }, Math.random() * 200 + 200);
  }

  private debounceClick() {
    this.moleVisible = true;
    this.updateState();
  }

  clickHole(index: number) {
    this.clicked += 1;

    if (!this.moleVisible) {
      this.debounceClick();
      this.updateState();
      return;
    } else {
      if (index === this.mole) {
        this.score += 1;
      } else {
        this.moleVisible = false;
        this.debounceClick();
      }
    }

    this.updateState();
  }

  private moveMole() {
    this.mole = Math.floor(Math.random() * this.holes);
  }

  private updateState() {
    this.setGameState({
      isRunning: this.isRunning,
      score: this.score,
      mole: this.mole,
      holes: this.holes,
      clicked: this.clicked,
      moleVisible: this.moleVisible,
    });
  }
}

export default Engine;
