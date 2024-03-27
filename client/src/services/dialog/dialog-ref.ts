import { Subject } from "rxjs";

/**
 * Represents a reference to a dialog.
 */
export class DialogRef {
  private _afterClosed$ = new Subject<any>();

  /**
   * Observable that emits the result when the dialog is closed.
   */
  get afterClosed$() {
    return this._afterClosed$.asObservable();
  }

  /**
   * Initializes the dialog reference.
   */
  constructor() {}

  /**
   * Closes the dialog and emits the result.
   * @param result The result to be emitted when the dialog is closed.
   */
  close(result?: any): void {
    this._afterClosed$.next(result);
    this._afterClosed$.complete();
  }
}
