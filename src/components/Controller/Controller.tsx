import { useRef } from "react";
import { observer } from "mobx-react-lite";
import { ActionStore } from "../../stores/ActionStore";
import { InteractorButton } from "../InteractorButton/InteractorButton";

type IProps = {
  driver: Pick<
    ActionStore,
    | "addAction"
    | "redoAction"
    | "undoAction"
    | "saveAction"
    | "exportAction"
    | "importAction"
    | "isRedoActive"
    | "isUndoActive"
    | "isExportActive"
    | "reset"
    | "viewActions"
  >;
};
export const Controller = observer((props: IProps) => {
  const { driver } = props;

  const ref = useRef<HTMLInputElement>(null);

  return (
    <div className="flex flex-row items-center justify-center mb-4">
      <InteractorButton name="Save" onClick={driver.saveAction} />
      <InteractorButton
        name="Import"
        onClick={() => {
          ref.current?.click();
        }}
      />
      <InteractorButton
        disabled={!driver.isExportActive}
        name="Export"
        onClick={driver.exportAction}
      />
      <InteractorButton
        disabled={!driver.isUndoActive}
        name="Undo"
        onClick={driver.undoAction}
      />
      <InteractorButton
        disabled={!driver.isRedoActive}
        name="Redo"
        onClick={driver.redoAction}
      />
      <InteractorButton
        name="View"
        onClick={driver.viewActions}
      />
      <InteractorButton name="Reset" onClick={driver.reset} />

      <input
        ref={ref}
        accept="application/JSON"
        id="import"
        name="import"
        type="file"
        className="hidden"
        onChange={(e) => {
          driver.importAction(ref);
        }}
      />
    </div>
  );
});
