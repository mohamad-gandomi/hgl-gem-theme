import React, { useEffect, useMemo, useState } from 'react'
import { content, contactInfo } from './data/siteContent'
import { useRoute } from './hooks/useRoute'
import { Footer } from './layout/Footer'
import { Header } from './layout/Header'
import { SearchModal } from './components/modals/SearchModal'
import { VerifyModal } from './components/modals/VerifyModal'
import { AboutPage } from './pages/AboutPage'
import { BlogPage } from './pages/BlogPage'
import { ContactPage } from './pages/ContactPage'
import { HomePage } from './pages/HomePage'
import { NotFoundPage } from './pages/NotFoundPage'
import { SearchPage } from './pages/SearchPage'
import { ServicesPage } from './pages/ServicesPage'
import { SingleBlogPage } from './pages/SingleBlogPage'
import { normalizePath } from './utils/routing'

export function App() {
  const { path, navigate } = useRoute()
  const { locale, routePath } = normalizePath(path)
  const copy = content[locale]
  const contacts = contactInfo[locale]
  const [verifyOpen, setVerifyOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const currentPost = useMemo(() => copy.posts.find((post) => routePath === `/blog/${post.slug}`), [copy.posts, routePath])

  useEffect(() => {
    document.documentElement.lang = locale === 'fa' ? 'fa' : 'en'
    document.documentElement.dir = locale === 'fa' ? 'rtl' : 'ltr'
  }, [locale])

  let page = <NotFoundPage copy={copy} locale={locale} navigate={navigate} />
  if (routePath === '/') page = <HomePage copy={copy} locale={locale} navigate={navigate} />
  if (routePath === '/about') page = <AboutPage copy={copy} />
  if (routePath === '/contact') page = <ContactPage copy={copy} contacts={contacts} />
  if (routePath === '/services') page = <ServicesPage copy={copy} />
  if (routePath === '/blog') page = <BlogPage copy={copy} locale={locale} navigate={navigate} />
  if (routePath === '/search') page = <SearchPage copy={copy} locale={locale} navigate={navigate} />
  if (currentPost) page = <SingleBlogPage copy={copy} locale={locale} post={currentPost} navigate={navigate} />

  return (
    <>
      <Header copy={copy} locale={locale} routePath={routePath} navigate={navigate} onVerify={() => setVerifyOpen(true)} onSearch={() => setSearchOpen(true)} />
      <main>{page}</main>
      <Footer copy={copy} contacts={contacts} locale={locale} navigate={navigate} />
      <VerifyModal copy={copy} open={verifyOpen} onClose={() => setVerifyOpen(false)} />
      <SearchModal copy={copy} locale={locale} navigate={navigate} open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  )
}
