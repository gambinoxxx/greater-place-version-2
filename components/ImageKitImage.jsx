import { getImageAttributes } from '@/lib/image-url'

// Renders a stored image URL. URLs under our ImageKit endpoint get a responsive srcSet with resize
// and auto-format transformations; any other absolute URL is rendered as-is. Callers decide whether
// there is an image at all (isImageUrl) and show a placeholder otherwise.
//
// `sizes` should describe how wide the image is laid out (e.g. "(min-width: 1024px) 33vw, 100vw"):
// it is what lets the browser choose the smallest sufficient candidate. Server Component only,
// because the ImageKit endpoint is a server-side environment variable.
export default function ImageKitImage({ src, alt = '', sizes, className, loading = 'lazy' }) {
  const attributes = getImageAttributes(src, { sizes })

  return (
    // The srcSet is built by the ImageKit SDK; next/image would add a second optimisation hop.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={attributes.src}
      srcSet={attributes.srcSet}
      sizes={attributes.sizes}
      alt={alt}
      loading={loading}
      decoding="async"
      className={className}
    />
  )
}
