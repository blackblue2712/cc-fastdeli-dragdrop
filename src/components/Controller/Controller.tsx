import { InteractorButton } from "../InteractorButton/InteractorButton"

export const Controller = () => {
  return (
    <div className="flex flex-row items-center justify-center">
      <InteractorButton name="Save" onClick={() => { }} />
      <InteractorButton name="Import" onClick={() => { }} />
      <InteractorButton name="Export" onClick={() => { }} />
      <InteractorButton name="Undo" onClick={() => { }} />
      <InteractorButton name="Redo" onClick={() => { }} />
      <InteractorButton name="Save" onClick={() => { }} />
    </div>
  )
}