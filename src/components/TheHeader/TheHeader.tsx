
export const TheHeader = (props: { title: string }) => {
  return (
    <section id="header" className="p-4">
      <div className="text-2xl font-bold underline">{props.title}</div>
    </section>
  )
}