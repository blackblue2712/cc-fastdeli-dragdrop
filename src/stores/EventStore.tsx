import { v4 } from "uuid";
import { makeObservable, observable, IObservableArray, action, computed } from "mobx";
import { ActionStore } from "./ActionStore";
import { Action, ActionType, InteractorButtonType, InteractorItem } from "./Action";
import { useRef } from "react";

export type DraggingState = {
  active: boolean;
  currentX: number;
  currentY: number;
  initialX: number;
  initialY: number;
  xOffset: number;
  yOffset: number;
  ref: React.RefObject<HTMLDivElement> | null;
}



export class EventStore {
  constructor(private actionStore: ActionStore) {
    makeObservable(this);
  }

  public readonly DRAGGABLE_ELEMENTS: Array<InteractorItem> = [
    {
      id: "draggable-button",
      type: InteractorButtonType.BUTTON,
      name: "button",
      icon: <></>,
      ref: useRef<HTMLDivElement>(null),
    },
    {
      id: "draggable-paragraph",
      type: InteractorButtonType.PARAGRAPH,
      name: "paragraph",
      icon: <></>,
      ref: useRef<HTMLDivElement>(null),
    }
  ];

  @observable draggingState: DraggingState = {
    active: false,
    currentX: 0,
    currentY: 0,
    initialX: 0,
    initialY: 0,
    xOffset: 0,
    yOffset: 0,
    ref: null
  }

  @action.bound mouseDownListener = (e: MouseEvent, data: InteractorItem) => {
    const { ref } = data;
    if (this.draggingState.active) return;

    this.draggingState = {
      ...this.draggingState,
      active: true,
      initialX: e.clientX - this.draggingState.xOffset,
      initialY: e.clientY - this.draggingState.yOffset,
      ref: data.ref
    }
  }

  @action.bound mouseUpListener = (e: MouseEvent, data: InteractorItem, boxContainerRef: React.RefObject<HTMLDivElement>) => {
    const { ref, type } = data;

    this.draggingState = {
      ...this.draggingState,
      active: false,
      initialX: e.clientX - this.draggingState.currentX,
      initialY: e.clientY - this.draggingState.currentY
    }

    const { left, top } = boxContainerRef.current!.getBoundingClientRect();
    const isAbleToAdd = e.clientX >= left && e.clientY >= top;

    if (isAbleToAdd) {
      const data = this.buildActionData(type);

      this.actionStore.addAction(data);
    }

    ref.current!.style.transition = ".3s";
    ref.current!.firstElementChild?.classList.remove("border-green-500")
    ref.current!.firstElementChild?.classList.add("border-yellow-950")
    ref.current!.style.transform = `translate(${0}px, ${0}px)`;

    this.draggingState = {
      active: false,
      currentX: 0,
      currentY: 0,
      initialX: 0,
      initialY: 0,
      xOffset: 0,
      yOffset: 0,
      ref: null
    };

    setTimeout(() => ref.current!.style.transition = "0s")
  }

  @action.bound mouseMoveListener = (e: MouseEvent, data: InteractorItem, boxContainerRef: React.RefObject<HTMLDivElement>) => {
    const { ref } = data;
    if (!this.draggingState.active) return;
    if (ref.current?.id !== this.draggingState.ref?.current?.id) return;

    this.draggingState = {
      ...this.draggingState,

      currentX: e.clientX - this.draggingState.initialX,
      xOffset: e.clientX - this.draggingState.initialX,
      currentY: e.clientY - this.draggingState.initialY,
      yOffset: e.clientY - this.draggingState.initialY
    }


    const { left, top } = boxContainerRef.current!.getBoundingClientRect();

    const isAbleToAdd = e.clientX >= left && e.clientY >= top;

    if (isAbleToAdd) {
      ref.current!.firstElementChild?.classList.add("border-green-500")
      ref.current!.firstElementChild?.classList.remove("border-yellow-950")
    } else {
      ref.current!.firstElementChild?.classList.remove("border-green-500")
      ref.current!.firstElementChild?.classList.add("border-yellow-950")
    }


    ref.current!.style.transform = `translate(${this.draggingState.currentX}px, ${this.draggingState.currentY}px)`
  }

  @action.bound buildActionData = (type: InteractorButtonType): Action => {
    return type === InteractorButtonType.BUTTON
      ? {
        id: v4(),
        actionType: ActionType.ADD,
        name: "",
        type: InteractorButtonType.BUTTON,
        props: {
          label: "Button",
          action: () => { },
        },
      }
      : {
        id: v4(),
        actionType: ActionType.ADD,
        name: "",
        type: InteractorButtonType.PARAGRAPH,
        props: {
          label:
            "Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum, qui!",
        },
      }
  }

  @action.bound registerEvents = (boxContainerRef: React.RefObject<HTMLDivElement>) => {
    if (!boxContainerRef.current) {
      throw new Error("Illegal ref state!");
    }

    this.DRAGGABLE_ELEMENTS.forEach((el) => {
      if (!el.ref.current) throw new Error("Illegal ref state!");

      el.ref.current.addEventListener("mousedown", (e) => this.mouseDownListener(e, el));
      document.addEventListener("mousemove", (e) => this.mouseMoveListener(e, el, boxContainerRef));
      el.ref.current.addEventListener("mouseup", (e) => this.mouseUpListener(e, el, boxContainerRef));
    });
  }

  @action.bound cleanupEvents = (boxContainerRef: React.RefObject<HTMLDivElement>) => {
    this.DRAGGABLE_ELEMENTS.forEach((el) => {
      if (!el.ref.current) throw new Error("Illegal ref state!");

      el.ref.current.removeEventListener("mousedown", (e) => this.mouseDownListener(e, el));
      document.removeEventListener("mousemove", (e) => this.mouseMoveListener(e, el, boxContainerRef));
      el.ref.current.removeEventListener("mouseup", (e) => this.mouseUpListener(e, el, boxContainerRef));
    });
  }
}