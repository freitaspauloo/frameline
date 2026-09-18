import Image from "next/image";
import Link from "next/link";
import { assetPath } from "@/src/lib/asset-path";
import { SwapLabel } from "@/src/components/SwapLabel";
import { Reveal } from "./motion/Reveal";

export type FrameWorkProject = {
  title: string;
  client: string;
  href: string;
  image: { src: string; alt: string };
  /** One-line caption under the title (Frameline showcase tiles). */
  description?: string;
};

type Props = {
  projects: FrameWorkProject[];
  label?: string;
  /** Optional section kicker above the grid. */
  kicker?: string;
};

function WorkCard({ project }: { project: FrameWorkProject }) {
  const external = project.href.startsWith("http");
  const body = (
    <>
      <div className="frame-work__media">
        <Image
          src={assetPath(project.image.src)}
          alt={project.image.alt}
          fill
          unoptimized
          sizes="(max-width: 960px) 100vw, 612px"
          style={{ objectFit: "cover" }}
        />
      </div>
      <div
        className={
          project.description
            ? "frame-work__meta frame-work__meta--stacked"
            : "frame-work__meta"
        }
      >
        <div className="frame-work__copy">
          <span className="frame-work__title">
            <SwapLabel>{project.title}</SwapLabel>
          </span>
          {project.description ? (
            <p className="frame-work__desc">{project.description}</p>
          ) : null}
        </div>
        <span className="frame-work__role">{project.client}</span>
      </div>
    </>
  );

  if (external) {
    return (
      <a
        href={project.href}
        className="frame-work__card"
        target="_blank"
        rel="noopener noreferrer"
      >
        {body}
      </a>
    );
  }

  return (
    <Link
      href={project.href}
      className="frame-work__card"
    >
      {body}
    </Link>
  );
}

export function FrameWorkGrid({ projects, label = "Selected work", kicker }: Props) {
  return (
    <section className="frame-work" aria-label={label}>
      {kicker ? <p className="frame-work__kicker">{kicker}</p> : null}
      <Reveal targets=".frame-work__card" stagger={0.08}>
        <div className="frame-work__grid">
          {projects.map((project) => (
            <WorkCard key={`${project.href}-${project.title}`} project={project} />
          ))}
        </div>
      </Reveal>
    </section>
  );
}
