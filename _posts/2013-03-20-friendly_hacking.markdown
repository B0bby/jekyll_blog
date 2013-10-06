---
layout: post
title: Raspberry Pwned
tagline: I recently experienced a friendly ‘hacking' attempt
---

I recently experienced a friendly 'hacking' attempt, and I thought I would share the details here, for posterity.

The target of the attack was my Raspberry Pi, which runs my ZNC server and is set up at my childhood home, rather than my school apartment where I normally reside.

The range of the attack was somewhat mitigated due to the Pi being on a separate subnet from my family's personal computers. The subnet where the Pi is located only contains two network tv tuners, and one printer.

The maneuver itself was simple, but effective. As a member of Illinois State's Network Security club, I have an account on our server that I make use of occasionally. Recently, I attempted to SSH forward a service from our club's server to my Pi. Foolishly, I SSH'd to my primary account, with sudo access. Our club's president had a script set up for just such an occasion that promptly logged all my info, end of story. I suppose the moral is:

![]({{ site.url }}/images/Trust-no-one.jpg)