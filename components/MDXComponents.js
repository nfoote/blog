/* eslint-disable react/display-name */
import { useMemo } from 'react'
import { getMDXComponent } from 'mdx-bundler/client'
import Image from './Image'
import CustomLink from './Link'
import TOCInline from './TOCInline'
import Pre from './Pre'
import { BlogNewsletterForm } from './NewsletterForm'

// Statically import known layouts
import PostLayout from '../layouts/PostLayout'
import PostSimple from '../layouts/PostSimple'
import AuthorLayout from '../layouts/AuthorLayout'
import ListLayout from '../layouts/ListLayout'

// Map layout names to components
const LayoutMap = {
  PostLayout,
  PostSimple,
  AuthorLayout,
  ListLayout,
}

export const MDXComponents = {
  Image,
  TOCInline,
  a: CustomLink,
  pre: Pre,
  BlogNewsletterForm: BlogNewsletterForm,
  wrapper: ({ components, layout, ...rest }) => {
    const Layout = LayoutMap[layout] || ((props) => <div {...props} />)
    return <Layout {...rest} />
  },
}

export const MDXLayoutRenderer = ({ layout, mdxSource, ...rest }) => {
  const MDXLayout = useMemo(() => getMDXComponent(mdxSource), [mdxSource])

  return <MDXLayout components={MDXComponents} layout={layout} {...rest} />
}
