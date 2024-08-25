type NumDefs = { [index: string]: RegExp };

export const Numerics: NumDefs = {
  INT: /[0-9]/,
  FLOAT: /(\.|[0-9])/,
} as const;

function getSDigits(s: string): number {
  return !!s.match(/\./) ? s.length - (s.indexOf(".") + 1) : 0;
}

function normalizedMultiply(str: string, num: number): number {
  const sDigCount = getSDigits(str);
  const firstResult = (Number(str) * num).toFixed(sDigCount);
  if (firstResult.length === str.length && firstResult !== str) {
    return Number(firstResult);
  }
  return Number((Number(str) * num).toFixed(sDigCount + 1));
}

export function numericFilter(this: any, e: KeyboardEvent): void {
  if (!this.inputTarget || !this.displayTarget) {
    return;
  }
  const inputVal = this.inputTarget.value;
  const isInt = Numerics.INT.source === this.numType.source;
  switch (true) {
    case !!e.key?.match(this.numType):
      if (
        (e.key?.match(/\./) && inputVal?.match(/\./)) ||
        (isInt && inputVal.length >= 2)
      ) {
        e.preventDefault();
        return;
      }
      const data = inputVal + e.key;
      this.displayValue = this.displayFormatter(data);
      break;
    case "Backspace" === e.key || "Delete" === e.key:
      const vlength = inputVal.length;
      if (vlength > 1) {
        const data = inputVal.slice(0, vlength - 1);
        this.displayValue = this.displayFormatter(data);
      } else {
        this.displayValue = this.displayDefault;
      }
      break;
    case "ArrowRight" === e.key || "ArrowLeft" === e.key:
      break;
    case "ArrowUp" === e.key:
      e.preventDefault();
      if (isInt) {
        this.inputTarget.value = Number(inputVal) + 1;
      } else {
        this.inputTarget.value = normalizedMultiply(inputVal, 1.1);
      }
      this.displayValue = this.displayFormatter(this.inputTarget.value);
      break;
    case "ArrowDown" === e.key:
      e.preventDefault();
      if (isInt) {
        this.inputTarget.value = Number(this.inputTarget.value) - 1;
      } else {
        this.inputTarget.value = normalizedMultiply(inputVal, 0.9);
      }
      this.displayValue = this.displayFormatter(this.inputTarget.value);
      break;
    default:
      e.preventDefault();
      break;
  }
}

export function pasteReject(this: any, e: ClipboardEvent): void {
  e.preventDefault();
  const data = e.clipboardData?.getData("text").trim();
  if (data?.match(/[A-Z|a-z]/) || Array(data?.matchAll(/\./)).length > 1) {
    this.inputTarget.value = Number(data);
    this.displayValue = this.displayFormatter(this.inputTarget.value);
  }
}

export function passData(this: any, _e: InputEvent) {
  const data = this.inputTarget.value;
  if (data) {
    const options = {
      detail: { data },
      bubbles: true,
      composed: true,
    };
    this.dispatchEvent(new CustomEvent("updateNumeric", options));
  }
}
