export default class Feature {
  constructor() {
    if (new.target === Feature) {
      throw new TypeError(
        'Abstract class "Feature" cannot be instantiated directly.'
      );
    }

    if (this.draw === undefined) {
      throw new TypeError(
        "Classes implementing Feature must implement `effect` method"
      );
    }
  }
}
