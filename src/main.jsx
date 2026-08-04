import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'

const navItems = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Services', href: '/services' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact', href: '/contact' }
]

const services = [
  {
    title: 'Expert gemstone assessment',
    text: 'Specialized evaluation of gemstones, valid identification certificates, and buying or selling guidance based on expert analysis.',
    pill: 'Assessment'
  },
  {
    title: 'Legal and judicial services',
    text: 'Official court expert assessment for gemstones, gold, and jewellery, including formal reports for judicial and administrative authorities.',
    pill: 'Legal'
  },
  {
    title: 'Gemology training and courses',
    text: 'Introductory and advanced gemology courses covering coloured stones, diamonds, and pearls, held with Technical and Vocational Training Organization authorization.',
    pill: 'Training'
  },
  {
    title: 'Specialized consultation',
    text: 'Professional consultation for investing in the gemstone market and making more confident decisions around authenticity, value, and quality.',
    pill: 'Consulting'
  }
]

const members = [
  {
    name: 'Marziyeh Khajeh Yazdi',
    role: 'M.Sc. Geology and Gemology',
    text: 'Head of the expert assessment team with more than 20 years of experience in gemstone and jewellery evaluation, certification, and education.',
    phone: '09153588482'
  },
  {
    name: 'Dalaram Pirouz Mehr',
    role: 'Gemologist and Jewellery Designer',
    text: 'Active in gemology and jewellery design, with more than 5 years of professional experience in the gemstone field.',
    phone: '09303588021'
  },
  {
    name: 'Mahsa Hassanzadeh',
    role: 'Legal Affairs Expert',
    text: 'Member of the legal consultation and expert assessment team, responsible for customer relations and client communication.',
    phone: '09303588021'
  }
]

const posts = [
  {
    slug: 'speed-first-launch',
    title: 'How to launch a faster marketing site',
    date: 'Aug 4, 2026',
    excerpt: 'A practical checklist for keeping a new website light, focused, and easy to extend.'
  },
  {
    slug: 'editorial-web-layouts',
    title: 'Why editorial spacing makes service pages easier to read',
    date: 'Jul 28, 2026',
    excerpt: 'Hairlines, quiet sections, and restrained CTAs can make a business site feel sharper.'
  },
  {
    slug: 'placeholder-first-assets',
    title: 'Designing with placeholders before final images arrive',
    date: 'Jul 15, 2026',
    excerpt: 'A simple method for keeping layouts stable while product and team photos are still pending.'
  }
]

const contactInfo = {
  address: 'Mashhad, Imam Khomeini Street, Darayi three-way, Sabt Alley, Marmar International Gold and Jewellery Tower, 7th floor, Unit 9',
  hours: 'Except Thursdays, 9:30 AM to 2:00 PM, and 4:00 PM to 6:00 PM by appointment',
  phones: [
    { label: '051-38114416', href: 'tel:+985138114416' },
    { label: '09153588482', href: 'tel:+989153588482' },
    { label: '09303588021', href: 'tel:+989303588021' }
  ]
}

function Icon({ name, className = 'h-5 w-5' }) {
  const paths = {
    arrow: <path d="M5 12h14m-6-6 6 6-6 6" />,
    check: <path d="m5 13 4 4L19 7" />,
    menu: <path d="M4 6h16M4 12h16M4 18h16" />,
    close: <path d="m6 6 12 12M18 6 6 18" />,
    search: <path d="m21 21-4.3-4.3M10.8 18a7.2 7.2 0 1 1 0-14.4 7.2 7.2 0 0 1 0 14.4Z" />,
    spark: <path d="M12 3l1.9 5.2L19 10l-5.1 1.8L12 17l-1.9-5.2L5 10l5.1-1.8L12 3Z" />,
    mail: <path d="M4 6h16v12H4zM4 7l8 6 8-6" />,
    pin: <path d="M12 21s7-5.1 7-11a7 7 0 0 0-14 0c0 5.9 7 11 7 11Z" />,
    phone: <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.6a2 2 0 0 1-.5 2.1L8 9.6a16 16 0 0 0 6.4 6.4l1.2-1.2a2 2 0 0 1 2.1-.5c.8.3 1.7.5 2.6.6a2 2 0 0 1 1.7 2Z" />,
    clock: <path d="M12 8v5l3 2M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
  }

  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {paths[name]}
    </svg>
  )
}

function useRoute() {
  const getPath = useCallback(() => window.location.pathname || '/', [])
  const [path, setPath] = useState(getPath)

  useEffect(() => {
    const onPop = () => setPath(getPath())
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [getPath])

  const navigate = useCallback((href) => {
    if (href === window.location.pathname) return
    window.history.pushState({}, '', href)
    setPath(href)
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [])

  return { path, navigate }
}

function App() {
  const { path, navigate } = useRoute()
  const [verifyOpen, setVerifyOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const currentPost = useMemo(() => posts.find((post) => path === `/blog/${post.slug}`), [path])

  let page = <HomePage navigate={navigate} />
  if (path === '/about') page = <AboutPage />
  if (path === '/contact') page = <ContactPage />
  if (path === '/services') page = <ServicesPage />
  if (path === '/blog') page = <BlogPage navigate={navigate} />
  if (currentPost) page = <SingleBlogPage post={currentPost} navigate={navigate} />

  return (
    <>
      <Header path={path} navigate={navigate} onVerify={() => setVerifyOpen(true)} onSearch={() => setSearchOpen(true)} />
      <main>{page}</main>
      <Footer navigate={navigate} />
      <VerifyModal open={verifyOpen} onClose={() => setVerifyOpen(false)} />
      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  )
}

function LinkButton({ href, navigate, children, className = '', icon = false }) {
  return (
    <button
      type="button"
      onClick={() => navigate(href)}
      className={`inline-flex h-11 items-center justify-center gap-2 rounded-lg px-5 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${className}`}
    >
      {children}
      {icon && <Icon name="arrow" className="h-4 w-4" />}
    </button>
  )
}

function Header({ path, navigate, onVerify, onSearch }) {
  const [open, setOpen] = useState(false)

  const go = (href) => {
    navigate(href)
    setOpen(false)
  }

  return (
    <header className="sticky top-0 z-50 border-b border-hairline bg-canvas/95 backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <button type="button" onClick={() => go('/')} className="flex items-center gap-2 text-left text-ink">
          <span className="grid h-10 w-10 place-items-center rounded-lg bg-ink p-1.5">
            <img src="/assets/img/hgl-logo.webp" alt="HGL GEM logo" className="h-full w-full object-contain" />
          </span>
          <span className="text-base font-semibold">HGL GEM</span>
        </button>
        <div className="hidden items-center gap-7 md:flex">
          {navItems.map((item) => (
            <button
              key={item.href}
              type="button"
              onClick={() => go(item.href)}
              className={`text-sm font-medium transition-colors hover:text-ink ${path === item.href ? 'text-ink' : 'text-body'}`}
            >
              {item.label}
            </button>
          ))}
        </div>
        <div className="hidden items-center gap-3 md:flex">
          <button
            type="button"
            onClick={onSearch}
            className="grid h-10 w-10 place-items-center rounded-lg border border-hairlineStrong bg-surface text-ink transition-colors hover:border-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            aria-label="Search"
          >
            <Icon name="search" className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={onVerify}
            className="inline-flex h-11 items-center justify-center rounded-lg bg-primary px-5 text-sm font-medium text-ink transition-colors hover:bg-primaryActive focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            Verify Certificates
          </button>
        </div>
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="grid h-10 w-10 place-items-center rounded-lg border border-hairline bg-surface md:hidden"
          aria-label="Toggle menu"
        >
          <Icon name={open ? 'close' : 'menu'} />
        </button>
      </nav>
      {open && (
        <div className="border-t border-hairline bg-canvas px-4 py-4 md:hidden">
          <div className="mx-auto grid max-w-7xl gap-2">
            {navItems.map((item) => (
              <button key={item.href} type="button" onClick={() => go(item.href)} className="rounded-lg px-3 py-3 text-left text-sm font-medium text-ink hover:bg-surface">
                {item.label}
              </button>
            ))}
            <div className="mt-2 flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setOpen(false)
                  onSearch()
                }}
                className="grid h-11 w-11 place-items-center rounded-lg border border-hairlineStrong bg-surface text-ink"
                aria-label="Search"
              >
                <Icon name="search" className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => {
                  setOpen(false)
                  onVerify()
                }}
                className="inline-flex h-11 flex-1 items-center justify-center rounded-lg bg-primary px-5 text-sm font-medium text-ink"
              >
                Verify Certificates
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

function VerifyModal({ open, onClose }) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-[100] grid place-items-center bg-ink/45 px-4 py-6" role="dialog" aria-modal="true" aria-labelledby="verify-title">
      <div className="w-full max-w-md rounded-xl border border-hairline bg-surface p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="badge">Certificate check</p>
            <h2 id="verify-title" className="mt-4 text-2xl font-normal tracking-[-0.01em] text-ink">Verify Certificates</h2>
            <p className="mt-2 text-sm leading-6 text-body">Enter the licence code printed on the gemstone certificate.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-hairlineStrong bg-canvas text-ink hover:border-ink"
            aria-label="Close modal"
          >
            <Icon name="close" className="h-4 w-4" />
          </button>
        </div>
        <label className="mt-6 block">
          <span className="text-sm font-medium text-ink">Licence code</span>
          <input
            className="mt-2 h-11 w-full rounded-lg border border-hairline bg-canvasSoft px-4 text-sm text-ink outline-none focus:border-primary"
            placeholder="Example: HGL-000000"
          />
        </label>
        <button type="button" className="mt-5 inline-flex h-11 w-full items-center justify-center rounded-lg bg-primary px-5 text-sm font-medium text-ink hover:bg-primaryActive">
          Verify Certificates
        </button>
      </div>
    </div>
  )
}

function SearchModal({ open, onClose }) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-[100] grid place-items-center bg-ink/45 px-4 py-6" role="dialog" aria-modal="true" aria-labelledby="search-title">
      <div className="w-full max-w-lg rounded-xl border border-hairline bg-surface p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="badge">Search</p>
            <h2 id="search-title" className="mt-4 text-2xl font-normal tracking-[-0.01em] text-ink">Search HGL GEM</h2>
            <p className="mt-2 text-sm leading-6 text-body">Search certificates, services, news, and gemstone information.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-hairlineStrong bg-canvas text-ink hover:border-ink"
            aria-label="Close modal"
          >
            <Icon name="close" className="h-4 w-4" />
          </button>
        </div>
        <label className="mt-6 block">
          <span className="text-sm font-medium text-ink">Search term</span>
          <div className="mt-2 flex items-center gap-3 rounded-lg border border-hairline bg-canvasSoft px-4 focus-within:border-primary">
            <Icon name="search" className="h-4 w-4 text-muted" />
            <input
              className="h-11 min-w-0 flex-1 bg-transparent text-sm text-ink outline-none"
              placeholder="Type what you want to find"
            />
          </div>
        </label>
        <button type="button" className="mt-5 inline-flex h-11 w-full items-center justify-center rounded-lg bg-primary px-5 text-sm font-medium text-ink hover:bg-primaryActive">
          Search
        </button>
      </div>
    </div>
  )
}

function Hero({ navigate }) {
  return (
    <section className="hero-section border-b border-hairline">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="grid gap-10 lg:grid-cols-[1.02fr_.98fr] lg:items-end">
          <div>
            <p className="badge">Gemstone certification</p>
            <h1 className="mt-6 max-w-3xl text-3xl font-normal leading-[1.12] tracking-[-0.01em] text-ink sm:text-4xl lg:text-5xl">
              Issuance of Authenticity Certificates
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-body">
              Issuing authenticity certificates for precious gemstones, which can be verified and tracked through this website. Our expert team uses advanced equipment to assess each stone's authenticity and quality, ensuring confidence in buying and selling these valuable gems.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <LinkButton href="/about" navigate={navigate} className="bg-ink text-canvas hover:bg-primary" icon>About HGL GEM</LinkButton>
              <LinkButton href="/contact" navigate={navigate} className="border border-hairlineStrong bg-surface text-ink hover:border-ink">Contact us</LinkButton>
            </div>
          </div>
          <HeroImage />
        </div>
      </div>
    </section>
  )
}

function HeroImage() {
  return (
    <figure className="rounded-xl border border-hairline bg-surface p-3">
      <div className="overflow-hidden rounded-lg border border-hairline bg-canvasSoft">
        <img
          src="/assets/img/hero-image.webp"
          alt="Polished turquoise gemstone"
          className="h-full min-h-[340px] w-full object-cover"
          decoding="async"
          fetchPriority="high"
        />
      </div>
    </figure>
  )
}

function Placeholder({ label = 'Image placeholder' }) {
  return (
    <div className="grid aspect-[4/3] place-items-center rounded-lg border border-dashed border-hairlineStrong bg-canvasSoft p-4 text-center text-xs font-medium uppercase tracking-[0.08em] text-muted">
      {label}
    </div>
  )
}

function AboutImage({ className = '' }) {
  return (
    <figure className={`overflow-hidden rounded-xl border border-hairline bg-surface p-3 ${className}`}>
      <img
        src="/assets/img/about-us.webp"
        alt="Green gemstones under gemological inspection"
        className="h-full min-h-[320px] w-full rounded-lg object-cover"
        loading="lazy"
        decoding="async"
      />
    </figure>
  )
}

function SectionIntro({ label, title, text }) {
  return (
    <div className="mx-auto mb-10 max-w-3xl text-center">
      <p className="badge mx-auto">{label}</p>
      <h2 className="mt-5 text-4xl font-normal tracking-[-0.02em] text-ink sm:text-5xl">{title}</h2>
      {text && <p className="mt-4 text-base leading-7 text-body">{text}</p>}
    </div>
  )
}

function HomePage({ navigate }) {
  return (
    <>
      <Hero navigate={navigate} />
      <WhyUs />
      <AboutPreview navigate={navigate} />
      <Members />
      <Cta navigate={navigate} />
      <ServicesPreview navigate={navigate} />
      <LatestNews navigate={navigate} />
    </>
  )
}

function WhyUs() {
  const points = [
    {
      title: 'Over 20 years of experience',
      text: 'Our research and specialist work in the field of gemstones began in 1999.'
    },
    {
      title: 'Official court-certified expert',
      text: 'Member of the Association of Official Court Experts in gold, jewellery, and gemstones.'
    },
    {
      title: 'Authenticity certificates',
      text: 'Our specialist team assesses gemstone authenticity and quality before issuing certificates.'
    },
    {
      title: 'International-standard training',
      text: 'Introductory and advanced gemology courses covering coloured gemstones, diamonds, and pearls.'
    }
  ]

  return (
    <section className="section-pad">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionIntro label="Why us" title="Trusted gemstone expertise, documented clearly." text="HGL GEM combines long-running gemology research, certified expert assessment, and certificate services that support confident buying, selling, and learning." />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {points.map((point) => (
            <article key={point.title} className="feature-card">
              <Icon name="check" className="h-5 w-5 text-primary" />
              <h3 className="mt-6 text-lg font-semibold text-ink">{point.title}</h3>
              <p className="mt-3 text-sm leading-6 text-body">{point.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function AboutPreview({ navigate }) {
  return (
    <section className="section-pad border-y border-hairline bg-canvasSoft">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-2 lg:items-center lg:px-8">
        <div>
          <p className="badge">About us</p>
          <h2 className="mt-5 text-4xl font-normal tracking-[-0.02em] text-ink sm:text-5xl">Two decades of gemstone research, certification, and training.</h2>
          <p className="mt-5 text-base leading-7 text-body">Our work began in 1999 as a university research project at Ferdowsi University of Mashhad. Today, HGL GEM combines official expert assessment, advanced gemological equipment, and practical education for buyers, sellers, and students of precious stones.</p>
          <LinkButton href="/about" navigate={navigate} className="mt-8 border border-hairlineStrong bg-surface text-ink hover:border-ink" icon>Read about us</LinkButton>
        </div>
        <AboutImage />
      </div>
    </section>
  )
}

function Members() {
  return (
    <section className="section-pad">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionIntro label="Members" title="The expert team behind HGL GEM." />
        <div className="grid gap-4 md:grid-cols-3">
          {members.map((member) => (
            <article key={member.name} className="feature-card">
              <div className="grid h-12 w-12 place-items-center rounded-lg border border-hairline bg-canvasSoft text-base font-semibold text-ink">
                {member.name
                  .split(' ')
                  .map((part) => part[0])
                  .slice(0, 2)
                  .join('')}
              </div>
              <h3 className="mt-5 text-lg font-semibold text-ink">{member.name}</h3>
              <p className="mt-1 text-sm font-medium text-body">{member.role}</p>
              <p className="mt-3 text-sm leading-6 text-body">{member.text}</p>
              <p className="mt-4 text-sm font-semibold text-ink">Phone: {member.phone}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function Cta({ navigate }) {
  return (
    <section className="section-pad border-y border-hairline bg-canvasSoft">
      <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <p className="badge mx-auto">Call to action</p>
        <h2 className="mt-5 text-4xl font-normal tracking-[-0.02em] text-ink sm:text-5xl">Need to verify a gemstone or request expert guidance?</h2>
        <p className="mt-5 text-base leading-7 text-body">Contact HGL GEM for authenticity certificates, official expert assessment, legal reports, training information, or consultation before buying and selling precious stones.</p>
        <LinkButton href="/contact" navigate={navigate} className="mt-8 bg-primary text-ink hover:bg-primaryActive" icon>Contact HGL GEM</LinkButton>
      </div>
    </section>
  )
}

function ServicesPreview({ navigate }) {
  return (
    <section className="section-pad">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionIntro label="Services" title="Gemstone services for confident decisions." />
        <ServiceGrid />
        <div className="mt-8 text-center">
          <LinkButton href="/services" navigate={navigate} className="border border-hairlineStrong bg-surface text-ink hover:border-ink" icon>All services</LinkButton>
        </div>
      </div>
    </section>
  )
}

function ServiceGrid() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {services.map((service) => (
        <article key={service.title} className="feature-card">
          <span className="badge">{service.pill}</span>
          <h3 className="mt-6 text-2xl font-normal tracking-[-0.01em] text-ink">{service.title}</h3>
          <p className="mt-3 text-sm leading-6 text-body">{service.text}</p>
        </article>
      ))}
    </div>
  )
}

function LatestNews({ navigate }) {
  return (
    <section className="section-pad border-t border-hairline bg-canvasSoft">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionIntro label="Last news" title="Recent notes from the studio." />
        <PostGrid posts={posts.slice(0, 3)} navigate={navigate} />
      </div>
    </section>
  )
}

function AboutPage() {
  return (
    <PageShell label="About us" title="Dedicated to the authenticity, quality, and knowledge of precious gemstones." text="HGL GEM supports confident decisions in gemstone buying, selling, certification, and education through long-term research and expert assessment.">
      <div className="grid gap-8 lg:grid-cols-[.9fr_1.1fr] lg:items-start">
        <AboutImage className="lg:sticky lg:top-24" />
        <div className="space-y-4 text-base leading-7 text-body">
          <p>Our research in gemstones began in 1999, when this path started as a student project at Ferdowsi University of Mashhad. A deep interest in the beauty and hidden value of natural gems shaped our professional direction.</p>
          <p>With more than 20 years of experience in gemstone assessment and education, we are committed to quality, authenticity, and honest guidance. HGL GEM is also a member of the Association of Official Court Experts in gold, jewellery, and gemstones.</p>
          <p>One of our key services is issuing authenticity certificates for precious gemstones. These certificates can be tracked and verified through this website. Our specialist team uses advanced equipment to assess each stone's authenticity and quality, helping build confidence in every transaction.</p>
          <p>Since 2005, our experience in gemology education has grown into professional training through Gohar Azmay Omid Technical and Vocational Institute. Courses cover general gemology, coloured gemstones, diamonds, and pearls, with recognized certificates awarded after successful completion.</p>
          <div className="grid gap-4 sm:grid-cols-2">
            {['Research since 1999', 'Official expert credibility', 'Certificate verification', 'Gemology education'].map((item) => (
              <div key={item} className="rounded-xl border border-hairline bg-surface p-5">
                <p className="text-sm font-semibold text-ink">{item}</p>
                <p className="mt-2 text-sm leading-6 text-body">Built on practical experience, specialist tools, and a commitment to transparent service.</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageShell>
  )
}

function ContactPage() {
  return (
    <PageShell label="Contact us" title="Request gemstone certification or expert guidance." text="Contact HGL GEM for certificate issuance, official expert assessment, legal reports, gemology training, or consultation before buying and selling precious stones.">
      <div className="grid gap-8 lg:grid-cols-[.75fr_1.25fr]">
        <aside className="rounded-xl border border-hairline bg-surface p-6">
          <h2 className="text-2xl font-normal tracking-[-0.01em] text-ink">Contact information</h2>
          <div className="mt-6 grid gap-5 text-sm leading-6 text-body">
            <div className="flex gap-3">
              <Icon name="pin" className="mt-1 h-5 w-5 shrink-0 text-primary" />
              <span>{contactInfo.address}</span>
            </div>
            <div className="flex gap-3">
              <Icon name="clock" className="mt-1 h-5 w-5 shrink-0 text-primary" />
              <span>{contactInfo.hours}</span>
            </div>
            <div className="flex gap-3">
              <Icon name="phone" className="mt-1 h-5 w-5 shrink-0 text-primary" />
              <div className="grid gap-2">
                {contactInfo.phones.map((phone) => (
                  <a key={phone.href} href={phone.href} className="font-medium text-ink hover:text-primary">
                    {phone.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </aside>
        <form className="rounded-xl border border-hairline bg-surface p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Name" placeholder="Your name" />
            <Field label="Email" placeholder="you@example.com" />
          </div>
          <Field label="Request type" placeholder="Certificate, legal report, training, consultation..." />
          <label className="mt-4 block">
            <span className="text-sm font-medium text-ink">Message</span>
            <textarea className="mt-2 min-h-36 w-full rounded-lg border border-hairline bg-canvasSoft px-4 py-3 text-sm text-ink outline-none focus:border-primary" placeholder="Tell us about the gemstone, certificate code, course, or assessment you need." />
          </label>
          <button type="button" className="mt-5 inline-flex h-11 items-center rounded-lg bg-primary px-5 text-sm font-medium text-ink hover:bg-primaryActive">Send request</button>
        </form>
      </div>
    </PageShell>
  )
}

function Field({ label, placeholder }) {
  return (
    <label className="mt-4 block first:mt-0">
      <span className="text-sm font-medium text-ink">{label}</span>
      <input className="mt-2 h-11 w-full rounded-lg border border-hairline bg-canvasSoft px-4 text-sm text-ink outline-none focus:border-primary" placeholder={placeholder} />
    </label>
  )
}

function ServicesPage() {
  return (
    <PageShell label="Services" title="Expert assessment, legal reporting, training, and consultation." text="HGL GEM provides practical gemstone services for buyers, sellers, students, and legal or administrative cases where authenticity and value must be documented clearly.">
      <ServiceGrid />
    </PageShell>
  )
}

function BlogPage({ navigate }) {
  return (
    <PageShell label="Blog" title="Notes, updates, and practical launch thinking." text="Use this page as your index for news, case notes, and helpful articles.">
      <PostGrid posts={posts} navigate={navigate} />
    </PageShell>
  )
}

function SingleBlogPage({ post, navigate }) {
  return (
    <PageShell label={post.date} title={post.title} text={post.excerpt}>
      <article className="mx-auto max-w-3xl rounded-xl border border-hairline bg-surface p-6 sm:p-8">
        <Placeholder label="Blog cover placeholder" />
        <div className="prose-copy mt-8">
          <p>This is a clean single blog template. Replace this placeholder article with the final post content, add your cover image, and keep the structure light.</p>
          <h2>Keep the page useful</h2>
          <p>Short sections, readable line length, and clear links make blog pages easier to scan. The current layout avoids unnecessary dependencies and keeps all media local.</p>
          <h2>Make assets optional</h2>
          <p>The design works before images arrive because every media slot has a stable aspect ratio. When you add real images later, the layout will not jump.</p>
        </div>
        <LinkButton href="/blog" navigate={navigate} className="mt-8 border border-hairlineStrong bg-canvas text-ink hover:border-ink">Back to blog</LinkButton>
      </article>
    </PageShell>
  )
}

function PostGrid({ posts: items, navigate }) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {items.map((post) => (
        <article key={post.slug} className="feature-card">
          <Placeholder label="Post cover" />
          <p className="mt-5 text-xs font-semibold uppercase tracking-[0.08em] text-muted">{post.date}</p>
          <h3 className="mt-3 text-xl font-normal tracking-[-0.01em] text-ink">{post.title}</h3>
          <p className="mt-3 text-sm leading-6 text-body">{post.excerpt}</p>
          <button type="button" onClick={() => navigate(`/blog/${post.slug}`)} className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-ink hover:text-primary">
            Read article <Icon name="arrow" className="h-4 w-4" />
          </button>
        </article>
      ))}
    </div>
  )
}

function PageShell({ label, title, text, children }) {
  return (
    <>
      <section className="border-b border-hairline">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <p className="badge">{label}</p>
          <h1 className="mt-6 max-w-4xl text-5xl font-normal leading-tight tracking-[-0.03em] text-ink sm:text-6xl">{title}</h1>
          {text && <p className="mt-5 max-w-2xl text-lg leading-8 text-body">{text}</p>}
        </div>
      </section>
      <section className="section-pad">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">{children}</div>
      </section>
    </>
  )
}

function Footer({ navigate }) {
  return (
    <footer className="border-t border-hairline bg-canvas">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-2 lg:grid-cols-[1.1fr_1.7fr_repeat(2,1fr)] lg:px-8">
        <div>
          <div className="flex items-center gap-2 text-ink">
            <span className="grid h-10 w-10 place-items-center rounded-lg bg-ink p-1.5">
              <img src="/assets/img/hgl-logo.webp" alt="HGL GEM logo" className="h-full w-full object-contain" />
            </span>
            <span className="font-semibold">HGL GEM</span>
          </div>
          <p className="mt-4 max-w-xs text-sm leading-6 text-body">Gemstone authenticity certificates, expert assessment, legal reporting, training, and consultation for confident decisions.</p>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-ink">Contact information</h3>
          <div className="mt-4 grid gap-3 text-sm leading-6 text-body">
            <p>{contactInfo.address}</p>
            <p>Response hours: {contactInfo.hours.charAt(0).toLowerCase() + contactInfo.hours.slice(1)}</p>
            <p className="flex flex-wrap gap-x-2 gap-y-1">
              <span>Phone:</span>
              {contactInfo.phones.map((phone, index) => (
                <React.Fragment key={phone.href}>
                  {index > 0 && <span>|</span>}
                  <a href={phone.href} className="font-medium text-ink hover:text-primary">
                    {phone.label}
                  </a>
                </React.Fragment>
              ))}
            </p>
          </div>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-ink">Last blog posts</h3>
          <div className="mt-4 grid gap-3">
            {posts.slice(0, 3).map((post) => (
              <button key={`footer-${post.slug}`} type="button" onClick={() => navigate(`/blog/${post.slug}`)} className="text-left text-sm leading-6 text-body hover:text-ink">
                {post.title}
              </button>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-ink">Services</h3>
          <div className="mt-4 grid gap-3">
            {services.map((service) => (
              <button key={`footer-${service.title}`} type="button" onClick={() => navigate('/services')} className="text-left text-sm text-body hover:text-ink">
                {service.title}
              </button>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

createRoot(document.getElementById('root')).render(<App />)
