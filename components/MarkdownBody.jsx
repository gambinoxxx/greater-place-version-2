import Link from 'next/link'
import ReactMarkdown, { defaultUrlTransform } from 'react-markdown'
import ImageKitImage from '@/components/ImageKitImage'
import { isImageUrl } from '@/lib/image-url'

// Renders Post.body (Markdown) to React elements. Nothing here ever produces an HTML string, and
// dangerouslySetInnerHTML is not used:
//  - skipHtml drops any raw HTML in the Markdown (script, iframe, on* handlers, style, ...);
//  - defaultUrlTransform only lets http, https, irc(s), mailto, and xmpp URLs through (javascript:,
//    data:, vbscript: and obfuscated variants become empty), and relative/hash URLs are kept;
//  - images must be absolute http(s) URLs; everything else is not rendered;
//  - external links open in a new tab with rel="noopener noreferrer".
// Post body headings start at h2 because the page title is the h1.
const components = {
  h1: ({ children }) => <h2 className="mt-12 font-serif text-3xl leading-tight md:text-4xl">{children}</h2>,
  h2: ({ children }) => <h2 className="mt-12 font-serif text-3xl leading-tight md:text-4xl">{children}</h2>,
  h3: ({ children }) => <h3 className="mt-10 font-serif text-2xl leading-tight">{children}</h3>,
  h4: ({ children }) => <h4 className="mt-8 font-serif text-xl leading-tight">{children}</h4>,
  p: ({ children }) => <p className="mt-6 text-lg leading-relaxed">{children}</p>,
  ul: ({ children }) => <ul className="mt-6 list-disc space-y-2 pl-6 text-lg leading-relaxed">{children}</ul>,
  ol: ({ children }) => <ol className="mt-6 list-decimal space-y-2 pl-6 text-lg leading-relaxed">{children}</ol>,
  li: ({ children }) => <li>{children}</li>,
  blockquote: ({ children }) => (
    <blockquote className="mt-8 border-l-2 border-current pl-6 font-serif text-2xl leading-snug">{children}</blockquote>
  ),
  hr: () => <hr className="my-12 border-atmos-line" />,
  pre: ({ children }) => (
    <pre className="mt-6 overflow-x-auto border border-atmos-line bg-atmos-tint p-4 text-sm leading-relaxed [&_code]:bg-transparent [&_code]:p-0">{children}</pre>
  ),
  code: ({ children }) => <code className="bg-atmos-tint px-1 py-0.5 text-[0.9em]">{children}</code>,
  a: ({ href, children }) => {
    if (!href) return <>{children}</>
    if (href.startsWith('/') || href.startsWith('#')) {
      return (
        <Link href={href} className="underline underline-offset-4">
          {children}
        </Link>
      )
    }
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">
        {children}
      </a>
    )
  },
  // Body images are arbitrary absolute URLs: ones on our ImageKit endpoint are resized, others render as-is.
  img: ({ src, alt }) =>
    isImageUrl(src) ? (
      <ImageKitImage
        src={src}
        alt={alt ?? ''}
        sizes="(min-width: 672px) 672px, 100vw"
        className="mt-8 h-auto w-full border border-atmos-line"
      />
    ) : null,
}

export default function MarkdownBody({ children }) {
  return (
    <ReactMarkdown skipHtml urlTransform={defaultUrlTransform} components={components}>
      {children}
    </ReactMarkdown>
  )
}
