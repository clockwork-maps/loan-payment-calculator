import { LitElement, html, unsafeCSS, css } from 'lit'
import { customElement, state } from 'lit/decorators.js'
import style from './components.css?inline'
import './user-inputs.ts'
import './calc-results.ts'

@customElement('loan-paycalc')
export class LoanPaycalc extends LitElement{
    @state() private _initialAmount: number = 0;
    @state() private _interestLiteral: number = 0;
    @state() private _amortizationFactor: number = 1;

    render(){
        return html`
            <user-inputs @cast-initial=${this.updateIA} @cast-literal=${this.updateIL} @cast-amortization=${this.updateAF}></user-inputs>
            <calc-results .initialAmount=${this._initialAmount} .interestLiteral=${this._interestLiteral} .amortizationFactor=${this._amortizationFactor}></calc-results>
        `
    }

    static styles = [unsafeCSS(style), css`
        :host{
            height: 100vh;
            width: 100vw;
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            row-gap: 5px;
        }
    `]

    updateIA(e: CustomEvent){
        const update: number | undefined = e.detail;
        if (update !== undefined) {
            this._initialAmount = update;
        } 
    }
    updateIL(e: CustomEvent){
        const update: number | undefined = e.detail;
        if (update !== undefined) {
            this._interestLiteral = update;
        }
    }

    updateAF(e: CustomEvent){
        const update: number | undefined = e.detail;
        if (update !== undefined) {
            if (update < 1) this._amortizationFactor = 1;
            else this._amortizationFactor = update;
        }
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'loan-paycalc' : LoanPaycalc
    }
}