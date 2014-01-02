---
layout: post
---

Every week since the new year started I've been getting asked what my
New Years resolutions were for 2012. My answer the first few times was
the truth: "I haven't decided yet." Almost magically, the focus will
shift to the other person and they'll explain to me that this year they
plan on being more active, do more travelling, etc. At this point my attention
will wane my eyes will gloss over and the words "Oh, nice!"
fall out.

I've noticed that most people don't hit these kinds of goals and I can't
tell if its because they're to vague, unrealistic, that the person is
lazy, or some combination of the three. With me I know that I'll only hit
my goals if they're A) specific and B) obtainable. "I want to be more
active" is a nice goal, and one that every sunlight bereft developer
should strive for, but isn't specific enough. "I want to learn how to
perform a frontside-180" is pretty specific and completely obtainable
for even for someone who has just started snowboarding.

When I sat down to pick a resolution for this year, I wanted to
pick something about myself professionally that could use some
improvement. I made a list. A __long, very scary__ list that I've since
hidden under my bed and don't plan on looking at again until sometime
mid-August. The list was good though, and it has definitely given me
some stuff to think about. More importantly I was able to pull out a
couple of resolutions from it that I are realistic enough, but
will still require some diligence on my part in order to obtain.

## Stop and Think

If I had to classify the first part of my career, I think I would label
myself an "Idealistic Hacker." When given a new problem, I would launch
into an answer without thinking through the ramifications that came with it.
I would typically look back at my newly minted solution and realise that
it didn't *quite* fit with the issue I was trying to solve. I would then
spend more time hacking my hack until the requirements were met.

Obviously this was a problem. It worked for a while until I realized that
I was wasting a ton of time not only with getting the feature shipped,
but trying to re-understand my solution on a return trip to the module 6
months later.

I'm the kind of guy who appreciates well designed code and loathes the
ugly. I take pride in designing my code well because I know that it
saves time for the next person who has to read it. I've found through
practice and experience that I can achieve my highest level of
satisfaction when I've taken the time to truly think about a problem
before I sit down to solve it.

>This is in essence what Rich Hicky talks about in a presentation he gave
>called [Hammock Driven Development](http://blip.tv/clojure/hammock-driven-development-4475586)

Undoubtedly there are times in our jobs where we aren't afforded the
luxury of taking even a day to think through a problem, but we should be
able to at least spare a few minutes to make sure we __understand__ the
problem. I've come up with two really obvious tactics to force myself to
come up with good solutions. The first is to throw an idea at a
colleague and see what they think. Small, two minute discussions about a
problem has saved me boatloads of time when designing a solution. The
second is to make sure I write my tests first.

## Practice TDD EVERYWHERE

TDD is something I've been practicing on my own for a while now, but I
haven't yet made the leap to using it full time at work. I don't really
have an excuse for this. Most of my colleagues believe in the practice,
and everyone is in favor of writing tests. I just tend to get to so
bogged down with problems from all different angles that I spend more
time writing my tests after I've finished rather than before.

I decided this needed to stop when I began working on a module that had
no tests associated with it. My problem was trivial: a date value
wasn't appearing on a client facing widget. The solution seemed simple
enough. There was a `default_display_value` attribute on the widget that
wasn't being set during its creation so all I needed to do was add the
correct date to the parameters being passed in. Alas, this appeared to
do nothing and I spent the next hour following a maze of logic that only
served to confirm that the code I was looking at had been hacked together.

I've vowed since then to always write tests for any code I touch __first__.
I'll do this not only because I know it will result in better code, but that
the next developer will be able to expand upon it without worrying about
breaking whats there.

By now you're probably wondering why I titled this post "Watch Yourself"
and not "Stop What You're Doing and Write Tests!" To be honest, I
originally set out to write something along those lines, but it felt overly
preachy and has been done to death. I changed it to be more about myself and
what I've experienced. I know what works for me because I've taken the
time to look back at what I've done, determine where I've succeed, where
I've failed and try to improve myself professionally.

You should too.
