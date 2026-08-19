"use client";

import Link from "next/link";
import { useTheme } from "../../components/useTheme";

export default function OdeToVinyls() {
  useTheme();

  const textColor = "var(--color-text)";
  const headingColor = "var(--color-heading)";
  const mutedColor = "var(--color-muted-strong)";

  return (
    <main
      className="min-h-screen flex justify-center overflow-x-hidden"
      style={{
        paddingTop: "30px",
        paddingBottom: "30px",
        paddingLeft: "24px",
        paddingRight: "24px",
      }}
    >
      <div className="max-w-4xl w-full">
        <div className="flex flex-col gap-6">
          {/* Back link */}
          <Link
            href="/writings"
            className="inline-flex items-center gap-2 text-sm hover-link animate-fade-in delay-0"
            style={{ color: textColor }}
          >
            <svg
              stroke="currentColor"
              fill="none"
              strokeWidth="2"
              viewBox="0 0 24 24"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-4 h-4"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
            Back
          </Link>

          {/* Title */}
          <div className="animate-fade-in delay-0">
            <h1
              className="text-3xl sm:text-4xl font-black"
              style={{ color: headingColor }}
            >
              Ode to Vinyls
            </h1>
            <p
              className="text-sm"
              style={{ color: mutedColor, marginTop: "0.5rem" }}
            >
              <time dateTime="2026-08-20">August 20, 2026</time>
            </p>
          </div>

          {/* Content */}
          <article
            className="animate-fade-in delay-400 flex flex-col gap-6 text-sm sm:text-base leading-relaxed"
            style={{ color: textColor }}
          >
            <p>
              A month ago, I bought some vinyls for my room. Then I started
              thinking about why so many people still collect them. If you think
              about it, it is highly inefficient. When I want to listen to a
              song, I have to take the record out of the sleeve, be extra
              careful not to damage the grooves, carefully place it on the
              turntable, and lower the needle. If I wanted to listen to a
              specific song, I didn't have the luxury of just clicking a button
              on Spotify to switch songs. I had to find it on the record
              physically and hope I landed somewhere near the beginning.
            </p>
            <p>So why do people still own vinyls?</p>

            <figure className="flex flex-col gap-3">
              <img
                src="https://rjdgugnxm7szh20r.public.blob.vercel-storage.com/ode_to_vinyls/1584.jpeg"
                alt="Vinyl records mounted on my bedroom wall"
                className="w-full rounded-lg"
              />
              <figcaption className="text-sm" style={{ color: mutedColor }}>
                The vinyls on my wall
              </figcaption>
            </figure>

            <p>
              A similar case came up with a friend of mine who recently bought a
              1996 car for 20k; for the same price, you can lease a brand-new
              Tesla Model 3 for three years. Not to mention, because of its age,
              half the stuff on the car was broken: the oil tank was leaking
              after hitting a pothole a bit too hard, the dashboard light
              doesn't work, and he can't drive it in the winter because the snow
              and salt are bad for the car. So then why are those cars in such
              high demand that a purchase like that is actually considered a
              steal?
            </p>
            <p>
              So why would anyone choose a car that he would have to fix
              constantly?
            </p>

            <figure className="flex flex-col gap-3">
              <img
                src="https://rjdgugnxm7szh20r.public.blob.vercel-storage.com/ode_to_vinyls/1996%20BMW%20328is%20Sport.jpeg"
                alt="A 1996 BMW 328is Sport"
                className="w-full rounded-lg"
              />
              <figcaption className="text-sm" style={{ color: mutedColor }}>
                1996 BMW 328is Sport
              </figcaption>
            </figure>

            <p>
              The obvious answer for most people would be that these are bad
              purchases: the vinyl is impractical, the car is unreliable, and
              both are objectively less convenient than their more advanced
              successors. Yet for the people who actually choose to buy them,
              they could be perfectly valid.
            </p>
            <p>
              We often judge technology and innovations by how much time they
              save, how much hassle they remove, and how much more freedom they
              give us. But what exactly do we mean by freedom? If freedom is
              understood merely as freedom from having to perform a task, then
              every reduction in effort could be an improvement. But then this
              ignores another kind of freedom, one that could be more meaningful
              in our lives. The freedom to participate in an activity, to
              understand it, and to choose how it is done, yourself.
            </p>
            <p>
              On a note related to my own work, coding looks so different right
              now than it did 5 years ago. Nowadays, Claude Code can write a
              piece of code and fully test it in an hour; an equivalent task 5
              years ago would have taken someone a week. Yet, what happens when
              efficiency becomes the unquestioned measure by which every
              activity is judged? If you ask me about a piece of code I wrote 5
              years ago, I can explain to you every single decision behind it
              down to the last bitwise operator, yet now, I sometimes don't even
              know what a whole file does for a given project I am working on,
              maybe just faintly how it fits into the system. Is that truly
              better or worse? I don't really know; it does get work done a lot
              faster, but it does feel like I didn't really write the code. I
              just thought about how it should be written and checked that it is
              done, but it isn't really mine.
            </p>
            <p>
              What does it mean to be mine though? In the legal sense, ownership
              is a matter of rights: the person who owns the car has the legal
              right to possess and use it, while intellectual property law
              determines who can reproduce, modify, or distribute a piece of
              software. But the truer sense of belonging comes from
              understanding how everything works from first principles and
              actually working on it yourself with your hands.
            </p>
            <p>
              What really bothers me about this is not the Claude Code, vinyl,
              or even cars. It is the possibility that efficiency has stopped
              being a property of a tool and become a way of evaluating
              everything. A forest becomes timber. A river becomes hydroelectric
              potential. Time becomes productivity. The danger of modernity
              isn't that machines are replacing human beings. It could be that
              we increasingly learn to look at everything as something that
              should be optimized.
            </p>
            <p>
              Of course, I am not saying that all inconvenience is inherently
              valuable. Still, chosen inconveniences are valuable because they
              help us live more meaningful lives and experience the world the
              way WE want to. Nothing is liberating about doing the dishes and
              the laundry by hand or doing math with your brain rather than
              using a calculator because it feels more "authentic". If I were
              arguing that every form of effort is valuable because it is
              effort, then I would be romanticizing inconvenience for its own
              sake, so I guess the distinction I must make is between effort
              that merely obstructs an activity and effort that constitutes it,
              yet for everyone they would view that differently.
            </p>
            <p>
              What if I merely want the experience of taking my vinyl out of the
              sleeve, slowly putting it into the turntable, and putting the
              needle down on the record? What if my friend thinks that repairing
              the car and truly understanding how it works isn't an
              inconvenience but an experience of being a more intentional car
              owner?
            </p>
            <p>
              Yet this is different for every single person, so maybe the best
              thing about technology isn't that we get to do less, but that we
              get to pick what kind of hassle we want to put ourselves through.
            </p>
          </article>
        </div>
      </div>
    </main>
  );
}
