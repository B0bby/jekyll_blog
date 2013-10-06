---
layout: post
title: CSAW 2013
tagline:
---
This past weekend marks the second time I've participated in CSAW's capture the flag competition. The 2012 CSAW CTF was my first CTF ever. I think I've made progress since then. 

In any case, this year I focused on the Recon challenges. I found them particularly interesting simply due to their ambiguity. Recon challenges in CSAW are each associated with a competition judge, and the only clue you are given is a name or an alias and maybe a link to one of their social media profiles. The rest was up to you to infer.

I typically started by looking at the judge's bio on CSAW's website. From there, I would usually be able to find a social media profile, and subsequently, an alias. I would then use that alias  to search for any profile on any site that had the same handle and seemed likely to be owned by the judge in question, in addition to any blogs, personal sites, and school or work-related sites that were associated with that particular judge. All of this information, I would compile into a small dossier. I would then make note of the attempts I made to coax information out of the various leads, weather the attempt was successful, and weather any new, potentially helpful information was revealed. 

Unfortunately, a lot of this effort was completely unneccessary.

In the end, I managed to solve three recon challenges.

---

## Jordan Wiens:
The initial clue for this Judge was a website that displayed this text:

![]({{ site.url }}/images/jordanWiens.png)

The comment at the bottom was 'key' to the solution; a news search revealed that Michael Vario had signed the PGP keys of a few notorious people. Michael Vario himself, though, was a red herring -- a search for Jordan Wiens' PGP key on a public keyserver revealed this:

![]({{ site.url }}/images/keyLookup.png)

Inside of Jordan's public key, there are beginning and ending bytes of a JFIF file -- FFD8 and FFD9, respectively. Deleting all leading and trailing data in a hex editor revealed the flag in the form of an image:

![]({{ site.url }}/images/wiensKey.jpg)

## Julian Cohen:
Searching for Julian's Twitter handle 'hockeyinjune' revealed a Wikipedia profile which linked to 'omnom.nom.com'. I think I solved this a bit differently than I've seen others do. Most would nslookup or ping omnom.nom.com, then follow the ip address to a site that would reveal the key. This is the most sensible method. I, however, attempted to banner grab omnom.nom.com with netcat, which also happened to reveal the key.

## Kevin Chung:
Pretty straightforward. His bio on CSAW's website mentioned that he was a previous winner of the Highschool Forensics Competition. On the 'previous winners' section of the CSAW Highschool Forensics Competiton website, Kevin's name is a hyperlink straight to the flag.