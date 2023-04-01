export enum ActionType {
  ADD = "ADD",
  REMOVE = "REMOVE",
  EDIT = "EDIT",
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

export type ButtonAction = BaseAction & {
  type: InteractorButtonType.BUTTON;
  props: {
    label: string;
    alertMessage: string;
  };
};

export type ParagraphAction = BaseAction & {
  type: InteractorButtonType.PARAGRAPH;
  props: {
    label: string;
  };
};

export type EditAction = BaseAction & {
  actionType: ActionType.EDIT;
  type: InteractorButtonType;
  data: ButtonAction | ParagraphAction;
};

export type Action = ButtonAction | ParagraphAction;

export function isButtonAction(item: Action): item is ButtonAction {
  return item.type === InteractorButtonType.BUTTON;
}

export type InteractorItem = {
  id: string;
  name: string;
  type: InteractorButtonType;
  icon: JSX.Element;
  ref: React.RefObject<HTMLDivElement>;
};
