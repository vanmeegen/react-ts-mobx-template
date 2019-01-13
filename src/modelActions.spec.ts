import {Direction, Field, model} from "./Model";
import {toJS} from "mobx";

describe("Model describes state and action for Snake Game", () => {
  it("initializes an empty model", () => {
    model.init(0, 0);
    expect(toJS(model)).toMatchObject({
      board: [],
      direction: Direction.right,
      finished: false,
      height: 0,
      score: 0,
      width: 0,
      snake: []
    });
  });

  it("initializes a models size and border correctly ", () => {
    model.init(4, 4);
    expect(toJS(model.board)).toMatchObject([
      Field.border,
      Field.border,
      Field.border,
      Field.border,
      Field.border,
      Field.empty,
      Field.empty,
      Field.border,
      Field.border,
      Field.empty,
      Field.empty,
      Field.border,
      Field.border,
      Field.border,
      Field.border,
      Field.border
    ]);
    expect(model.width).toEqual(4);
    expect(model.height).toEqual(4);
  });

  describe("It can move a snake on the board", () => {
    beforeEach(() => {
      model.init(10, 10);
    });

    it("creates a snake of a given length", () => {
      model.initSnake(3, 3, 3);
      expect(model.at(3, 3)).toEqual(Field.snake);
      expect(model.at(4, 3)).toEqual(Field.snake);
      expect(model.at(5, 3)).toEqual(Field.snake);
      expect(model.at(6, 3)).toEqual(Field.empty);
    });

    it("moves a snake in the current direction for action move", () => {
      model.initSnake(3, 3, 3);
      model.move();
      expect(model.at(3, 3)).toEqual(Field.empty);
      expect(model.at(4, 3)).toEqual(Field.snake);
      expect(model.at(5, 3)).toEqual(Field.snake);
      expect(model.at(6, 3)).toEqual(Field.snake);
    });

    it("moves up if direction up is set before", () => {
      model.initSnake(3, 3, 3);
      model.setDirection(Direction.up);
      model.move();
      expect(model.at(3, 3)).toEqual(Field.empty);
      expect(model.at(4, 3)).toEqual(Field.snake);
      expect(model.at(5, 3)).toEqual(Field.snake);
      expect(model.at(5, 2)).toEqual(Field.snake);
    });

    it("moves down if direction down is set before", () => {
      model.initSnake(3, 3, 3);
      model.setDirection(Direction.down);
      model.move();
      expect(model.at(3, 3)).toEqual(Field.empty);
      expect(model.at(4, 3)).toEqual(Field.snake);
      expect(model.at(5, 3)).toEqual(Field.snake);
      expect(model.at(5, 4)).toEqual(Field.snake);
    });
    it("moves right if direction right is set before", () => {
      model.initSnake(3, 3, 3);
      model.setDirection(Direction.up);
      model.setDirection(Direction.right);
      model.move();
      expect(model.at(3, 3)).toEqual(Field.empty);
      expect(model.at(4, 3)).toEqual(Field.snake);
      expect(model.at(5, 3)).toEqual(Field.snake);
      expect(model.at(6, 3)).toEqual(Field.snake);
    });
    it("makes snake longer if it eats food", () => {
      model.initSnake(3, 3, 3);
      model.set(6, 3, Field.food);
      model.setDirection(Direction.right);
      model.move();
      expect(model.at(3, 3)).toEqual(Field.snake);
      expect(model.at(4, 3)).toEqual(Field.snake);
      expect(model.at(5, 3)).toEqual(Field.snake);
      expect(model.at(6, 3)).toEqual(Field.snake);
      expect(model.finished).toEqual(false);
    });
    it("finishes game if it runs into itself", () => {
      model.initSnake(3, 3, 3);
      model.setDirection(Direction.left);
      model.move();
      expect(model.at(3, 3)).toEqual(Field.empty);
      expect(model.at(4, 3)).toEqual(Field.snake);
      expect(model.at(5, 3)).toEqual(Field.snake);
      expect(model.finished).toEqual(true);
    });
  });
});
