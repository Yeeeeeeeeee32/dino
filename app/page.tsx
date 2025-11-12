"use client";
import { useEffect, useState, useRef } from "react";

/**
 * 🎲 Helper function to get a random number within a range.
 * We use this to decide how long to wait before spawning a new cactus.
 * @param min - The minimum possible value
 * @param max - The maximum possible value
 * @returns A random number between min and max
 */
function getRandomNumber(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

export default function SimplifiedDino() {
  // ------------------------------------------------------------------
  // 1. STATE & REFS (The Game's "Memory")
  // ------------------------------------------------------------------

  // --- "Public Scoreboard" (useState) ---
  // When these change, the component re-draws.
  const [y, setY] = useState(0); // The dino's vertical (up/down) position
  const [isGameOver, setIsGameOver] = useState(false); // Tracks if the game is active or over
  const [cactusX, setCactusX] = useState(500); // The cactus's horizontal (left/right) position
  const gameSpeed = 5; // How fast the cactus moves

  // --- "Private Notes" (useRef) ---
  // We can change these without re-drawing the component.
  const velocity = useRef(0); // How fast the dino is falling or rising
  const isOnGround = useRef(true); // Is the dino on the ground?
  const dinoRef = useRef<HTMLDivElement>(null); // A "pointer" to the dino's HTML div
  const cactusRef = useRef<HTMLDivElement>(null); // A "pointer" to the cactus's HTML div

  // Refs for the random spawner
  const spawnTimer = useRef(0); // A timer that counts up (in milliseconds)
  const nextSpawnTime = useRef(getRandomNumber(1500, 3500)); // The random time to wait

  // --- Constants ---
  const gravity = 1.0;
  const jumpForce = -20; // A negative number to push the dino "up"
  const groundY = 0; // The 'floor' position. `y` will not go below this.

  // ------------------------------------------------------------------
  // 2. CORE LOGIC (The Game's "Actions")
  // ------------------------------------------------------------------

  /**
   * 🏃‍♂️ Makes the dino jump.
   * Called by the keyboard manager.
   */
  const handleJump = () => {
    // Can't jump if in the air or if the game is over
    if (!isOnGround.current || isGameOver) return;
    velocity.current = jumpForce; // Apply the upward force
    isOnGround.current = false; // The dino is now in the air
  };

  /**
   * 🔄 Resets the game to its starting state.
   * Called by the keyboard manager when the game is over.
   */
  const handleRestart = () => {
    setIsGameOver(false); // Game is now active
    setY(0); // Put dino back on the ground
    velocity.current = 0; // Stop all movement
    isOnGround.current = true;
    setCactusX(500); // Move cactus back to the start
    spawnTimer.current = 0; // Reset the spawn timer
    nextSpawnTime.current = getRandomNumber(1500, 3500); // Get a new random time
  };

  // ------------------------------------------------------------------
  // 3. "MANAGERS" (useEffect)
  // These run in the background.
  // ------------------------------------------------------------------

  /**
   * ⌨️ "Manager" 1: Keyboard Input
   * This effect runs once to set up a "manager" that listens for the spacebar.
   */
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault(); // Stop the page from scrolling
        
        // Check our "public scoreboard" state
        if (isGameOver) {
          handleRestart();
        } else {
          handleJump();
        }
      }
    };

    // "Hire" the manager
    window.addEventListener("keydown", handleKeyDown);
    // "Fire" the manager when the component unmounts (cleans up)
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isGameOver]); // It re-runs if `isGameOver` changes to update its logic

  /**
   * 🚀 "Manager" 2: The Main Game Loop (The "Heartbeat")
   * This is the core of the game. It runs on every single frame.
   * It handles physics (gravity) and cactus movement/spawning.
   */
  useEffect(() => {
    // If the game is over, this manager stops working.
    if (isGameOver) return;

    let animationFrame: number;
    let lastTime = performance.now(); // Get the current time

    const update = (time: number) => {
      // 1. Calculate Deltas (how much time has passed since the last frame)
      const rawDelta = time - lastTime; // Milliseconds elapsed
      const normalizedDelta = rawDelta / (1000 / 60); // A number for consistent speed
      lastTime = time;

      // 2. Update "Private Notes" (Physics Refs) FIRST
      velocity.current += gravity * normalizedDelta; // Apply gravity
      spawnTimer.current += rawDelta; // Add milliseconds to our timer

      // 3. Update "Public Scoreboard" (State)
      
      // --- Dino Physics ---
      setY((currentY) => {
        let newY = currentY - velocity.current * normalizedDelta;

        if (newY < groundY) {
          // The dino hit the ground
          newY = groundY;
          velocity.current = 0; // Stop falling
          isOnGround.current = true;
        }
        return newY; // Set the new 'y' state
      });

      // --- Cactus Spawning & Movement ---
      setCactusX((currentX) => {
        // If cactus is on-screen (x > -50), move it left
        if (currentX > -50) {
          return currentX - gameSpeed * normalizedDelta;
        }

        // If cactus is off-screen, check the spawn timer
        if (spawnTimer.current >= nextSpawnTime.current) {
          spawnTimer.current = 0; // Reset timer
          nextSpawnTime.current = getRandomNumber(1500, 3500); // Get new time
          return 500; // Respawn cactus on the right
        }

        // Timer not ready, keep cactus off-screen
        return currentX;
      });

      // Tell the browser to run this `update` function again on the next frame
      animationFrame = requestAnimationFrame(update);
    };

    // Start the "heartbeat"
    animationFrame = requestAnimationFrame(update);
    
    // Cleanup: If the game is over, stop the loop
    return () => cancelAnimationFrame(animationFrame);
  }, [isGameOver]); // This effect re-runs if `isGameOver` changes

  /**
   * 💥 "Manager" 3: Collision Detection
   * This manager runs on a simple timer to check if the dino and cactus
   * are touching.
   */
  useEffect(() => {
    if (isGameOver) return; // Don't check for collisions if game is over

    const interval = setInterval(() => {
      // Get the "pointers" to the HTML elements
      const dino = dinoRef.current;
      const cactus = cactusRef.current;
      if (!dino || !cactus) return; // Skip if they aren't on screen yet

      // Get the "bounding box" (size and position) of each element
      const dinoRect = dino.getBoundingClientRect();
      const cactusRect = cactus.getBoundingClientRect();

      // Check if the boxes are overlapping
      const isColliding =
        dinoRect.right > cactusRect.left &&
        dinoRect.left < cactusRect.right &&
        dinoRect.bottom > cactusRect.top;

      if (isColliding) {
        setIsGameOver(true); // If they touch, it's Game Over!
      }
    }, 10); // Check every 10 milliseconds

    // Cleanup: Stop this timer when the game is over
    return () => clearInterval(interval);
  }, [isGameOver]);

  // ------------------------------------------------------------------
  // 4. RENDER (The "Blueprint")
  // This is the HTML (JSX) that React draws on the screen.
  // ------------------------------------------------------------------
  return (
    <div
      className="game-area"
      // Allow clicking/tapping the screen to jump or restart
      onClick={isGameOver ? handleRestart : handleJump}
    >
      {/* Game Over Screen: Only shows if `isGameOver` is true */}
      {isGameOver && (
        <div className="game-over-overlay">
          <h1>Game Over</h1>
          <p>Click or Press Space to Restart</p>
        </div>
      )}

      <p className="instructions">Press Space or Click to Jump</p>

      {/* The Dino */}
      <div
        ref={dinoRef} // "Attach" our pointer to this div
        className="dino"
        // The dino's position is tied to the 'y' state
        style={{ bottom: `${10 + y}px` }}
      />

      {/* The Cactus */}
      <div
        ref={cactusRef} // "Attach" our pointer to this div
        className="cactus"
        // The cactus's position is tied to the 'cactusX' state
        style={{ left: `${cactusX}px` }}
      />

      {/* The Ground */}
      <div className="ground" />

      {/* Local CSS styles for this component */}
      <style jsx>{`
        .game-area {
          position: relative;
          width: 500px;
          height: 300px;
          background-color: #f0f0f0;
          border: 2px solid #333;
          overflow: hidden; /* Hides cactus when it's off-screen */
          user-select: none; /* Prevents text highlighting */
          margin: auto; /* Centers the game area */
        }
        .game-over-overlay {
          position: absolute;
          inset: 0; /* (top: 0, left: 0, right: 0, bottom: 0) */
          background-color: rgba(255, 255, 255, 0.7);
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          font-family: sans-serif;
          z-index: 10;
        }
        .game-over-overlay h1 {
          color: red;
          margin: 0;
        }
        .instructions {
          text-align: center;
          font-family: sans-serif;
          color: #555;
        }
        .dino {
          position: absolute;
          left: 50px;
          width: 40px;
          height: 40px;
          background-color: green;
        }
        .ground {
          position: absolute;
          bottom: 10px; /* Must match the '10' in the dino's style */
          left: 0;
          width: 100%;
          height: 2px;
          background-color: #333;
        }
        .cactus {
          position: absolute;
          bottom: 10px;
          width: 20px;
          height: 50px;
          background-color: red;
        }
      `}</style>
    </div>
  );
}