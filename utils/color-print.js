const blue = "\x1b[34m";
const green = "\x1b[32m";
const red = "\x1b[31m";
const black = "\x1b[30m";
const yellow = "\x1b[33m";
const magenta = "\x1b[35m";
const cyan = "\x1b[36m";
const white = "\x1b[37m";
const gray = "\x1b[90m";
const reset = "\x1b[0m";

class ColorPrint {
  constructor() {}

  #wrap(color, ...args) {
    return {
      [Symbol.for("nodejs.util.inspect.custom")]() {
        return `${color}${args.join(" ")}${reset}`;
      },
    };
  }

  blue(...args) {
    return this.#wrap(blue, ...args);
  }
  red(...args) {
    return this.#wrap(red, ...args);
  }
  green(...args) {
    return this.#wrap(green, ...args);
  }
  black(...args) {
    return this.#wrap(black, ...args);
  }
  yellow(...args) {
    return this.#wrap(yellow, ...args);
  }
  magenta(...args) {
    return this.#wrap(magenta, ...args);
  }
  cyan(...args) {
    return this.#wrap(cyan, ...args);
  }
  white(...args) {
    return this.#wrap(white, ...args);
  }
  gray(...args) {
    return this.#wrap(gray, ...args);
  }
}

export const colors = new ColorPrint();
