"use client";
import { useEffect } from "react";
import { observer } from "mobx-react-lite"
import styles from "./Board.module.css";
import { ActionStore } from "../../stores/ActionStore";

interface IProps {
  driver: Pick<ActionStore, "inEditAction">
  renderLeft(): JSX.Element;
  renderRight(): JSX.Element;
  renderEditAction(): JSX.Element;
}
export const Board = observer((props: IProps) => {
  return (
    <div className={styles.container}>
      <div className="board-left border-t-2 border-r-2 border-red-500 p-2 flex items-center flex-col">
        {props.renderLeft()}
      </div>
      <div className="board-right border-t-2 border-red-500 p-2">
        <div className="flex flex-col">
          <div>
            {props.renderRight()}
          </div>
          {
            props.driver.inEditAction && (
              <div className="border-t-2 border-red-500">
                {props.renderEditAction()}
              </div>
            )
          }
        </div>
      </div>
    </div>
  )
})