import siteMetadata from '@/data/siteMetadata'
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
        />
      </div>
      <div className="prose dark:prose-dark pt-8 pb-8 xl:col-span-1">
        <h2>Hey, I'm Nick</h2>
        <p>
          I’m a <strong>Software Engineer based in Australia</strong> 🇦🇺 with a passion for <strong>building great software</strong>: crafting intuitive UIs, designing clean backend services, working on distributed systems, and experimenting with new tools and tech.
        </p>
        <p>
          I enjoy sharing insights from projects I’ve worked on, lessons learned along the way, and the occasional deep dive into topics like <strong>game development</strong>, <strong>trading bots</strong>, or <strong>dev workflows</strong>.
        </p>
        <p>
          Outside of coding, you’ll probably find me chasing a new recipe, firing up the pizza oven, or getting stuck into a DIY project.
          <br />
          <strong>Thanks for stopping by — feel free to check out my latest projects or drop me a line!</strong>
        </p>


      </div>
    </div>
  )
}
