import { LitElement, html, unsafeCSS } from 'lit'
import { customElement, state, property } from 'lit/decorators.js'
// import { fromEvent, scan } from 'rxjs'
import style from './components.css?inline'

/**
 * Input element for the initial investment that interest will be calculated for.
 * Number will be taken as a string then parsed to a float rounded to 2 decimals.
 */

@customElement('numeric-input')
export class NumericInput extends LitElement {
    @property({type: String}) placeholder: string = 'Awaiting input';

    @property({type: String}) legend: string = 'Initial Amount';

    @state() display: string = '...';

    @state() displayClass: string = 'displayMessage';

    @state() private _numericAmount: number = 0;

    render(){
        return html`
            <fieldset class="inputComponent">
                <legend class="iCLegend">${this.legend}</legend>
                <input @input=${this.parseNumeric} class="userInput" type="text" placeholder=${this.placeholder} />
                <p class=${this.displayClass}>${this.display}</p>
            </fieldset>
        `
    }

    static styles = unsafeCSS(style);

    parseNumeric(e: any){
        const uiValue: string | undefined = e.target.value;
        if (!isNaN(+uiValue!) && uiValue !== '') {
            this.display = '✓';
            this.displayClass = 'displayMessage displayTrue';
            this._numericAmount = Math.abs(Number(uiValue));
            this.dispatchEvent(new CustomEvent("numeric-update", {
                bubbles: true,
                detail: this._numericAmount
            }))
        } else {

            this.display = 'NaN';
            this.displayClass = 'displayMessage displayFalse';
        }
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'numeric-input' : NumericInput
    }
}