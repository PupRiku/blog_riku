import type { Metadata } from 'next';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'About',
  description: 'About Riku',
};

// Standalone page, not a post: it isn't read from /posts, so it never shows up in the index.
export default function AboutPage() {
  return (
    <article>
      <header className="post-header">
        <h1>About</h1>
      </header>
      <div className="prose about-body">
        <div className="about-portrait">
          <Image
            src="/images/about-portrait.jpg"
            alt="Portrait of Riku."
            fill
            sizes="12rem"
            priority
          />
        </div>
        <p>
          Welcome to my madness! I go by Riku, but my real name is Chris (I'll
          answer to either). I currently reside in Madison, WI, but get to
          Chicago so often folks tend to think I live/moved there. In my normal,
          everyday life, I work in Higher Education Technology as a de facto
          Digital Product Manager in Student Affairs. Outside, I travel, play
          TTRPGs, and am heavily involved in the LGBTQ+ Leather and Furry
          scenes.
        </p>
        <p>
          Why a blog? Because I wanted to. In all seriousness I wanted to get
          whatever thoughts out of my head and on "paper" somewhere. It helps me
          process things, especially with my ADHD; and why not get my thoughts
          and ideas out there.
        </p>
        <p>
          You'll find posts from professional to personal, spanning various
          topics. Fair warning, there will be some <em>spicier</em> topics, as I
          am heavily involved in the leather and kink communities, but there is
          a toggle to hide those posts, or just the images of the posts (No
          nudity, but some kinkwear/activities may be pictured).
        </p>
        <p>
          Expect posts as I feel like it, but if you want to keep up with me on
          the day-to-day, my social links can be found at{' '}
          <a href="https://riku.gay/" target="_blank" rel="noopener">
            riku.gay
          </a>
          .
        </p>
      </div>
    </article>
  );
}
