module.exports = [
"[project]/app/favicon.ico.mjs { IMAGE => \"[project]/app/favicon.ico (static in ecmascript, tag client)\" } [app-rsc] (structured image object, ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/app/favicon.ico.mjs { IMAGE => \"[project]/app/favicon.ico (static in ecmascript, tag client)\" } [app-rsc] (structured image object, ecmascript)"));
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[project]/app/layout.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/app/layout.tsx [app-rsc] (ecmascript)"));
}),
"[project]/app/page.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>DinoGame
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react.js [app-rsc] (ecmascript)");
;
;
;
// --- CHANGED ---
// We define constants based on "pixels per second" now.
// This makes them independent of frame rate.
const GRAVITY_PS2 = 2500; // pixels per second per second
const JUMP_STRENGTH_PS = -800; // pixels per second
const OBSTACLE_SPEED_PS = 350; // pixels per second
const GROUND_Y = 0;
// (These are for collision)
const DINO_X_POS = 60;
const DINO_WIDTH = 40;
const DINO_HEIGHT = 40;
const OBSTACLE_WIDTH = 40;
const OBSTACLE_HEIGHT = 40;
// --- NEW ---
// Constants for multi-jump
const MAX_JUMPS = 2; // Allow a double jump
const SECOND_JUMP_MODIFIER = 0.7; // Second jump is 70% as strong
function DinoGame() {
    const [isJumping, setIsJumping] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useState"])(false);
    const [dinoY, setDinoY] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useState"])(0);
    const [isGameOver, setIsGameOver] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useState"])(false);
    const [score, setScore] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useState"])(0);
    const [gameRunning, setGameRunning] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useState"])(true);
    const [obstacleX, setObstacleX] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useState"])(600);
    const [jumpCount, setJumpCount] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useState"])(0); // --- NEW ---
    // Velocity is now a ref. It's part of the physics "engine"
    // and doesn't need to trigger a re-render on its own.
    const velocityRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useRef"])(0);
    const gameLoopRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useRef"])(null);
    const lastTimeRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useRef"])(null);
    const restartGame = ()=>{
        setIsGameOver(false);
        setGameRunning(true);
        setScore(0);
        setObstacleX(600);
        setDinoY(GROUND_Y);
        velocityRef.current = 0;
        setIsJumping(false);
        setJumpCount(0); // --- NEW ---
    };
    // --- Input Handler (Logic is CHANGED) ---
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const handleKeyDown = (e)=>{
            if ((e.code === "Space" || e.code === "ArrowUp") && !isGameOver) {
                // --- CHANGED ---
                // This is the new multi-jump logic
                if (jumpCount < MAX_JUMPS) {
                    let jumpStrength;
                    if (jumpCount === 0) {
                        jumpStrength = JUMP_STRENGTH_PS; // Full power first jump
                    } else {
                        jumpStrength = JUMP_STRENGTH_PS * SECOND_JUMP_MODIFIER; // Weaker 2nd jump
                    }
                    velocityRef.current = jumpStrength;
                    setIsJumping(true); // Ensures gravity applies
                    setJumpCount(jumpCount + 1); // Use the current state value
                }
            } else if (isGameOver && e.code === "Space") {
                restartGame();
            }
        };
        const handleClick = ()=>{
            if (!isGameOver) {
                // --- CHANGED ---
                // This is the new multi-jump logic
                if (jumpCount < MAX_JUMPS) {
                    let jumpStrength;
                    if (jumpCount === 0) {
                        jumpStrength = JUMP_STRENGTH_PS; // Full power first jump
                    } else {
                        jumpStrength = JUMP_STRENGTH_PS * SECOND_JUMP_MODIFIER; // Weaker 2nd jump
                    }
                    velocityRef.current = jumpStrength;
                    setIsJumping(true); // Ensures gravity applies
                    setJumpCount(jumpCount + 1); // Use the current state value
                }
            } else if (isGameOver) {
                restartGame();
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("mousedown", handleClick);
        return ()=>{
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("mousedown", handleClick);
        };
    }, [
        isGameOver,
        jumpCount
    ]); // --- CHANGED --- (Added jumpCount)
    // --- Game Loop (One line CHANGED) ---
    const updateGame = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        // 1. Get current time and calculate delta
        const currentTime = Date.now();
        let deltaTime = 0;
        if (lastTimeRef.current != null) {
            deltaTime = (currentTime - lastTimeRef.current) / 1000.0; // Delta time in seconds
        }
        lastTimeRef.current = currentTime;
        if (!gameRunning) {
            return; // Don't update if game isn't running
        }
        // --- Dino Physics ---
        setDinoY((prevY)=>{
            let newY = prevY;
            if (isJumping) {
                // Apply gravity
                velocityRef.current += GRAVITY_PS2 * deltaTime;
                // Update position
                newY += velocityRef.current * deltaTime;
            }
            // Check for landing
            if (newY <= GROUND_Y) {
                newY = GROUND_Y;
                velocityRef.current = 0;
                setIsJumping(false);
                setJumpCount(0); // --- CHANGED --- RESET JUMP COUNTER ON LAND
            }
            return newY;
        });
        // --- Obstacle Movement ---
        setObstacleX((prevX)=>{
            let newX = prevX - OBSTACLE_SPEED_PS * deltaTime;
            // If obstacle is off-screen, reset it and add score
            if (newX < -OBSTACLE_WIDTH) {
                setScore((s)=>s + 1);
                return 600; // Reset position
            }
            return newX;
        });
        // --- Collision Detection ---
        const dinoRect = {
            x: DINO_X_POS,
            y: dinoY,
            w: DINO_WIDTH,
            h: DINO_HEIGHT
        };
        const obstacleRect = {
            x: obstacleX,
            y: GROUND_Y,
            w: OBSTACLE_WIDTH,
            h: OBSTACLE_HEIGHT
        };
        if (dinoRect.x < obstacleRect.x + obstacleRect.w && dinoRect.x + dinoRect.w > obstacleRect.x && dinoRect.y < obstacleRect.y + obstacleRect.h && dinoRect.y + dinoRect.h > obstacleRect.y) {
            setIsGameOver(true);
            setGameRunning(false);
            return; // Stop the loop
        }
        // Request the next frame
        gameLoopRef.current = requestAnimationFrame(updateGame);
    }, [
        gameRunning,
        isJumping,
        dinoY,
        obstacleX
    ]);
    // --- Effect to START the loop ---
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (gameRunning) {
            // Reset time and start the loop
            lastTimeRef.current = null;
            gameLoopRef.current = requestAnimationFrame(updateGame);
        } else {
            // Stop the loop
            if (gameLoopRef.current) {
                cancelAnimationFrame(gameLoopRef.current);
            }
        }
        // Cleanup function
        return ()=>{
            if (gameLoopRef.current) {
                cancelAnimationFrame(gameLoopRef.current);
            }
        };
    }, [
        gameRunning,
        updateGame
    ]); // Start/stop when gameRunning changes
    // --- JSX (No changes) ---
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "jsx-8714fc6e4e35531" + " " + "flex flex-col items-center justify-center h-screen bg-gray-900 text-white",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                className: "jsx-8714fc6e4e35531" + " " + "text-2xl font-bold mb-4",
                children: "Dino Game"
            }, void 0, false, {
                fileName: "[project]/app/page.tsx",
                lineNumber: 200,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "jsx-8714fc6e4e35531" + " " + "relative w-[600px] h-[200px] bg-gray-800 overflow-hidden border border-gray-600",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            bottom: `${dinoY}px`,
                            left: `${DINO_X_POS}px`
                        },
                        className: "jsx-8714fc6e4e35531" + " " + "absolute left-10 w-10 h-10 bg-green-400 rounded"
                    }, void 0, false, {
                        fileName: "[project]/app/page.tsx",
                        lineNumber: 202,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            left: `${obstacleX}px`
                        },
                        className: "jsx-8714fc6e4e35531" + " " + "absolute bottom-0 w-10 h-10 bg-red-500"
                    }, void 0, false, {
                        fileName: "[project]/app/page.tsx",
                        lineNumber: 206,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "jsx-8714fc6e4e35531" + " " + "absolute bottom-0 w-full h-2 bg-gray-500"
                    }, void 0, false, {
                        fileName: "[project]/app/page.tsx",
                        lineNumber: 210,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/page.tsx",
                lineNumber: 201,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "jsx-8714fc6e4e35531" + " " + "mt-4 text-lg",
                children: [
                    "Score: ",
                    score
                ]
            }, void 0, true, {
                fileName: "[project]/app/page.tsx",
                lineNumber: 212,
                columnNumber: 7
            }, this),
            isGameOver && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "jsx-8714fc6e4e35531" + " " + "mt-2 text-red-400 font-semibold",
                children: "Game Over — Press Space or Click to Restart"
            }, void 0, false, {
                fileName: "[project]/app/page.tsx",
                lineNumber: 214,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(void 0, {
                id: "8714fc6e4e35531",
                children: "@keyframes cactusMove{0%{right:-50px}to{right:100%}}"
            }, void 0, false, void 0, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/page.tsx",
        lineNumber: 199,
        columnNumber: 5
    }, this);
}
}),
"[project]/app/page.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/app/page.tsx [app-rsc] (ecmascript)"));
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__1222724e._.js.map