import { unsafeCSS, html, LitElement, CSSResultGroup } from "lit";
import { customElement, state } from "lit/decorators.js";

import { Numerics } from "../utils/inputEvents";
import styles from "../css/UserInputs.css?inline";
import "./NumericInput";

enum Placeholders {
  INITIAL_AMOUNT = ": 12345.67",
  PERCENT_INTEREST = ": 12.34567",
  AMORTIZATION_FACTOR = ": 12",
}

@customElement("user-inputs")
export class UserInput extends LitElement {
  static styles: CSSResultGroup = [unsafeCSS(styles)];

  @state()
  initialAmount?: number;

  @state()
  percentInterest?: number;

  @state()
  amortizationFactor?: number;

  render() {
    return html`
      <section>
        <numeric-input
          figTitle="Initial Amount"
          inputPlaceholder="${Placeholders.INITIAL_AMOUNT}"
          .displayFormatter=${(str: string): string => {
            return new Intl.NumberFormat("en-US").format(
              str as unknown as number,
            );
          }}
          .numType=${Numerics.FLOAT}
          @updateNumeric=${(e: CustomEvent) => {
            this.initialAmount = e.detail.data;
          }}
        ></numeric-input>
        <numeric-input
          figTitle="Percent Interest"
          inputPlaceholder="${Placeholders.PERCENT_INTEREST}"
          .displayFormatter=${(str: string): string => {
            return new Intl.NumberFormat("en-US", {
              style: "percent",
              maximumFractionDigits: 3,
            }).format(str as unknown as number);
          }}
          .numType=${Numerics.FLOAT}
          @updateNumeric=${(e: CustomEvent) => {
            this.percentInterest = e.detail.data;
          }}
        ></numeric-input>
        <numeric-input
          figTitle="Amortization Factor"
          .inputPlaceholder="${Placeholders.AMORTIZATION_FACTOR}"
          .numType=${Numerics.INT}
          @updateNumeric=${(e: CustomEvent) => {
            this.amortizationFactor = e.detail.data;
          }}
        ></numeric-input>
      </section>
    `;
  }
}
