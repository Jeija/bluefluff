#!/usr/bin/env python3
import os

# Modify these paths to select which input DLC file you want to
# modify and where the output file should end up.
TARGET="/path/to/tu003410.dlc"
OUTFILE="/path/to/custom.dlc"

# This is where you define which content you want to insert into
# the DLC files (A1800 audio files, custom LCD graphics, ...)
# You need to make sure injection payloads don't overlap!
#
# These are possible offsets for audio files and their input.index.subindex.specific hierarchy in the TU003410.DLC file:
# *  8270 * 40 +  7 injects into action 75.0.2.6
# *  8400 * 40 + 13 injects into action 75.0.3.3
# * 10596 * 40 + 21 injects into action 75.0.6.2
# * 11888 * 40 + 11 injects into action 75.0.0.3
# * 15690 * 40 + 29 injects into action 75.0.3.7
# * 16155 * 40 + 35 injects into action 75.0.3.7 (later in the action)
# * 22357 * 40 + 27 injects into action 75.0.1.4 and 75.0.1.7
# * 24468 * 40 + 15 injects into action 75.0.4.0
INJECTIONS=[{
	"path" : "/path/to/sound1.a18",
	"offset" : 8270 * 40 +  7 # some offset from the list, or try your own
}, {
	"path" : "path/to/sound2.a18",
	"offset" : 8400 * 40 + 13 # another offset from the list above
}]

# Get file sizes and open all of the payloads
target_size = os.path.getsize(TARGET)
for payload in INJECTIONS:
	payload["size"] = os.path.getsize(payload["path"])
	payload["fd"] = open(payload["path"], "rb")
	print("Using " + payload["path"] + " with size " + str(payload["size"]) + " (" + str(payload["size"] / 40) + " columns)")

# Inject payloads
count = 0
with open(OUTFILE, "wb") as outfile:
	with open(TARGET, "rb") as target:
		for count in range(target_size):
			override = False
			for payload in INJECTIONS:
				if count > payload["offset"] and count < payload["offset"] + payload["size"]:
					outfile.write(payload["fd"].read(1))
					target.read(1)
					override = True

			if not override:
				outfile.write(target.read(1))

for payload in INJECTIONS:
	payload["fd"].close()
