import * as React from "react";
import {Direction, Field, Model} from "./Model";
import {observer} from "mobx-react";
import Timer = NodeJS.Timer;
import autobind from "autobind-decorator";

interface IFieldProps {
  fieldContent: Field;
  x: number;
  y: number;
}

@observer
export class FieldComponent extends React.Component<IFieldProps> {
  constructor(props: IFieldProps) {
    super(props);
  }

  public render(): JSX.Element | null {
    // console.log("rendering field " + this.props.x + "," + this.props.y);
    const transform = `translate(${this.props.x * 10},${this.props.y * 10})`;
    let result = null;
    switch (this.props.fieldContent) {
      case Field.empty:
        break;
      case Field.border:
        result = (
          <rect transform={transform} width={10} height={10} fill="black" />
        );
        break;
      case Field.snake:
        result = (
          <rect transform={transform} width={10} height={10} fill="purple" />
        );
        break;
      case Field.food:
        result = (
          <ellipse
            transform={transform}
            cx={3}
            cy={5}
            rx={3}
            ry={5}
            fill="green"
          />
        );
        break;
      case Field.poison:
      default:
        result = (
          <ellipse
            transform={transform}
            cx={5}
            cy={5}
            rx={5}
            ry={5}
            fill="red"
          />
        );
        break;
    }
    return result;
  }
}

interface ILocalProps {
  model: Model;
}

@observer
export class GameComponent extends React.Component<ILocalProps> {
  private timeout: Timer;
  private mainDiv: HTMLDivElement | null;

  constructor(props: ILocalProps) {
    super(props);
  }

  @autobind private newGame(): void {
    this.props.model.init(60, 60);
    this.props.model.createRandom(60, Field.food);
    this.props.model.createRandom(60, Field.poison);
    this.props.model.initSnake(3, 3, 10);
    if (this.mainDiv !== null) {
      this.mainDiv.focus();
    }
    const that = this;
    this.timeout = setInterval(() => {
      const finished = that.props.model.move();
      if (finished) {
        clearTimeout(that.timeout);
      }
    }, 100);
  }

  public render(): JSX.Element {
    const result: JSX.Element[] = [];
    const width = this.props.model.width;
    this.props.model.board.forEach((f, idx) => {
      result.push(
        <FieldComponent key={"F"+idx}
          fieldContent={f}
          x={idx % width}
          y={Math.floor(idx / width)}
        />
      );
    });

    return (
      <div style={{ margin: "10px" }}>
        <div>
          <button onClick={this.newGame} title="New Game">
            New Game
          </button>
          <p>Score: {this.props.model.score}</p>
          {this.props.model.finished ? (
            <h2>You crashed, Game Finished</h2>
          ) : null}
        </div>
        <div
          onKeyDown={this.onKeyDown}
          tabIndex={1}
          ref={c => {
            this.mainDiv = c;
          }}
          style={{ outline: "none" }}
        >
          <svg width="600" height="600" viewBox="0 0 600 600">
            {result}
          </svg>
        </div>
      </div>
    );
  }

  private onKeyDown = (evt: React.KeyboardEvent<HTMLElement>) => {
    let direction: Direction | undefined = undefined;
    switch (evt.keyCode) {
      case 38:
        direction = Direction.up;
        break;
      case 40:
        direction = Direction.down;
        break;
      case 37:
        direction = Direction.left;
        break;
      case 39:
        direction = Direction.right;
        break;
    }
    if (direction !== undefined) {
      this.props.model.setDirection(direction);
    }
  }
}
