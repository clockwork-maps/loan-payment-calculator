import * as d3 from 'd3';

interface graphdata {
    intervals: number[],
    costLog: number[],
    paymentRate: number
}

export function graphPayments(amount: number, rate: number, target: string): void{
    function interest(amount: number, rate: number): number {
        return amount * rate;
    }
    
    function calcRates(amount: number, rate: number): number[]{
        const floor: number = interest(amount, rate) * 1.1;
        const increment: number = interest(amount, rate) * .1;
        const rates: number[] = [];
        for (let i=0; i < 40; i++) if((i+1) % 10 === 0|| i+1 === 1) {
            rates.push(floor + (increment * i));
        }
        return rates;
    } 
    const payments: ReadonlyArray<number> = calcRates(amount, rate);
    const pcalc: graphdata[] = [];
    payments.forEach(payment => {
        let cost: number = amount;
        let totalCost: number = amount;
        const costLog: number[] = [cost];
        let interval: number = 0;
        const intervals: number[] = [interval];
        while (cost > 0) {
            if (cost - payment <= 0) {
                // interval++; 
                pcalc.push({
                    intervals: intervals,
                    costLog: costLog,
                    paymentRate: payment
                });
                cost -= payment;
            }
            interval++;
            cost -= payment;
            let tempInterest: number = interest(cost, rate);
            cost += tempInterest;
            totalCost += tempInterest;
            costLog.push(totalCost);
            intervals.push(interval);
        }
    })
    // console.log('pcalc: ', pcalc);
    console.log(document.getElementById(target));
    const chart: d3.Selection<SVGAElement, unknown, HTMLElement, unknown> = d3.select(target);
    chart.node()!.innerHTML = '';
    const ctbounds: DOMRect = chart.node()!.getBoundingClientRect();
    const ctln: number = ctbounds.width;
    const ctht: number = ctbounds.height;
    const costscale: d3.ScaleLinear<number, number, never> = d3.scaleLinear().domain([0, Math.max(...pcalc[0].costLog)]).range([0, ctht*.8]);
    const intervalscale: d3.ScaleLinear<number, number, never> = d3.scaleLinear().domain([0, Math.max(...pcalc[0].intervals)]).range([0, ctln*.8]);
    const payline = d3.line()
    .x((d: any) => intervalscale(d.intervals)!)
    .y((d: any) => costscale(d.costLog)!);
    const paygraph: d3.Selection<SVGGElement, unknown, HTMLElement, unknown> = chart.append<'g'>('g');
    // paygraph.selectAll('path')
    // .data(pcalc.values())
    // .join('path')
    // .attr('d', payline)
    // .attr('d', function(d){
    //     return d3.line().x(d=>intervalscale(d.intervals)).y(d=>costscale(d.costLog))
    // })
}