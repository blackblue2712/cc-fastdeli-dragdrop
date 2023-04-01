import { v4 } from "uuid";

export enum ActionType {
  ADD = "ADD",
  REMOVE = "REMOVE",
}

export enum InteractorButtonType {
  BUTTON = "BUTTON",
  PARAGRAPH = "PARAGRAPH",
}

export type BaseAction = {
  id: string;
  name: string;
  actionType: ActionType;
};

export type AddButtonAction = BaseAction & {
  type: InteractorButtonType.BUTTON;
  props: {
    label: string;
    action(): void;
  };
};

export type AddParagraphAction = BaseAction & {
  type: InteractorButtonType.PARAGRAPH;
  props: {
    label: string;
  };
};

export type Action = AddButtonAction | AddParagraphAction;

export type InteractorItem = {
  id: string;
  name: string;
  type: InteractorButtonType;
  icon: JSX.Element;
  ref: React.RefObject<HTMLDivElement>;
};
