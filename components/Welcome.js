import siteMetadata from '@/data/siteMetadata'
import Icon from '@/components/social-icons'
import Image from "next/image"

export default function Welcome() {
  return (
    <div className="mb-10 items-start space-y-2 xl:grid xl:grid-cols-2 xl:gap-x-2 xl:space-y-0">
      <div className="flex flex-col items-center space-x-2 pt-8">
        <Image
          src={siteMetadata.hero}
          alt="heroImage"
          height={350}
          width={350}
          className=""
        />
      </div>
      <div className="prose dark:prose-dark pt-8 pb-8 xl:col-span-1">
        <h2>Hey, I'm Nick</h2>
        <p>
          I am a Software Developer based in Australia. I like to dabble with different tools and languages in my spare time and am always keen to learn something new.
          Here, I'll be sharing my thoughts and experiences on the latest tech that I've had the opportunity to use.  
          Occasionally, I also write about cooking, DIY and other random things. Thanks for stopping by!
        </p>
      </div>
    </div>
  )
}