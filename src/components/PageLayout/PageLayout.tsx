
import { observer } from "mobx-react-lite";
import { TheFooter } from "../TheFooter/TheFooter";
import { TheHeader } from "../TheHeader/TheHeader";
import styles from "./PageLayout.module.css";

type IProps = {
  children: React.ReactNode;
}

export const PageLayout = observer((props: IProps) => {
  return (
    <section id="page-layout" className={[`h-full min-h-screen antialiased`, styles.section].join(" ")}>
      <TheHeader />
      {props.children}
      <TheFooter />
    </section>
  )
})