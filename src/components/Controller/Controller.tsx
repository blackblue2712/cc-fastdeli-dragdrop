import { observer } from "mobx-react-lite"
import { ActionStore } from "../../stores/ActionStore"
import { InteractorButton } from "../InteractorButton/InteractorButton"

type IProps = {
  driver: Pick<ActionStore, "addAction" | "redoAction" | "undoAction">
}
export const Controller = observer((props: IProps) => {
  return (
    <div className="flex flex-row items-center justify-center mb-4">
      <InteractorButton name="Save" onClick={() => { }} />
      <InteractorButton name="Import" onClick={() => { }} />
      <InteractorButton name="Export" onClick={() => { }} />
      <InteractorButton name="Undo" onClick={props.driver.undoAction} />
      <InteractorButton name="Redo" onClick={props.driver.redoAction} />
      <InteractorButton name="View" onClick={() => { }} />
    </div>
  )
})