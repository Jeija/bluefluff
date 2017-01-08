#!/usr/bin/env python3

from PIL import Image, ImageDraw
import binascii
import argparse
import codecs
import math
import sys
import os

WIDTH = 40

# Parse path to DLC file
parser = argparse.ArgumentParser()
parser.add_argument("dlcfile", help="Path to DLC file")
args = parser.parse_args()
print("Opening " + args.dlcfile)

# Create new image, height depends on DLC file size
dlcsize = os.path.getsize(args.dlcfile)
im = Image.new("RGB", (WIDTH, math.ceil(dlcsize / WIDTH)), "white")

y = 0
with open(args.dlcfile, "rb") as dlc:
	data = dlc.read(WIDTH)

	# ignore the last line
	while len(data) == WIDTH:
		for x in range(WIDTH):
			val = data[x]
			color = (val, val, val)
			im.putpixel((x, y), color)
		data = dlc.read(WIDTH)
		y += 1


# write to stdout
im.save("audio.bmp")
