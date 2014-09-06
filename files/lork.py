#!/usr/bin/env python

import requests
import time
import datetime
from operator import xor
import logging


logging.basicConfig(format='%(asctime)s %(message)s', level=logging.DEBUG)
logger = logging.getLogger('lork')

def getaccess(mask, ditdah, salt, now):
	fn = []
	tn = []
	ditdah = ditdah.replace(" ", "")
	idx = -1
	ddidx = -1
	tidx = -1
	if(now[-2:] == "00" or now[-2:] == "30"):
		nstr = str(now) + str(salt)
	else:
		nstr = str(salt)

	for ltr in mask:
		idx += 1
		ddidx += 1
		tidx +=1
		if(ddidx >= len(ditdah)):
			ddidx = 0
		if(tidx >= len(nstr)):
			tidx = 0

		fn.append(chr(xor(xor(ord(ltr), ord(ditdah[ddidx:ddidx+1])), ord(nstr[tidx:tidx+1]))))

	fnstr = "".join(map(str, fn))
	return fnstr



def getCookies(session=None):
	if session is not None:
		return requests.get("https://bsjtf.com", cookies=dict(PHPSESSID=session)).cookies
	else:
		return requests.get("https://bsjtf.com").cookies 

class LorkClient:
	def __init__(self, session=None, verbose=False):
		self.cookies = getCookies(session)
		self.points = 0
		self.room = "<none>"
		self.clearCallbacks = set()
		self.verbose = verbose

	def addClearCallback(self, clearCallback):
		self.clearCallbacks.add(clearCallback)

	def removeClearCallback(self, clearCallback):
		self.clearCallbacks.remove(clearCallback)


	def input(self, inprompt):
		r = requests.post("https://bsjtf.com/command.php",
				cookies=self.cookies,
				data=dict(inprompt=inprompt))
		self.cookies = r.cookies or self.cookies
		data = r.json()
		self.points = data["POINTS"]
		self.room = data["ROOM"]
		# eww...
		try:
			if data["RESPONSE"] == "START":
				for cb in self.clearCallbacks:
					cb()
				return data["DISPLAY"]
		except KeyError:
			pass
		if self.verbose:
			try:
				return data["BASE"] + data["DISPLAY"]
			except KeyError:
				return data["DISPLAY"]
		else:
			return data["DISPLAY"]

def go_to_room4(lc):
	print(lc.input("RESTART"))
	print(lc.input("global thermonuclear war"))
	print(lc.input("turn on flashlight"))
	print(lc.input("west"))
	print(lc.input("south"))
	print(lc.input("look at sticky note"))
	print(lc.input("north"))
	print(lc.input("use keypad"))
	print(lc.input("ADMIN               WHITESPACE MATTERS LOL"))
	print(lc.input("WEST"))
	print(lc.input("TAKE MATCHES"))
	print(lc.input("STRIKE MATCH"))
	print(lc.input("LIGHT CANDLE"))
	print(lc.input("MOVE CARPET"))
	print(lc.input("USE LOCK"))


def testname(name):
	lc = LorkClient()
	# you may want to rate-limit this
	print(lc.input("RESTART"))
	print(lc.input("global thermonuclear war"))
	print(lc.input("turn on flashlight"))
	print(lc.input("west"))
#	print(lc.input("south"))
#	print(lc.input("look at sticky note"))
#	print(lc.input("north"))
	print(lc.input("use keypad"))
	print(lc.input("ADMIN               WHITESPACE MATTERS LOL"))
	print(lc.input("WEST"))
#	print(lc.input("TAKE MATCHES"))
#	print(lc.input("STRIKE MATCH"))
#	print(lc.input("LIGHT CANDLE"))
	print(lc.input("MOVE CARPET"))
	# Brute Force the combiation
	print(lc.input("USE LOCK"))
	print(lc.input("3592"))
	print(lc.input("DOWN"))
	print(lc.input("NORTH"))
	print(lc.input("USE TOUCH SCREEN"))
	print(lc.input("CONTRA"))
	print(lc.input("SOUTH"))
	print(lc.input("WEST"))
	print(lc.input("USE TOUCH SCREEN"))
	print(lc.input("FLOWER"))
	print(lc.input("EAST"))
	print(lc.input("EAST"))
	print(lc.input("USE TOUCH SCREEN"))
	print(lc.input("NITRO"))
	print(lc.input("WEST"))
	print(lc.input("SOUTH"))
	print(lc.input("USE TOUCH SCREEN"))
	print(lc.input("FROGGER"))
	print(lc.input("NORTH"))
	print(lc.input("NORTH"))
	print(lc.input("PUSH BUTTON"))
	print(lc.input("PUSH BUTTON"))
	print(lc.input("SOUTH"))
	print(lc.input("SOUTH"))
	print(lc.input("PUSH BUTTON"))
	print(lc.input("PUSH BUTTON"))
	print(lc.input("NORTH"))
	print(lc.input("WEST"))
	print(lc.input("PUSH BUTTON"))
	print(lc.input("EAST"))
	print(lc.input("EAST"))
	print(lc.input("PUSH BUTTON"))
	print(lc.input("WEST"))
	print(lc.input("WEST"))
	print(lc.input("PUSH BUTTON"))
	print(lc.input("EAST"))
	print(lc.input("EAST"))
	print(lc.input("PUSH BUTTON"))
	print(lc.input("WEST"))
	print(lc.input("PUSH GREEN BUTTON"))
	print(lc.input("LOOK"))
	print(lc.input("LOOK AT LAPTOP"))
	print(lc.input("USE LAPTOP"))

	RATS = '.-. .- - ...'
	YEAR = 1903
	now = (datetime.datetime.utcnow() + datetime.timedelta(hours=-5)).strftime('%m%d%Y%H%M%S')
	while now[-2:] != '00' and now[-2:] != '30':
		time.sleep(1)
		now = (datetime.datetime.utcnow() + datetime.timedelta(hours=-5)).strftime('%m%d%Y%H%M%S')
	pcode = getaccess(name, RATS, YEAR, now)
	print(now)
	print(pcode)
	print(lc.input("date"))
	print(lc.input("nc 10.2.1.3 4444"))
	print(lc.input(pcode))


# names = ['Nevil Maskelyne', 'nevil maskelyne', 'NevilMaskelyne', 'nevilmaskelyne', 'Maskelyne']

def do_port_scan_with_nc():
	lc = LorkClient()
	# you may want to rate-limit this
	print(lc.input("RESTART"))
	print(lc.input("global thermonuclear war"))
	print(lc.input("turn on flashlight"))
	print(lc.input("west"))
#	print(lc.input("south"))
#	print(lc.input("look at sticky note"))
#	print(lc.input("north"))
	print(lc.input("use keypad"))
	print(lc.input("ADMIN               WHITESPACE MATTERS LOL"))
	print(lc.input("WEST"))
#	print(lc.input("TAKE MATCHES"))
#	print(lc.input("STRIKE MATCH"))
#	print(lc.input("LIGHT CANDLE"))
	print(lc.input("MOVE CARPET"))
	# Brute Force the combiation
	print(lc.input("USE LOCK"))
	print(lc.input("3592"))
	print(lc.input("DOWN"))
	print(lc.input("NORTH"))
	print(lc.input("USE TOUCH SCREEN"))
	print(lc.input("CONTRA"))
	print(lc.input("SOUTH"))
	print(lc.input("WEST"))
	print(lc.input("USE TOUCH SCREEN"))
	print(lc.input("FLOWER"))
	print(lc.input("EAST"))
	print(lc.input("EAST"))
	print(lc.input("USE TOUCH SCREEN"))
	print(lc.input("NITRO"))
	print(lc.input("WEST"))
	print(lc.input("SOUTH"))
	print(lc.input("USE TOUCH SCREEN"))
	print(lc.input("FROGGER"))
	print(lc.input("NORTH"))
	print(lc.input("NORTH"))
	print(lc.input("PUSH BUTTON"))
	print(lc.input("PUSH BUTTON"))
	print(lc.input("SOUTH"))
	print(lc.input("SOUTH"))
	print(lc.input("PUSH BUTTON"))
	print(lc.input("PUSH BUTTON"))
	print(lc.input("NORTH"))
	print(lc.input("WEST"))
	print(lc.input("PUSH BUTTON"))
	print(lc.input("EAST"))
	print(lc.input("EAST"))
	print(lc.input("PUSH BUTTON"))
	print(lc.input("WEST"))
	print(lc.input("WEST"))
	print(lc.input("PUSH BUTTON"))
	print(lc.input("EAST"))
	print(lc.input("EAST"))
	print(lc.input("PUSH BUTTON"))
	print(lc.input("WEST"))
	print(lc.input("PUSH GREEN BUTTON"))
	print(lc.input("LOOK"))
	print(lc.input("LOOK AT LAPTOP"))
	print(lc.input("USE LAPTOP"))
	for num in range(65535):
		logger.info('%s' % num)
		port = lc.input("nc 10.2.1.3 %s" % num)
		if "command not found" in port:
			pass
		else:
			print(port)


if __name__ == "__main__":
	# for name in names:
		# testname(name)
	do_port_scan_with_nc()
			
# Brute Force r4
#	import itertools

#	for combination in itertools.product(range(10), repeat=4):
#		input = lc.input(''.join(map(str, combination)))
#		print(''.join(map(str, combination)))
#		if "RESTART" in input:
#			lc = LorkClient()
#			go_to_room4(lc)
#		elif "flag" in input:
#			print(input)
#			exit(1)
#		else:
#			print(input)
		
	# ??? (what's next...)
