import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import {
  Subject,
  takeUntil,
} from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Actions, ofType } from '@ngrx/effects';

import { stockHttpError } from './slice/stocks.actions';
import { StocksService } from './stocks.service';

@Component({
  selector: 'page-stocks',
  templateUrl: './stocks.component.html',
  styleUrls: ['./stocks.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [StocksService]
})
export class StocksComponent implements OnInit, OnDestroy {
  private readonly destroyEvent = new Subject<void>();

  readonly isLoading = this.stocks.getIsLoading();

  constructor(
    private readonly stocks: StocksService,
    private readonly snackBar: MatSnackBar,
    private readonly actions: Actions
  ) { }

  ngOnInit() {
    this.initErrorMessage();
  }

  ngOnDestroy() {
    this.destroyEvent.next();
  }

  private initErrorMessage() {
    this.actions.pipe(
      ofType(stockHttpError),
      takeUntil(this.destroyEvent),
    ).subscribe(({error}) => {
      console.error(error);
      this.snackBar.open(error.error, 'Close',{
        verticalPosition: 'top',
      });
    });
  }

  public async updateData() {
    this.stocks.updateData();
  }
}
