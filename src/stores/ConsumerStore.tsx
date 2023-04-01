
import { IObservableArray, makeObservable, observable } from "mobx";
import { Action } from "./models/Action";

export class ConsumerStore {

  constructor() {
    makeObservable(this);
  }

  @observable public actions: IObservableArray<Action> = observable([]);
}