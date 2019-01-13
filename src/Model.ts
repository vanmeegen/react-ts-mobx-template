import {observable} from "mobx";

const range = (from: number, to: number, step: number = 1) =>
    Array(Math.floor((to - from) / step) + 1)
        .fill(0)
        .map((v, i) => from + i * step);

export enum Field {
    empty,
    border,
    poison,
    snake,
    food
}

export enum Direction {
    left,
    right,
    up,
    down
}


export class Model {
    @observable public board: Field[];
    @observable public finished: boolean;
    @observable public score: number;
    @observable public width: number;
    @observable public height: number;
    /** current move direction of snake */
    @observable private direction: Direction;
    /** array of indices which snake occupies; head is last entry */
    @observable private snake: number[];

    constructor(){
        this.board =[];
        this.finished =true;
        this.score = 0;
        this.width = 0;
        this.height = 0;
        this.direction = Direction.right;
        this.snake = [];
    }

    public at(x: number, y: number): Field {
        const index: number = x + this.width * y;
        return this.board[index];
    }

    public init(width: number, height: number): void {
        this.board = [];
        this.snake = [];
        this.direction = Direction.right;
        this.finished = false;
        this.score = 0;
        this.width = width;
        this.height = height;
        range(0, width * height - 1).forEach(
            idx => (this.board[idx] = Field.empty)
        );
        range(0, width - 1).forEach(idx => {
            this.set(idx, 0, Field.border);
            this.set(idx, height - 1, Field.border);
        });
        range(0, height - 1).forEach(idx => {
            this.set(0, idx, Field.border);
            this.set(width - 1, idx, Field.border);
        });
    }

    public set(x: number, y: number, value: Field): void {
        const index = x + this.width * y;
        this.board[index] = value;
    }

    public initSnake(x: number, y: number, length: number): void {
        this.snake = [];
        range(x, x + length - 1).forEach(idx => {
            const index = idx + y * this.width;
            this.snake.push(index);
            this.board[index] = Field.snake;
        });
        // make sure start direction is cleaned up to avoid crashing right into sth
        range(x + length, x + length + 5).forEach(idx => {
            const index = idx + y * this.width;
            this.board[index] = Field.empty;
        });
    }

    public setDirection(d: Direction): void {
        this.direction = d;
    }

    public createRandom(count: number, content: Field): void {
        for (let i: number = 0; i < count; i++) {
            const randIndex = Math.floor(
                Math.random() * this.width * this.height
            );
            if (this.board[randIndex] === Field.empty) {
                this.board[randIndex] = content;
            }
        }
    }

    public move(): boolean {
        if (!this.finished && this.snake.length > 0) {
            const headIndex = this.snake[this.snake.length - 1];
            let offset = 0;
            switch (this.direction) {
                case Direction.left:
                    offset = -1;
                    break;
                case Direction.right:
                    offset = 1;
                    break;
                case Direction.up:
                    offset = -this.width;
                    break;
                case Direction.down:
                    offset = this.width;
                    break;
            }
            const newIndex = headIndex + offset;
            switch (this.board[newIndex]) {
                case Field.empty:
                    // remove tail on board
                    this.board[this.snake[0]] = Field.empty;
                    this.snake.shift();
                    this.score = this.score + 1;
                    break;
                case Field.food:
                    this.score = this.score + 10;
                    break;
                default:
                    // remove tail on board
                    this.board[this.snake[0]] = Field.empty;
                    this.snake.shift();
                    this.finished = true;
                    break;
            }
            this.snake.push(newIndex);
            this.board[newIndex] = Field.snake;
        }
        return this.finished;
    }

}

export const model = new Model();
