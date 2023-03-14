type Currency = "EUR" | "USD";

export class Stock {
    public currency: Currency = "USD";
    public symbol: string = "";
    public displaySymbol: string = "";
    public type: string = "";
    public description: string = "";
    public price: Price = new Price();
}

export class Price {
    public c: number = 0;
}