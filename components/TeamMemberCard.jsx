import ImagePlaceholder from '@/components/ImagePlaceholder'
import ImageKitImage from '@/components/ImageKitImage'
import { isImageUrl } from '@/lib/image-url'

// Portrait card for a TeamMember row: photo, name, role. `image` is only used when it is an
// absolute http(s) URL (rendered through ImageKit when it lives on our endpoint); anything else
// falls back to the placeholder.
export default function TeamMemberCard({ member }) {
  return (
    <div>
      <div className="relative aspect-[4/5]">
        {isImageUrl(member.image) ? (
          <ImageKitImage
            src={member.image}
            sizes="(min-width: 768px) 25vw, 50vw"
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <ImagePlaceholder label="Portrait placeholder" className="absolute inset-0" />
        )}
      </div>
      <h3 className="mt-4 [overflow-wrap:anywhere] font-serif text-xl leading-tight">{member.name}</h3>
      <p className="mt-1 [overflow-wrap:anywhere] text-sm text-atmos-muted">{member.role}</p>
    </div>
  )
}
