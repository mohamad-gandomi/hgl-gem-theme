import React, { useEffect, useRef, useState } from 'react'
import ChevronLeft from 'lucide-react/dist/esm/icons/chevron-left.mjs'
import ChevronRight from 'lucide-react/dist/esm/icons/chevron-right.mjs'
import X from 'lucide-react/dist/esm/icons/x.mjs'
import ShieldCheck from 'lucide-react/dist/esm/icons/shield-check.mjs'
import ScanLine from 'lucide-react/dist/esm/icons/scan-line.mjs'
import FileBadge from 'lucide-react/dist/esm/icons/file-badge.mjs'
import { assetUrl } from '../utils/assets'

const licenseImages = [
  {
    src: '/assets/img/licenses/licence-01.webp',
    alt: 'HGL GEM certificate package with report holder and card'
  },
  {
    src: '/assets/img/licenses/licence-02.webp',
    alt: 'HGL GEM diamond certificate folder and printed report'
  },
  {
    src: '/assets/img/licenses/licence-03.webp',
    alt: 'HGL GEM gemstone identification report and customer card'
  }
]

const featureIcons = [FileBadge, ScanLine, ShieldCheck]

export function LicenseShowcase({ copy }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [lightboxIndex, setLightboxIndex] = useState(null)
  const [autoplayPaused, setAutoplayPaused] = useState(false)
  const touchStartX = useRef(null)

  const pauseAutoplay = () => {
    setAutoplayPaused(true)
  }

  const goToSlide = (index, pause = true) => {
    if (pause) pauseAutoplay()
    setActiveIndex((index + licenseImages.length) % licenseImages.length)
  }

  const showPrevious = () => goToSlide(activeIndex - 1)
  const showNext = () => goToSlide(activeIndex + 1)

  const handleTouchStart = (event) => {
    pauseAutoplay()
    touchStartX.current = event.touches[0]?.clientX ?? null
  }

  const handleTouchEnd = (event) => {
    if (touchStartX.current === null) return

    const endX = event.changedTouches[0]?.clientX ?? touchStartX.current
    const delta = endX - touchStartX.current

    if (Math.abs(delta) > 40) {
      delta > 0 ? showPrevious() : showNext()
    }

    touchStartX.current = null
  }

  useEffect(() => {
    if (autoplayPaused || lightboxIndex !== null) return undefined

    const interval = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % licenseImages.length)
    }, 4500)

    return () => window.clearInterval(interval)
  }, [autoplayPaused, lightboxIndex])

  useEffect(() => {
    if (lightboxIndex === null) return undefined

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setLightboxIndex(null)
      if (event.key === 'ArrowLeft') setLightboxIndex((current) => (current - 1 + licenseImages.length) % licenseImages.length)
      if (event.key === 'ArrowRight') setLightboxIndex((current) => (current + 1) % licenseImages.length)
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [lightboxIndex])

  return (
    <section className="section-pad relative overflow-hidden border-y border-hairline bg-canvasSoft">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:items-center lg:px-8">
        <div className="relative z-10">
          <p className="badge bg-purpleDeep text-white">{copy.licenses.label}</p>
          <h2 className="section-title mt-5 text-4xl font-normal tracking-[-0.02em] text-ink sm:text-5xl">{copy.licenses.title}</h2>
          <p className="mt-5 max-w-xl text-base leading-7 text-body">{copy.licenses.text}</p>
          <div className="mt-8 grid gap-3">
            {copy.licenses.points.map((point, index) => {
              const Icon = featureIcons[index] || ShieldCheck

              return (
                <div key={point} className="flex items-start gap-3 rounded-lg border border-hairline bg-surface p-4">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-purpleDeep/10 text-purpleDeep">
                    <Icon strokeWidth={1.8} className="h-5 w-5" />
                  </span>
                  <p className="text-sm leading-6 text-body">{point}</p>
                </div>
              )
            })}
          </div>
        </div>

        <div className="relative z-10">
          <div className="relative mx-auto max-w-xl">
            <div
              className="feature-card overflow-hidden p-2"
              dir="ltr"
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              onTouchCancel={() => {
                touchStartX.current = null
              }}
            >
              <div className="aspect-square overflow-hidden rounded-lg bg-canvas">
                <div
                  className="flex h-full transition-transform duration-500 ease-out"
                  style={{ transform: `translateX(-${activeIndex * 100}%)` }}
                >
                  {licenseImages.map((image) => (
                    <button
                      key={image.src}
                      type="button"
                      className="h-full w-full shrink-0"
                      onClick={() => {
                        pauseAutoplay()
                        setLightboxIndex(activeIndex)
                      }}
                      aria-label={image.alt}
                    >
                      <img
                        src={assetUrl(image.src)}
                        alt={image.alt}
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={showPrevious}
              className="absolute left-4 top-1/2 hidden h-11 w-11 -translate-y-1/2 place-items-center rounded-lg border border-hairlineStrong bg-surface/95 text-ink hover:border-ink sm:grid"
              aria-label="Previous license image"
            >
              <ChevronLeft strokeWidth={1.8} className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={showNext}
              className="absolute right-4 top-1/2 hidden h-11 w-11 -translate-y-1/2 place-items-center rounded-lg border border-hairlineStrong bg-surface/95 text-ink hover:border-ink sm:grid"
              aria-label="Next license image"
            >
              <ChevronRight strokeWidth={1.8} className="h-5 w-5" />
            </button>
          </div>

          <div className="mt-5 flex justify-center gap-2">
            {licenseImages.map((image, index) => (
              <button
                key={image.src}
                type="button"
                onClick={() => goToSlide(index)}
                className={`h-3 rounded-full transition-all ${activeIndex === index ? 'w-8 bg-purpleDeep' : 'w-3 bg-hairlineStrong'}`}
                aria-label={`Show license image ${index + 1}`}
                aria-current={activeIndex === index}
              />
            ))}
          </div>
        </div>
      </div>

      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-[100] grid place-items-center bg-ink/80 px-4 py-6"
          role="dialog"
          aria-modal="true"
          aria-label="License image preview"
          onClick={() => setLightboxIndex(null)}
        >
          <div className="relative w-full max-w-4xl" onClick={(event) => event.stopPropagation()}>
            <div className="relative mx-auto aspect-square w-full max-w-[82vh] overflow-hidden rounded-xl border border-hairline bg-surface p-2">
              <button
                type="button"
                onClick={() => setLightboxIndex(null)}
                className="absolute right-3 top-3 z-10 grid h-10 w-10 place-items-center rounded-lg border border-purpleDeep/30 bg-surface text-purpleDeep hover:border-purpleDeep"
                aria-label={copy.ui.close}
              >
                <X strokeWidth={1.8} className="h-5 w-5" />
              </button>
              <img
                src={assetUrl(licenseImages[lightboxIndex].src)}
                alt={licenseImages[lightboxIndex].alt}
                className="h-full w-full rounded-lg object-cover"
              />
            </div>

            <button
              type="button"
              onClick={() => setLightboxIndex((lightboxIndex - 1 + licenseImages.length) % licenseImages.length)}
              className="absolute left-4 top-1/2 hidden h-11 w-11 -translate-y-1/2 place-items-center rounded-lg border border-purpleDeep/30 bg-surface text-purpleDeep hover:border-purpleDeep sm:grid"
              aria-label="Previous license image"
            >
              <ChevronLeft strokeWidth={1.8} className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => setLightboxIndex((lightboxIndex + 1) % licenseImages.length)}
              className="absolute right-4 top-1/2 hidden h-11 w-11 -translate-y-1/2 place-items-center rounded-lg border border-purpleDeep/30 bg-surface text-purpleDeep hover:border-purpleDeep sm:grid"
              aria-label="Next license image"
            >
              <ChevronRight strokeWidth={1.8} className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}
    </section>
  )
}
