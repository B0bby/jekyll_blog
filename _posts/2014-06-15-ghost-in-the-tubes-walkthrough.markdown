---
layout: post
title: Ghost in the Tubes Walkthough
---

[Ghosts III ( original )](https://archive.org/details/nineinchnails_ghosts_I_IV) <br />
[Ghosts III ( CTF Version )](/files/24_Ghosts_III_CTF.flac)<br />
[Isolated Signal](/files/signal.wav)

For this challenge you were given an audio file and asked to find out what was hidden inside of it. The file was '24_Ghosts_III.flac'. This is a song from a Nine Inch Nails album released under Creative Commons back in 2008. Pretty catchy, definitely would fit well in Quake. 

Playing the song, you'll notice about halfway through, the sound of a weather alert broadcast. It's very faint, though, so it'll be necessary to isolate it before it can be decoded. 

In the 'comments' field for the audio file, there's a [link to a forum post](https://forum.ableton.com/viewtopic.php?p=752485#p752485) that provides a pretty big hint. In the thread, people are discussing the process of using 'phase cancelling' to isolate vocals in a track. Red flag, right? Phase cancelling is a pretty straight forward concept: if you take two identical audio signals, invert one, and play them over each other, they cancel each other out, and all you hear is silence. If one of the tracks is slightly different, all you hear is that difference.

So you look online and find [the song in question](/files/24_Ghosts_III_CTF.flac) ( note: make sure it's the same .flac format. In order for the phase cancelling to work, the tracks need to be identical, save for the sound you want to isolate ). Once you have it, open both songs in the same Audacity project. 

[<img src="/images/inverted.png" />]({{ site.url }}/images/inverted.png)

Use the 'invert' effect on the track that doesn't have the weather signal, and hit play. Now all you hear is complete silence up until the weather alert, which is now all by it's lonesome. At this point, you can export the track ( cut out the soundless portions if you like ). 

[The signal that you normally hear on TV](https://www.youtube.com/watch?v=VPGczKUlgd8) is a protocol designed by NOAA called SAME ( Specific Area Message Encoding ). This is an AFSK modulated data signal that runs at 520.83 baud. It typically transmits some location data and weather warnings and stuff, but in this case it's transmitting the flag.

There are probably a bunch of programs capable of decoding this signal ( surely one of the HAM Radio variety ), but I just used something called [SeaTTY](http://www.dxsoft.com/en/products/seatty/). In SeaTTY, make sure the 'Mode' is set to 'NWR-SAME', then hit 'File > Decode from file' and the flag will begin to print before your very eyes!

[<img src="/images/seatty.png" />]({{ site.url }}/images/seatty.png)