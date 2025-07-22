import { bundleMDX } from 'mdx-bundler'
import fs from 'fs'
import matter from 'gray-matter'
import path from 'path'
import readingTime from 'reading-time'
import getAllFilesRecursively from './utils/files'

import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import remarkExtractFrontmatter from './remark-extract-frontmatter'
import remarkTocHeadings from './remark-toc-headings'
import remarkImgToJsx from './remark-img-to-jsx'

import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypeKatex from 'rehype-katex'
import rehypeCitation from 'rehype-citation'
import rehypePrettyCode from 'rehype-pretty-code'
import rehypePresetMinify from 'rehype-preset-minify'

const root = process.cwd()

export function getFiles(type) {
  const prefixPaths = path.join(root, 'data', type)
  const files = getAllFilesRecursively(prefixPaths)
  return files.map((file) => file.slice(prefixPaths.length + 1).replace(/\\/g, '/'))
}

export function formatSlug(slug) {
  return slug.replace(/\.(mdx|md)/, '')
}

export function dateSortDesc(a, b) {
  return a > b ? -1 : a < b ? 1 : 0
}

export async function getFileBySlug(type, slug) {
  const mdxPath = path.join(root, 'data', type, `${slug}.mdx`)
  const mdPath = path.join(root, 'data', type, `${slug}.md`)
  const filePath = fs.existsSync(mdxPath) ? mdxPath : mdPath

  if (!fs.existsSync(filePath)) {
    throw new Error(`❌ File not found: ${filePath}`)
  }

  const source = fs.readFileSync(filePath, 'utf8')

  process.env.ESBUILD_BINARY_PATH =
    process.platform === 'win32'
      ? path.join(root, 'node_modules', 'esbuild', 'esbuild.exe')
      : path.join(root, 'node_modules', 'esbuild', 'bin', 'esbuild')

  let toc = []

  const { code, frontmatter } = await bundleMDX({
    source,
    mdxOptions(options) {
      options.remarkPlugins = [
        ...(options.remarkPlugins ?? []),
        remarkExtractFrontmatter,
        [remarkTocHeadings, { exportRef: toc }],
        remarkGfm,
        remarkMath,
        remarkImgToJsx,
      ]

      options.rehypePlugins = [
        ...(options.rehypePlugins ?? []),
        rehypeSlug,
        rehypeAutolinkHeadings,
        rehypeKatex,
        [rehypeCitation, { path: path.join(root, 'data') }],
        [
          rehypePrettyCode,
          {
            theme: 'github-dark',
            keepBackground: true,
            onVisitLine(node) {
              if (!node.children || node.children.length === 0) {
                node.children = [{ type: 'text', value: ' ' }]
              }
            },
            onVisitHighlightedLine(node) {
              node.properties.className = (node.properties.className || []).concat('highlighted')
            },
            onVisitHighlightedWord(node) {
              node.properties.className = ['word']
            },
          },
        ],
        rehypePresetMinify,
      ]

      return options
    },
    esbuildOptions(options) {
      options.loader = {
        ...options.loader,
        '.js': 'jsx',
      }
      return options
    },
  })

  return {
    mdxSource: code,
    toc,
    frontMatter: {
      readingTime: readingTime(code),
      slug: slug || null,
      fileName: fs.existsSync(mdxPath) ? `${slug}.mdx` : `${slug}.md`,
      ...frontmatter,
      date: frontmatter.date ? new Date(frontmatter.date).toISOString() : null,
    },
  }
}

export async function getAllFilesFrontMatter(folder) {
  const prefixPaths = path.join(root, 'data', folder)
  const files = getAllFilesRecursively(prefixPaths)

  const allFrontMatter = []

  files.forEach((file) => {
    const fileName = file.slice(prefixPaths.length + 1).replace(/\\/g, '/')
    if (!['.md', '.mdx'].includes(path.extname(fileName))) return
    const source = fs.readFileSync(file, 'utf8')
    const { data: frontmatter } = matter(source)
    if (!frontmatter.draft) {
      allFrontMatter.push({
        ...frontmatter,
        slug: formatSlug(fileName),
        date: frontmatter.date ? new Date(frontmatter.date).toISOString() : null,
      })
    }
  })

  return allFrontMatter.sort((a, b) => dateSortDesc(a.date, b.date))
}
