import { observer } from "mobx-react-lite"
import { RefObject } from "react";

interface IProps {
  driver: {
    id: string;
    name: string;
    icon: JSX.Element;
    ref: RefObject<HTMLDivElement>;
  }
}
export const DraggableElement = observer((props: IProps) => {
  return (
    <div id={props.driver.id} ref={props.driver.ref} className="flex items-center flex-col gap-2 cursor-pointer h-fit touch-none select-none p-6">
      <div className="flex items-center justify-center w-16 h-16 border-yellow-950 border-2 bg-black">
        {props.driver.icon}
      </div>
      <span className="touch-none select-none">{props.driver.name}</span>
    </div>
  )
})