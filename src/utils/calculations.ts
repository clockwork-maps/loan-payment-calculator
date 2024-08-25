export interface pcalcReturn {
  payment: number;
  totalCost: number;
  intervals: number;
}

export function getPaycalc(
  amount: number,
  rate: number,
  preInterest?: boolean,
): pcalcReturn[] {
  function interest(amount: number, rate: number): number {
    return amount * rate;
  }

  function calcRates(amount: number, rate: number): number[] {
    const floor: number = interest(amount, rate) * 1.1;
    const increment: number = interest(amount, rate) * 0.1;
    const rates: number[] = [];
    for (let i = 0; i < 40; i++) {
      rates.push(floor + increment * i);
    }
    return rates;
  }

  function paycalc(
    amount: number,
    rate: number,
    payments: number[],
  ): pcalcReturn[] {
    const pcalc: pcalcReturn[] = [];
    payments.forEach((payment) => {
      let cost: number = amount;
      let totalCost: number = amount;
      let intervals: number = 0;
      while (cost > 0) {
        if (cost - payment <= 0) {
          intervals++;
          pcalc.push({
            payment: payment,
            totalCost: totalCost,
            intervals: intervals,
          });
          cost -= payment;
        }
        intervals++;
        if (preInterest) {
          let tempInterest: number = interest(cost, rate);
          cost += tempInterest;
          totalCost += tempInterest;
        }
        cost -= payment;
        if (!preInterest) {
          let tempInterest: number = interest(cost, rate);
          cost += tempInterest;
          totalCost += tempInterest;
        }
      }
    });
    return pcalc;
  }

  const payments: number[] = calcRates(amount, rate);
  const pcalcReturn: pcalcReturn[] = paycalc(amount, rate, payments);
  return pcalcReturn;
}
