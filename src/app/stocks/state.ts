import { EntityState } from "@ngrx/entity";
import { Stock } from "./stock";

export interface AppState {
    stocks: EntityState<StockEntry>,
    selectedStock: Stock
}

export interface StockEntry {
    id: string;
    stock: Stock
}