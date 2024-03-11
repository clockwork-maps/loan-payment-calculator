import { LitElement, html, unsafeCSS, css } from 'lit'
import { customElement, state } from 'lit/decorators.js'
import style from './components.css?inline'
import './numeric-input.ts'

@customElement('user-inputs')
export class UserInputs extends LitElement {
    @state() private _initialAmount: number = 0;
    @state() private _interestLiteral: number = 0;
    @state() private _amortizationFactor: number = 1;
    @state() private _collectionRate: number = this._interestLiteral/this._amortizationFactor;

    render(){
        return html`
            <article class="controls">
                <h5 class="cTitle">Loan Payment Calculator</h5>
                <div class="cBox">
                    <numeric-input @numeric-update=${this.updateIA} legend=${'Initial Amount'}></numeric-input>
                    <p class="numericDisplay">${new Intl.NumberFormat("en-US", {style: "decimal", minimumFractionDigits: 2, maximumFractionDigits: 2}).format(this._initialAmount)}</p>
                </div>
                <div class="cBox">
                    <numeric-input @numeric-update=${this.updateIL} legend=${'Interest Literal'}></numeric-input>
                    <p class="numericDisplay">${new Intl.NumberFormat("en-US", {style: "percent", minimumFractionDigits: 2, maximumFractionDigits: 2}).format(this._interestLiteral)} interest</p>
                </div>
                <div class="cBox">
                    <numeric-input @numeric-update=${this.updateAF} legend=${'Amortization Factor'}></numeric-input>
                    <p class="numericDisplay">${new Intl.NumberFormat("en-US", {style: "percent", minimumFractionDigits: 2, maximumFractionDigits: 2}).format(this._collectionRate)} amortized interest</p>
                </div>
            </article>
        `
    }

    static styles = [unsafeCSS(style), css`
        :host{
            justify-self: center;
        }
    `];

    updateIA(e: CustomEvent){
        const update: number | undefined = e.detail;
        if (update !== undefined) {
            this._initialAmount = update;
            this.dispatchEvent(new CustomEvent("cast-initial", {
                bubbles: true,
                detail: this._initialAmount
            }))
        } 
    }
    updateIL(e: CustomEvent){
        const update: number | undefined = e.detail;
        if (update !== undefined) {
            this._interestLiteral = update;
            this.dispatchEvent(new CustomEvent("cast-literal", {
                bubbles: true,
                detail: this._interestLiteral
            }))
        }
    }

    updateAF(e: CustomEvent){
        const update: number | undefined = e.detail;
        if (update !== undefined) {
            if (update < 1) this._amortizationFactor = 1;
            else this._amortizationFactor = update;
            this._collectionRate = this._interestLiteral/this._amortizationFactor;
            this.dispatchEvent(new CustomEvent("cast-amortization", {
                bubbles: true,
                detail: this._amortizationFactor
            }))
        }
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'user-inputs' : UserInputs
    }
}