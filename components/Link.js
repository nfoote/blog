import Link from 'next/link'

const CustomLink = ({ href, children, ...rest }) => {
  if (!href) return children || null

  const isInternalLink = href.startsWith('/')
  const isAnchorLink = href.startsWith('#')

  if (isInternalLink) {
    return (
      <Link href={href} legacyBehavior passHref>
        <a {...rest}>{children}</a>
      </Link>
    )
  }

  if (isAnchorLink) {
    return (
      <a href={href} {...rest}>
        {children}
      </a>
    )
  }

  return (
    <a href={href} target="_blank" rel="noopener noreferrer" {...rest}>
      {children}
    </a>
  )
}

export default CustomLink
