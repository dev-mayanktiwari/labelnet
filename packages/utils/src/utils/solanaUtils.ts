import Decimal from "decimal.js";

Decimal.config({
  precision: 50,
  rounding: Decimal.ROUND_DOWN,
  toExpPos: 50,
  toExpNeg: -50,
});

const LAMPORTS_PER_SOL_DECIMAL = new Decimal(1000000000);

export class SolanaAmountUtils {
  /**
   * Convert SOL to lamports string (for database storage)
   * @param sol - SOL amount as string or number
   * @returns lamports as string (ready for database)
   */
  static solToLamportsDBString(sol: number | string | Decimal): string {
    const solDecimal = new Decimal(sol);
    const lamports = solDecimal.mul(LAMPORTS_PER_SOL_DECIMAL);
    return lamports.floor().toString();
  }

  /**
   * Convert lamports string to SOL string (for frontend display)
   * @param lamportsStr - lamports as string from database
   * @param decimals - number of decimal places to show (default: 4)
   * @returns SOL as string (ready for frontend)
   */
  static lamportsToSolStringFrontend(
    lamportsStr: string,
    decimals: number = 4
  ): string {
    const lamports = new Decimal(lamportsStr);
    const sol = lamports.div(LAMPORTS_PER_SOL_DECIMAL);
    return sol.toFixed(decimals).replace(/\.?0+$/, "") || "0";
  }

  /**
   * Add two lamports amounts (for calculations)
   * @param amount1 - first lamports amount as string
   * @param amount2 - second lamports amount as string
   * @returns sum as lamports string
   */
  static addLamports(amount1: string, amount2: string): string {
    const decimal1 = new Decimal(amount1);
    const decimal2 = new Decimal(amount2);
    return decimal1.add(decimal2).toString();
  }

  /**
   * Subtract lamports amounts (for calculations)
   * @param amount1 - first lamports amount as string
   * @param amount2 - second lamports amount as string
   * @returns difference as lamports string
   */
  static subtractLamports(amount1: string, amount2: string): string {
    const decimal1 = new Decimal(amount1);
    const decimal2 = new Decimal(amount2);
    const result = decimal1.sub(decimal2);

    if (result.lt(0)) {
      throw new Error("Result cannot be negative");
    }

    return result.toString();
  }

  /**
   * Compare two lamports amounts
   * @param amount1 - first lamports amount as string
   * @param amount2 - second lamports amount as string
   * @returns -1 if amount1 < amount2, 0 if equal, 1 if amount1 > amount2
   */
  static compareLamports(amount1: string, amount2: string): number {
    const decimal1 = new Decimal(amount1);
    const decimal2 = new Decimal(amount2);

    if (decimal1.lt(decimal2)) return -1;
    if (decimal1.gt(decimal2)) return 1;
    return 0;
  }

  /**
   * Check if amount1 >= amount2 (sufficient balance check)
   * @param amount1 - available balance as lamports string
   * @param amount2 - required amount as lamports string
   * @returns true if sufficient balance
   */
  static hasSufficientBalance(balance: string, required: string): boolean {
    return this.compareLamports(balance, required) >= 0;
  }

  /**
   * Calculate percentage of an amount
   * @param lamportsStr - base amount as lamports string
   * @param percentage - percentage as number (e.g., 5 for 5%)
   * @returns percentage amount as lamports string
   */
  static calculatePercentage(lamportsStr: string, percentage: number): string {
    const amount = new Decimal(lamportsStr);
    const percentDecimal = new Decimal(percentage).div(100);
    return amount.mul(percentDecimal).floor().toString();
  }

  /**
   * Divide lamports amount by a number
   * @param lamportsStr - lamports amount as string
   * @param divisor - number to divide by
   * @returns divided amount as lamports string (floored to whole lamports)
   */
  static divideLamports(lamportsStr: string, divisor: number | string): string {
    const amount = new Decimal(lamportsStr);
    const divisorDecimal = new Decimal(divisor);

    if (divisorDecimal.eq(0)) {
      throw new Error("Cannot divide by zero");
    }

    return amount.div(divisorDecimal).floor().toString();
  }

  /**
   * Multiply lamports amount by a number
   * @param lamportsStr - lamports amount as string
   * @param multiplier - number to multiply by
   * @returns multiplied amount as lamports string (floored to whole lamports)
   */
  static multiplyLamports(
    lamportsStr: string,
    multiplier: number | string
  ): string {
    const amount = new Decimal(lamportsStr);
    const multiplierDecimal = new Decimal(multiplier);
    return amount.mul(multiplierDecimal).floor().toString();
  }
}
