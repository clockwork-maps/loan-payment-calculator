import { css, html, LitElement } from "lit";
import { customElement, property, state, query } from "lit/decorators.js";

import { of, Subscription } from "rxjs";

@customElement("numeric-input")
export class NumericInput extends LitElement {
  #rawInput?: Subscription;

  @query("#figField")
  inputTarget?: HTMLInputElement;

  @property({ type: String })
  figTitle?: string;

  @state()
  parsedInput?: number;

  connectedCallback(): void {
    super.connectedCallback();
    this.#rawInput = of(this.inputTarget?.value).subscribe((val) => {
      this.parsedInput = "number" === typeof val ? val : this.parsedInput;
      this.requestUpdate();
    });
  }

  disconnectedCallback(): void {
    this.#rawInput?.unsubscribe();
  }

  render() {
    return html`
      <fieldset>
        <legend>${this.figTitle ?? "Placeholder"}</legend>
        <input id="figField" type="text" />
        <p>${this.parsedInput ?? "unassigned"}</p>
      </fieldset>
    `;
  }
}
