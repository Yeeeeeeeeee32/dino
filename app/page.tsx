"use client";
import { useEffect, useState, useRef } from "react";

export default function DinoGame() {
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);

  const dinoRef = useRef<HTMLDivElement>(null);
  const cactusRef = useRef<HTMLDivElement>(null);

  // Physics state
  const [y, setY] = useState(0);
  const velocity = useRef(0);
  const gravity = 1.0;
  const jumpForce = -20;
  const groundY = 20;
  const isOnGround = useRef(true);

  // Jump handler
  const handleJump = () => {
    if (isGameOver || !isOnGround.current) return;
    velocity.current = jumpForce;
    isOnGround.current = false;
  };

  // Restart handler
  const handleRestart = () => {
    setScore(0);
    setIsGameOver(false);
    setY(0);
    velocity.current = 0;
    isOnGround.current = true;

    if (cactusRef.current) {
      cactusRef.current.style.animation = "none";
      void cactusRef.current.offsetHeight; // force reflow
      cactusRef.current.style.animation = "cactusMove 2s linear infinite";
      cactusRef.current.style.animationPlayState = "running";
    }
  };

  // Keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (["Space", "ArrowUp"].includes(e.code)) {
        e.preventDefault();
        if (isGameOver) handleRestart();
        else handleJump();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isGameOver]);

  // Physics loop
  useEffect(() => {
    if (isGameOver) return;
    let animationFrame: number;
    let lastTime = performance.now();

    const update = (time: number) => {
      const delta = (time - lastTime) / (1000 / 60); // normalize to 60fps
      lastTime = time;

      velocity.current += gravity * delta;
      let newY = y - velocity.current * delta;

      if (newY < groundY) {
        newY = groundY;
        velocity.current = 0;
        isOnGround.current = true;
      }

      setY(newY);
      animationFrame = requestAnimationFrame(update);
    };

    animationFrame = requestAnimationFrame(update);
    return () => cancelAnimationFrame(animationFrame);
  }, [isGameOver, y]);

  // Collision detection
  useEffect(() => {
    if (isGameOver) return;
    const interval = setInterval(() => {
      const dino = dinoRef.current;
      const cactus = cactusRef.current;
      if (!dino || !cactus) return;

      const dinoRect = dino.getBoundingClientRect();
      const cactusRect = cactus.getBoundingClientRect();

      const isColliding =
        dinoRect.right > cactusRect.left &&
        dinoRect.left < cactusRect.right &&
        dinoRect.bottom > cactusRect.top;

      if (isColliding) setIsGameOver(true);
    }, 50);
    return () => clearInterval(interval);
  }, [isGameOver]);

  // Score counter
  useEffect(() => {
    if (isGameOver) return;
    const timer = setInterval(() => setScore((s) => s + 1), 100);
    return () => clearInterval(timer);
  }, [isGameOver]);

  // Pause cactus animation when game is over
  useEffect(() => {
    if (!cactusRef.current) return;
    cactusRef.current.style.animationPlayState = isGameOver ? "paused" : "running";
  }, [isGameOver]);

  return (
    <div
      className="relative w-full h-screen bg-gray-100 overflow-hidden select-none"
      onClick={isGameOver ? handleRestart : handleJump}
    >
      {/* Score */}
      <div className="absolute top-4 right-4 text-2xl font-bold text-gray-700">
        Score: {score}
      </div>

      {/* Dino */}
      <div
        ref={dinoRef}
        className="absolute left-10 w-12 h-12 bg-green-500 rounded"
        style={{ bottom: `${10 + y}px` }}
      />

      {/* Cactus */}
      <div
        ref={cactusRef}
        className="absolute bottom-10 w-8 h-12 bg-red-500 animate-[cactusMove_2s_linear_infinite]"
      />

      {/* Game Over Overlay */}
      {isGameOver && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/70 backdrop-blur-sm">
          <h1 className="text-4xl font-bold text-red-600 mb-6">Game Over</h1>
          <p className="text-gray-700 mb-4">Press Space or Click to Restart</p>
          <button
            onClick={handleRestart}
            className="px-6 py-2 bg-blue-500 text-white text-lg font-semibold rounded-lg hover:bg-blue-600 transition"
          >
            Restart
          </button>
        </div>
      )}

      <style jsx>{`
        @keyframes cactusMove {
          0% {
            right: -50px;
          }
          100% {
            right: 100%;
          }
        }
      `}</style>
    </div>
  );
}
