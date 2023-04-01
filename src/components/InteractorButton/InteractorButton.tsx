
export type IProps = {
  name: string;
  onClick(): void;
  disabled?: boolean;
}
export const InteractorButton = (props: IProps) => {
  return <button disabled={props.disabled} className="mr-3 rounded items-center justify-center py-1.5 px-6 txet-white bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50" value={props.name} onClick={props.onClick}>{props.name}</button>
}