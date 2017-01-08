#!/usr/bin/env python3

from PIL import Image, ImageDraw
import binascii
import argparse
import codecs
import math
import sys
import os

WIDTH = 64

# Parse path to DLC file
parser = argparse.ArgumentParser()
parser.add_argument("dlcfile", help="Path to DLC file")
args = parser.parse_args()
print("Opening " + args.dlcfile)

# Create new image, height depends on DLC file size
dlcsize = os.path.getsize(args.dlcfile)
im = Image.new("RGB", (WIDTH, math.ceil(dlcsize / 0x30)), "white")

# Lookup table for colors
lookup = [0x00, 0x80, 0xf0, 0xff]

y = 0
with open(args.dlcfile, "rb") as dlc:
	data = dlc.read(0x30)

	# ignore the last line
	while len(data) == 0x30:
		hexstr = codecs.getencoder("hex_codec")(data)[0].decode("utf-8")
		print(hexstr)

		# 1 color is 2 bits, 6 bit color depth for 64 colors
		# Iterate over two pixels per iteration
		for x in range(int(WIDTH / 2)):
			# Three hex characters represent two pixels
			bothpix = hexstr[(x * 3):(x * 3 + 3)]
			color1 = (lookup[int(bothpix[0], 16) & 0x03], lookup[int(bothpix[1], 16) >> 2], lookup[int(bothpix[0], 16) >> 2])
			color2 = (lookup[int(bothpix[2], 16) >> 2], lookup[int(bothpix[2], 16) & 0x03], lookup[int(bothpix[1], 16) & 0x03])
			im.putpixel((x * 2, y), color1)
			im.putpixel((x * 2 + 1, y), color2)
		data = dlc.read(0x30)
		y += 1


# write to stdout
im.save("image.bmp")
