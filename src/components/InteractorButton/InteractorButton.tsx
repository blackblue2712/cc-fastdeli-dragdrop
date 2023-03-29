
export type IProps = {
  name: string;
  onClick(): void;
}
export const InteractorButton = (props: IProps) => {
  return <button className="mr-3 rounded-full items-center justify-center py-1.5 px-6 txet-white bg-cyan-500 hover:bg-cyan-400" value={props.name} onClick={props.onClick}>{props.name}</button>
}