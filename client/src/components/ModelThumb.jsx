import PhonePairVisual from './PhonePairVisual.jsx'

/**
 * Uses `/public/iphone-models/` assets when `image` is set;
 * Compare uses the dual-placeholder graphic; otherwise gradients.
 */
export default function ModelThumb({ model, paletteIndex }) {
  if (model.isAction && !model.image) {
    return <PhonePairVisual compare />
  }

  if (model.image) {
    return (
      <div className="flex h-[5rem] w-full items-center justify-center px-1">
        <img
          src={model.image}
          alt={model.name}
          className="max-h-[4.75rem] w-auto max-w-full object-contain"
          loading="lazy"
          decoding="async"
        />
      </div>
    )
  }

  return <PhonePairVisual paletteIndex={paletteIndex} />
}
