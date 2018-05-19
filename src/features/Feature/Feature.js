export default class Feature {
  constructor(x, y, context) {
    if (new.target === Feature) {
      throw new TypeError(
        'Abstract class "Feature" cannot be instantiated directly.'
      );
    }

    if (this.effect === undefined) {
      throw new TypeError(
        "Classes implementing Feature must implement `effect` method"
      );
    }

    if (this.interaction === undefined) {
      throw new TypeError(
        "Classes implementing Feature must implement `interaction` method"
      );
    }

    this.x = x;
    this.y = y;
    this.context = context;
  }
}
