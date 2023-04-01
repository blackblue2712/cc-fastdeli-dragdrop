import { observer } from "mobx-react-lite"
import { ActionStore } from "../../stores/ActionStore"
import { InteractorButton } from "../InteractorButton/InteractorButton"

type IProps = {
  driver: Pick<ActionStore, "addAction" | "redoAction" | "undoAction" | "saveAction" | "exportAction">
}
export const Controller = observer((props: IProps) => {
  const { driver } = props;
  return (
    <div className="flex flex-row items-center justify-center mb-4">
      <InteractorButton name="Save" onClick={driver.saveAction} />
      <InteractorButton name="Import" onClick={() => { }} />
      <InteractorButton name="Export" onClick={driver.exportAction} />
      <InteractorButton name="Undo" onClick={driver.undoAction} />
      <InteractorButton name="Redo" onClick={driver.redoAction} />
      <InteractorButton name="View" onClick={() => { }} />
    </div>
  )
})