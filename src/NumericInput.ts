import { css, html, LitElement } from "lit";
import { customElement, property, state, query } from "lit/decorators.js";

@customElement("numeric-input")
export class NumericInput extends LitElement {
  @query("#figField")
  inputTarget?: HTMLInputElement;

  @property({ type: String })
  figTitle?: string;

  @state()
  rawInput: string | undefined = undefined;

  @state()
  parsedInput?: number;

  parseInput(e: InputEvent) {
    e.preventDefault();
    console.log(e);
    if (!this.inputTarget) return;
    if (e.data?.match(/(\.|[0-9])/)) {
      if (e.data.match(/\./) && this.rawInput?.match(/\./)?.length !== 0) {
        throw Error("Attempting to add more than one decimal!");
      }
      this.rawInput += e.data;
      this.parsedInput = Number(this.inputTarget.value);
    } else if ("deleteContentBackward" === e.inputType) {
      const toTrim = String(this.parsedInput).length - 1;
      const newValue = String(this.parsedInput).slice(0, toTrim);
      this.parsedInput = Number(newValue);
    } else return false;
  }

  render() {
    return html`
      <fieldset>
        <legend>${this.figTitle ?? "Placeholder"}</legend>
        <input
          id="figField"
          type="text"
          @input=${this.parseInput}
          value=${this.rawInput}
        />
        <p>${this.parsedInput ?? "unassigned"}</p>
      </fieldset>
    `;
  }
}
