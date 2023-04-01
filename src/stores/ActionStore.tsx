import { makeObservable, observable, IObservableArray, action, computed, toJS } from "mobx";
import { findLast, } from "lodash"
import { Action, ActionType } from "./Action";



export class ActionStore {
  constructor() {
    makeObservable(this);
  }

  @observable private actions: IObservableArray<Action> = observable([]);
  @observable private prevUndoActions: IObservableArray<Action> = observable([]);

  @action.bound addAction(action: Action) {
    this.actions.push(action);

    if (this.prevUndoActions.length) {
      this.prevUndoActions.replace([]);
    }
  }

  @action.bound undoAction() {
    if (this.visibleActions.length === 0) return;

    this.prevUndoActions.push({
      ...this.visibleActions[this.visibleActions.length - 1],
      actionType: ActionType.REMOVE,
    });
    this.actions.push({
      ...this.visibleActions[this.visibleActions.length - 1],
      actionType: ActionType.REMOVE,
    })
  }

  @action.bound redoAction() {
    const lastUndoAction = this.prevUndoActions[this.prevUndoActions.length - 1];

    if (!lastUndoAction) return;

    this.prevUndoActions.remove(lastUndoAction);

    this.actions.push({
      ...lastUndoAction,
      actionType: ActionType.ADD,
    })
  }

  @computed.struct get visibleActions(): Action[] {
    console.log(toJS(this.actions));
    const result: IObservableArray<Action> = observable([]);

    for (const act of this.actions) {
      switch (act.actionType) {
        case ActionType.ADD:
          result.push(act);
          break;
        case ActionType.REMOVE:
          const foundIndex = result.findIndex(item => item.id === act.id);
          result.remove(result[foundIndex]);
          break;
        default:
          throw new Error("Unsupported this action");
      }
    }

    return result;
  }
}