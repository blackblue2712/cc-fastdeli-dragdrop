import { makeObservable, observable, IObservableArray, action, computed, toJS, flow } from "mobx";
import { findLast, } from "lodash"
import { Action, ActionType, InteractorButtonType, isButtonAction } from "./models/Action";
import { LOCAL_ACTIONS } from "../shared/constant";
import { MessageType, TheMessageStore } from "./TheMessageStore";



export class ActionStore {
  constructor(private theMessageStore: TheMessageStore) {
    makeObservable(this);
  }

  @observable public inEditAction: Action | null = null;

  @observable private actions: IObservableArray<Action> = observable([]);
  @observable private prevUndoActions: IObservableArray<Action> = observable([]);

  @action.bound setActions = (actions: Array<Action>) => {
    this.actions.replace(actions);
  }

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

  @action.bound updateEditAction(data: Action | null) {
    this.inEditAction = data;
  }

  @action.bound onEditAction(name: "label" | "action", value: string) {
    if (!this.inEditAction) return;

    if (name === "label") {
      this.inEditAction.props.label = value;

      return;
    }

    if (isButtonAction(this.inEditAction)) {
      this.inEditAction.props.alertMessage = value;
    }
  }

  @action.bound saveAction = flow(function* (this: ActionStore) {
    localStorage.setItem(LOCAL_ACTIONS, JSON.stringify(toJS(this.actions)));

    this.theMessageStore.showMessage({
      msg: "Save successfully",
      type: MessageType.OK
    });
  })

  @action.bound exportAction = flow(function* (this: ActionStore) {
    try {
      const response: Response
        = yield fetch("/api/write-action", {
          method: "POST",
          headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ data: { actions: toJS(this.actions) } })
        });

      window.open("/actions.json", "_blank");
    } catch (error) {
      this.theMessageStore.showMessage({
        msg: "Something wrong in our end, pelase try again!",
        type: MessageType.ERROR
      });
      console.log(error)
    }
  })

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