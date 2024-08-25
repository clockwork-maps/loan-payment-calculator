import {
  unsafeCSS,
  html,
  LitElement,
  CSSResultGroup,
  PropertyValueMap,
} from "lit";
import { customElement, property, state, query } from "lit/decorators.js";

import { numericFilter, passData, pasteReject } from "../utils/inputEvents";
import styles from "../css/NumericInput.css?inline";

enum DefaultStrings {
  TITLE_UNASSIGNED = "Numeric Input Field",
  PLACEHOLDER_UNASSIGNED = "Please Enter a Numeric Input",
}

@customElement("numeric-input")
export class NumericInput extends LitElement {
  @query("input")
  inputTarget?: HTMLInputElement;

  @query("p")
  displayTarget?: HTMLParagraphElement;

  @property({ type: String })
  figTitle?: string;

  @property({ type: String })
  inputPlaceholder!: string;

  @property({ type: Function })
  displayFormatter: (x: string) => string = (x: string) => x;

  @property({ type: RegExp })
  numType!: RegExp;

  @state()
  displayValue?: string;

  @state()
  displayDefault?: string;

  static styles: CSSResultGroup = [unsafeCSS(styles)];

  protected firstUpdated(
    _changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>,
  ): void {
    this.displayDefault = this.displayFormatter(
      this.inputPlaceholder.slice(2) ?? "1234",
    );
  }

  render() {
    return html`
      <fieldset>
        <legend>${this.figTitle ?? DefaultStrings.TITLE_UNASSIGNED}</legend>
        <article>
          <input
            type="text"
            placeholder=${this.inputPlaceholder ??
            DefaultStrings.PLACEHOLDER_UNASSIGNED}
            @input=${passData}
            @keydown=${numericFilter}
            @paste=${pasteReject}
          />
          <p>${this.displayValue ?? this.displayDefault}</p>
        </article>
      </fieldset>
    `;
  }
}
