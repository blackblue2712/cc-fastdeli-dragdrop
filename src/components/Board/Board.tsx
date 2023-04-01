"use client";
import { useEffect } from "react";
import { observer } from "mobx-react-lite"
import styles from "./Board.module.css";

interface IProps {
  renderLeft(): JSX.Element;
  renderRight(): JSX.Element;
}
export const Board = observer((props: IProps) => {
  return (
    <div className={styles.container}>
      <div className="board-left border-t-2 border-r-2 border-red-500 p-2 flex items-center flex-col">
        {props.renderLeft()}
      </div>
      <div className="board-right border-t-2 border-red-500 p-2">
        {props.renderRight()}
      </div>
    </div>
  )
})