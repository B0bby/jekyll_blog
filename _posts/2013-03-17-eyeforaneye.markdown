---
layout: post
title: Eye for an Eye?
tagline: I watched 'Seven Psychopaths' this weekend
---
## The Lamest Idea
I watched 'Seven Psychopaths' this weekend and one of the characters ranted about a fallacy with the anecdote 'An eye for an eye leaves the whole world blind'. Namely that the last person with eyes will be able to avoid having his eyes removed, given that everyone else in the world is blind.

I thought it'd be neat to simulate this with a little script, which was fun to make and I used it as an excuse to learn some Ruby, but in hindsight was a really dumb idea. I mean, honestly, given the rules I listed before I even started coding anything, it should have been pretty easy to determine the outcome every time, unequivocally. 

	# EXECUTION:
	# 1. Randomly generate a 'world' of people. 
	# 2. Have a random person 'wrong' another random person.
	# 3. Said wrongdoer will have one eye immediately subtracted 
	#     from their total allotment of two.
	# 4. Continue to execute steps 2 and 3 until either zero eyes remain
	#     in the world, or no more wrongs can be committed.

	# CONDITIONS:
	# 1. A person has a maximum of two and a minimum of zero eyes.
	# 2. A wrong always results in the romval of an eye.
	# 2. A blind person is incapable of effectively commiting a wrong.
	# 3. A blind person is incapable of retribution. (Crimes 
	# 	committed against them will not result in an eye removal)

These rules will always result in one person left with sight, though the amount of eyes that remain can vary.

Ruby's Arrays
The most unusual thing about the whole project (aside from how crummy the idea was in hindsight) was learning how to operate Ruby's multidimensional arrays. Simply filling an array with arrays doesn't cut it, as all the individual arrays in such an array are affected at the same time, even if a change is made to a specific array: 

anArray = Array.new(3,Array.new(3))
This creates a 3x3 array by creating an array of size 3, with each cell holding another 3-cell array. Using this syntax, however, seems to result in an array where every 'element' of the array is affected concurrently with each of its counterparts.

In order to make an array where each element is affected individually, I had to use this syntax:

	anArray = Array.new(3) { Array.new(3,Hash.new) }

This also creates a 3x3 array, but each element is affected individually. Which is kind of how I would expect an array to operate in the first place, which makes me suspicious that I'm doing something horribly wrong

And then I had to fill each element with a for loop. There's probably a better way to do that, but there's a knowledge gap I'll save for another project. In the mean time, here's the code for the whole shebang, if you're at all interested:

{% highlight ruby lineos %}

def populateWorld(population)
	person = [2,0,0]
	theWorld = Array.new(population) { Array.new(3,Hash.new) }
	for index in theWorld
		index[0] = 2
		index[1] = 0
		index[2] = 0
	end
	return theWorld
end

def eyeForAnEye(theWorld)
	worldStats = [0,0,0,0]
	offenseCount = 0
	while isWorldBlind(theWorld)
		randomWrongdoer = rand(theWorld.length)
		if theWorld[randomWrongdoer][0] >= 0
			randomVictim = rand(theWorld.length)
			if theWorld[randomVictim][0] >= 0
				if theWorld[randomVictim][0] == 0
					worldStats[0] += 1
				end
				if theWorld[randomVictim][0] > 0
					theWorld[randomVictim][0] -= 1
				end
				if theWorld[randomWrongdoer][0] > 0
					theWorld[randomWrongdoer][0] -= 1
				end
				theWorld[randomWrongdoer][1] += 1
				theWorld[randomVictim][2] += 1
				offenseCount += 1
					puts "************************"
					puts "Offense \##{offenseCount}"
					puts "Wrongdoer \#%4s: %2s" % [randomWrongdoer,theWorld[randomWrongdoer][0]]
					puts "Victim    \#%4s: %2s" % [randomVictim,theWorld[randomVictim][0]]
			end
		end
	end

		puts "\n\n"
		puts "Only one sighted person remains in the world"
		puts "------------------------"
		puts "He/She has #{theWorld[personCount][0]} eye(s) left"
		puts "He/She committed #{theWorld[personCount][1]} offenses"
		puts "He/She has had #{theWorld[personCount][2]} offenses \ncommitted against them"
		puts "\n\nIn all, there have been #{worldStats[0]} crimes committed against 
				\n blind people."
		mostOffenses = 0
		personCounter = 0
		for person in theWorld
			if person[1] > mostOffenses
				mostOffenses = person[1]
				biggestOffender = personCounter
			end
			personCounter += 1
		end

		puts "\n\nThe most notorious criminal was person number #{biggestOffender}."
		puts "This person committed #{theWorld[biggestOffender][1]} crimes."
		puts "This person was the victim of #{theWorld[biggestOffender][2]} crimes."
end

def isWorldBlind(theWorld)
	blindPersonCount = 0
	personCount = 0
	for person in theWorld
		if person[0] == 0
			blindPersonCount += 1
		end
		personCount += 1
	end
	if blindPersonCount == personCount
		return false
	elsif personCount - blindPersonCount == 1
		return false
	else
		return true
	end
end

def results()
	
end

theWorld = populateWorld(1000)
eyeForAnEye(theWorld)

{% endhighlight %}