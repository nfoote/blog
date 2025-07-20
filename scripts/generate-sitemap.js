const fs = require('fs')
const globby = require('globby')
const matter = require('gray-matter')
const prettier = require('prettier')
const siteMetadata = require('../data/siteMetadata')

;(async () => {
  const prettierConfig = (await prettier.resolveConfig('./.prettierrc.js')) || {}

  const pages = await globby([
    'pages/*.js',
    'pages/*.tsx',
    'data/blog/**/*.mdx',
    'data/blog/**/*.md',
    'public/tags/**/*.xml',
    '!pages/_*.js',
    '!pages/_*.tsx',
    '!pages/api',
  ])

  const sitemapContent = `
    <?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${pages
    .map((page) => {
      if (page.includes('.md') && fs.existsSync(page)) {
        const source = fs.readFileSync(page, 'utf8')
        const fm = matter(source)
        if (fm.data.draft || fm.data.canonicalUrl) return ''
      }

      const path = page
        .replace('pages/', '/')
        .replace('data/blog', '/blog')
        .replace('public/', '/')
        .replace(/(\.js|\.tsx|\.mdx|\.md)$/, '')
        .replace('/feed.xml', '')

      if (page.includes('pages/404.') || page.includes('pages/blog/[...slug].')) return ''

      return `
            <url>
              <loc>${siteMetadata.siteUrl}${path === '/index' ? '' : path}</loc>
            </url>`
    })
    .join('')}
    </urlset>
  `

  const formatted = await prettier.format(sitemapContent, {
    ...prettierConfig,
    parser: 'html',
  })

  fs.writeFileSync('public/sitemap.xml', formatted)
})()
