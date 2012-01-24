---
layout: post
published: false
---

Every week since the new year started I've been getting asked what my
New Years resolutions are for 2012. My answer the first few times was
the truth: "I haven't really thought about it yet." Magically the focus
then shifts to other person while they explain to me how this year they
plan on being more active, read more books or do more traveling. My
attention usually wanes at this point, my eyes gloss over and I go "Oh!
Nice!"

I've noticed that most people don't hit these kinds of goals and I don't
know if it's because the goals are too vague, too idealistic, that the
person is lazy, or some combination of three. With me, I know that I
won't hit my goals if A) They aren't specific and B) I'm not diligent
enough in my daily life to keep to them. "I want to be more active" is a
nice goal, and one that every sunlight-bereft developer should strive
for, but isn't specific enough. "I want to learn how to do a frontside
180 of a jump on a snowboard" is pretty specific.

When I actually decide to sit down to pick a resolution for this year, I
wanted to pick something about myself professionally that I wanted to
improve. I made a list. A __long__, very scary list that I've hidden
away under my bed and plan to peek sometime mid-August. The list was
good though, and it has definitely given me some stuff to think about.
More importantly I was able to pull out a couple of resolutions from it
that I think are realistic, obtainable goals that will require a bit of
diligent to keep up:

## Stop and Think

If I had to classify the first part of my career, I think would call
myself an "Idealistic Hacker". I had (and still do from time to time),
the urge to simply start hacking away at a solution to a problem without
thoroughly thinking it through. This would usually culminate with me
stepping back, looking at my newly minted solution and realizing that it
didn't *quite* fit with the problem I was trying to solve. I would then
spend some time hacking away at the edges until the requirements were
met. 

This is a problem. Not just with me, but with a lot of other developers
out there who will just start working on a problem without thinking
through the design, their architectural limitations, or skip writing
unit tests. 

We do these "lunch and learns" at work on Fridays, where the
office will order in lunch for everyone and we'll sit down to watch a
video. The video can be anything but it normally falls within some facet
of the software industry. Last Friday, we watched a presentation by Rich
Hickey titled [Hammock Driven Development]() that was about this exact
issue. It's a good, 40 minute video thats simply about taking your time,
thinking through problems and coming up with a solution when you know
you're ready.

Obviously there are times at our jobs when we don't have
the luxury of taking even a day to think about a specific problem, but
that's not my point. My point is that I shouldn't be diving into a
problem that I don't understand. If its time-sensitive, then I should be
grabbing someone else and running ideas by them before start writing
production code. And before I do that I should be writing tests, which
brings me to my next goal:

## Practice TDD EVERYWHERE

TDD is something that I've been practicing for a while on personal
projects, but haven't yet made the leap to doing it at work. I don't
have any real excuse for this, I just always seem to get distracted with
the immediacy of the issue and end up solving the problem without
writing the necessary tests __first__.

I made this resolution when I began working on a module that had no
tests whatsoever. I tried simply making the change I needed, but wound
up with some unexpected results. Before I could work on my feature I
needed to practice something that shall henceforth be known as Test
Driven After Development, Development. After I got back from my angry
coffee I resolved that not only would I never leave a module I touched
untested, but that I would write the tests before I do anything else.

By now you're probably wondering why I titled this post "Watch
Yourself". To be honest, I set out to write a post that was more of an
extension of a recent post by Uncle Martin titled [The Letter](http://blog.8thlight.com/uncle-bob/2012/01/12/The-Letter.html).
It felt exceptionally preachy and I decided that there wasn't any
reason for me to reiterate something that had already been written so
eloquently. I chose to write more about myself and the overarching goal
I've set about being more concious of my decisions and practices as a
software developer. I know that I if I can spend the next year being
diligent about hitting these resolutions, that I'll improved wholly
as a professional.
 






Over the last couple of weeks, I've seen a common trend emerge from a
couple of different sources about the self regulation of oneself as a
software developer. 

Specifically, Uncle (Bob) Martin wrote two posts in
regards to this, and today we watched a presentation by Rick Hickey.

(Hammock Driven Development: Think about things, take your time, be
thorough).[link](http://blip.tv/clojure/hammock-driven-development-4475586)

(Fecophiles: Not resisting change. Taking a step back and asking
yourself if you're "living in shit")[link](http://blog.8thlight.com/uncle-bob/2012/01/20/Fecophiles.html)

(The Letter: Software is everywhere. It has permeated its way to ever
faucet of our society and it is becoming far to important for us to
simply shrug our sholdhours and plough ahead with messy code into the
unkown.)[link](http://blog.8thlight.com/uncle-bob/2012/01/12/The-Letter.html)

It's hard to do, especially when you're saying "No" to the person
signing your paychecks. It's our job to either make our managers
understand when something is a bad decision, or to take the
responsiblity for the consequences. It's easy to say "I told you so"
after something happened, but we're still the ones that implemented it,
and we should still bear the brunt of the blame.

There is always another problem standing in line. They're endless.
Solving the current one quickly doesn't make the next one go away any
quicker. I'm reminded of the time I spent in my teens when I worked for
large scale retail organization. We would have days (a lot of them) when
customers would line up in front of our tills and started tapping there
feet impatiently as they waited to get help. Your first instinct was
always to rush, be effecient and try to help as many people as we could
in the shortest amount of time possible. You begin to realize after a
while that the line essentially never ended, and there was no insentive 
to getting through customers any quicker. You were better off taking
your time, make sure that each customer was helped properly and
thoroughly, then turn to the next.

Our "problems" in software development are essentially the same thing.
They feel never ending, but we won't solve anything by hacking away
quickly at one then turning to the other. Slow down, take your time, and
make sure you have a good solution before turning to the next.
