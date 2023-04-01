import { makeObservable, observable, IObservableArray, action, computed, toJS, flow } from "mobx";
import { Action, ActionType, isButtonAction } from "./models/Action";
import { LOCAL_ACTIONS } from "../shared/constant";
import { MessageType, TheMessageStore } from "./TheMessageStore";
import Router from "next/router";



export class ActionStore {
  constructor(private theMessageStore: TheMessageStore) {
    makeObservable(this);
  }

  @observable public inEditAction: Action | null = null;
  @observable private actions: IObservableArray<Action> = observable([]);
  @observable private prevUndoActions: IObservableArray<Action> = observable([]);

  @computed get isUndoActive(): boolean {
    return this.visibleActions.length > 0;
  }

  @computed get isRedoActive(): boolean {
    const lastUndoAction = this.prevUndoActions[this.prevUndoActions.length - 1];
    return !!lastUndoAction;
  }

  @computed get isExportActive(): boolean {
    return this.actions.length >= 0;
  }

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

    this.inEditAction = null
  }

  @action.bound redoAction() {
    const lastUndoAction = this.prevUndoActions[this.prevUndoActions.length - 1];

    if (!lastUndoAction) return;

    this.prevUndoActions.remove(lastUndoAction);

    this.actions.push({
      ...lastUndoAction,
      actionType: ActionType.ADD,
    })

    this.inEditAction = null
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

  @action.bound requestWriteActions = flow(function* (this: ActionStore) {
    const response: Response
      = yield fetch("/api/write-action", {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ data: { actions: toJS(this.actions) } })
      });

    return response;
  })

  @action.bound exportAction = flow(function* (this: ActionStore) {
    try {
      yield this.requestWriteActions();

      window.open("/actions.json", "blank");
    } catch (error) {
      this.theMessageStore.showMessage({
        msg: "Something wrong in our end, pelase try again!",
        type: MessageType.ERROR
      });
      console.log(error)
    }
  });

  @action.bound viewActions = flow(function* (this: ActionStore) {
    yield this.requestWriteActions();

    window.open("/consumer", "_blank");
  });

  @action.bound importAction = flow(function* (this: ActionStore, ref: React.RefObject<HTMLInputElement>) {
    if (!ref.current?.files || ref.current?.files?.length === 0) {
      return
    };

    const reader = new FileReader();
    reader.addEventListener("load", async (e) => {
      if (!e.target?.result) {
        return this.theMessageStore.showMessage({
          msg: "Can't read file",
          type: MessageType.WARN
        });
      }

      const actions = JSON.parse(e.target.result as string) // read as text;

      if (!Array.isArray(actions)) {
        return this.theMessageStore.showMessage({
          msg: "Expect file content is an array",
          type: MessageType.ERROR
        });
      }

      this.actions.replace(actions);
      this.inEditAction = null;

      this.theMessageStore.showMessage({
        msg: "Import successfully",
        type: MessageType.OK
      });
    });
    reader.readAsText(ref.current.files[0]);
  });

  @action.bound reset = () => {
    this.actions.replace([]);
    this.inEditAction = null;

    localStorage.removeItem(LOCAL_ACTIONS);

    this.theMessageStore.showMessage({
      msg: "Reset done",
      type: MessageType.OK
    });
  }

  @computed.struct get visibleActions(): Action[] {
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