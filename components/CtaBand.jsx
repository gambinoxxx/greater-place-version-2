// Closing call-to-action band for inner pages. `actions` holds the buttons.
export default function CtaBand({ title, children, actions }) {
  return (
    <section data-theme="dark" className="border-t border-atmos-line py-20 md:py-28">
      <div className="mx-auto w-full max-w-[1280px] px-5 md:px-8 lg:px-12">
        <h2 className="max-w-3xl font-serif text-4xl md:text-6xl">{title}</h2>
        {children && <p className="mt-6 max-w-xl text-lg leading-relaxed text-atmos-muted">{children}</p>}
        <div className="mt-10 flex flex-wrap gap-4">{actions}</div>
      </div>
    </section>
  )
}
