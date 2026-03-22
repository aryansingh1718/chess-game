import { Board } from "../game/game";
export function createInitialBoard(): Board {
    return [
        // Black pieces (top)
        [
            { type: "r", color: "b" },
            { type: "n", color: "b" },
            { type: "b", color: "b" },
            { type: "q", color: "b" },
            { type: "k", color: "b" },
            { type: "b", color: "b" },
            { type: "n", color: "b" },
            { type: "r", color: "b" }
        ],
        [
            { type: "p", color: "b" },
            { type: "p", color: "b" },
            { type: "p", color: "b" },
            { type: "p", color: "b" },
            { type: "p", color: "b" },
            { type: "p", color: "b" },
            { type: "p", color: "b" },
            { type: "p", color: "b" }
        ],

        // Empty squares
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],

        // White pieces (bottom)
        [
            { type: "p", color: "w" },
            { type: "p", color: "w" },
            { type: "p", color: "w" },
            { type: "p", color: "w" },
            { type: "p", color: "w" },
            { type: "p", color: "w" },
            { type: "p", color: "w" },
            { type: "p", color: "w" }
        ],
        [
            { type: "r", color: "w" },
            { type: "n", color: "w" },
            { type: "b", color: "w" },
            { type: "q", color: "w" },
            { type: "k", color: "w" },
            { type: "b", color: "w" },
            { type: "n", color: "w" },
            { type: "r", color: "w" }
        ]
    ];
}