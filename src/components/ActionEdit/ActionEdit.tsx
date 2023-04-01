import { observer } from "mobx-react-lite";
import { isButtonAction } from "../../stores/models/Action";
import { ActionStore } from "../../stores/ActionStore";

type IProps = {
  driver: Pick<ActionStore, "onEditAction" | "inEditAction">;
}

export const ActionEdit = observer((props: IProps) => {
  const { driver } = props;
  const { inEditAction } = driver;

  if (!inEditAction) return <></>;


  const isBtnAction = isButtonAction(inEditAction);

  return (
    <div className="pt-2">
      <form onSubmit={(e) => e.preventDefault()}>
        <div className="form-group pb-2">
          <label className="block font-bold">{isBtnAction ? "Button name" : "Paragraph content"}:</label>
          <input type="text" className="form-input px-3 py-2 rounded text-black w-4/5"
            name="label"
            value={inEditAction.props.label}
            onChange={(e) => driver.onEditAction("label", e.target.value)}
          />
        </div>

        {
          isBtnAction && (
            <div className="form-group">
              <label className="block font-bold">Button alert message: </label>
              <input type="text" className="form-input px-3 py-2 rounded text-black  w-4/5"
                name="action"
                value={inEditAction.props.alertMessage}
                onChange={(e) => driver.onEditAction("action", e.target.value)}
              />
            </div>
          )
        }

      </form>
    </div>
  )
})