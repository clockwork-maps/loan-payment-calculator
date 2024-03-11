import { LitElement, html, unsafeCSS, css, PropertyValues } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { getPaycalc, pcalcReturn } from './calculations';
import { graphPayments } from './graphing';
import style from './components.css?inline'

@customElement('calc-results')
export class CalcResults extends LitElement {
    @property({type: Number, hasChanged(newVal: number, oldVal: number){ return newVal !== oldVal}}) initialAmount?: number = 0;
    @property({type: Number, hasChanged(newVal: number, oldVal: number){ return newVal !== oldVal}}) interestLiteral?: number = 0;
    @property({type: Number, hasChanged(newVal: number, oldVal: number){ return newVal !== oldVal}}) amortizationFactor?: number = 1;
    @state() private _collectionRate: number = this.interestLiteral!/this.amortizationFactor!;
    @state() private _payCalc: pcalcReturn[] | string[] = Array.from({length: 40}, (v, i) => '. . .');

    render(){
        return html`
            <section class="pageDisplay">
                <header class="loanInfo">
                    <h4 class="loanDetails">Initial Amount: <span class="lnumeric">${new Intl.NumberFormat("en-US", {style: "decimal", minimumFractionDigits: 2, maximumFractionDigits: 2}).format(this.initialAmount!)}</span></h4>
                    <h4 class="loanDetails">Interest: <span class="lnumeric">${new Intl.NumberFormat("en-US", {style: "percent", minimumFractionDigits: 2, maximumFractionDigits: 2}).format(this.interestLiteral!)}</span></h4>
                    <h4 class="loanDetails">Amortized Interest: <span class="lnumeric">${new Intl.NumberFormat("en-US", {style: "percent", minimumFractionDigits: 2, maximumFractionDigits: 2}).format(this._collectionRate)}</span></h4>
                </header>
                <article class="payTables">
                    <table class="payTable">
                        <thead>
                            <tr>
                                <th>Payment</th>
                                <th>Intervals</th>
                                <th>Total Cost</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${this._payCalc.map((entry, i)=>{
                                if(typeof entry === 'string'){
                                    if(i<20){
                                        return html`
                                            <tr>
                                                <td>${entry}</td>
                                                <td>${entry}</td>
                                                <td>${entry}</td>
                                            </tr>
                                        `
                                    }
                                } else {
                                    if(i<20){
                                        return html`
                                            <tr>
                                                <td>${new Intl.NumberFormat("en-US", {style: "decimal", minimumFractionDigits: 2, maximumFractionDigits: 2}).format(entry.payment)}</td>
                                                <td>${new Intl.NumberFormat().format(entry.intervals)}</td>
                                                <td>${new Intl.NumberFormat("en-US", {style: "decimal", minimumFractionDigits: 2, maximumFractionDigits: 2}).format(entry.totalCost)}</td>
                                            </tr>
                                        `
                                    }
                                }
                            })}
                        </tbody>
                    </table>
                    <table class="payTable">
                        <thead>
                            <tr>
                                <th>Payment</th>
                                <th>Intervals</th>
                                <th>Total Cost</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${this._payCalc.map((entry, i)=>{
                                if(typeof entry === 'string'){
                                    if(i>19){                                    
                                        return html`
                                            <tr>
                                                <td>${entry}</td>
                                                <td>${entry}</td>
                                                <td>${entry}</td>
                                            </tr>
                                        `
                                    }
                                } else {
                                    if(i>19){
                                        return html`
                                            <tr>
                                            <td>${new Intl.NumberFormat("en-US", {style: "decimal", minimumFractionDigits: 2, maximumFractionDigits: 2}).format(entry.payment)}</td>
                                            <td>${new Intl.NumberFormat().format(entry.intervals)}</td>
                                            <td>${new Intl.NumberFormat("en-US", {style: "decimal", minimumFractionDigits: 2, maximumFractionDigits: 2}).format(entry.totalCost)}</td>
                                            </tr>
                                        `
                                    }
                                }
                            })}
                        </tbody>
                    </table>
                </article>
                <article class="graphicalDisplay">
                        <svg id="chart"></svg>
                </article>
            </section>
        `
    }

    static styles = [unsafeCSS(style), css`
        :host{
            position: relative;
            display: block;
            height: 11in;
            width: 8.5in;
        }
    `]

    updated(changed: PropertyValues<this>): void{
        const changedPrimaryAll: boolean = changed.has('interestLiteral') || changed.has('amortizationFactor') || changed.has('initialAmount'); 
        const changedPrimaryInterest: boolean = changed.has('interestLiteral') || changed.has('amortizationFactor');
        const nonZeroes: boolean = this.initialAmount !== 0 && this.interestLiteral !== 0; 
        if(changedPrimaryAll && nonZeroes){
            this._collectionRate = this.interestLiteral!/this.amortizationFactor!;
            this._payCalc = getPaycalc(this.initialAmount!, this._collectionRate);
            graphPayments(this.initialAmount!, this._collectionRate, "#chart")
        }
        else if(changedPrimaryInterest){
            this._collectionRate = this.interestLiteral!/this.amortizationFactor!;
        }
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'calc-results' : CalcResults
    }
}