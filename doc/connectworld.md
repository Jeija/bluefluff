# App Update Mechanism
The Furby Connect World App not only lets you play with and collect creatures called "Furblings", it can also take control of Furby Connect and update him with new content from the internet, like new songs and the occasional cat / dog video.

I have found all of these results with the Android App on different devices only, so the iOS version may differ.

## App Contents
When first starting up, the Furby Connect World connects to a server `http://fluff-gameupdates.s3.amazonaws.com/` and downloads in-game content, like the 3d models, background music and other sounds.

The App makes four HTTP requests to compress ".pak" files under the following URLs:
```
fluff-gameupdates.s3.amazonaws.com/android_eu/data/effects.pak.0
fluff-gameupdates.s3.amazonaws.com/android_eu/data/characters.pak.2
fluff-gameupdates.s3.amazonaws.com/android_eu/data/audio.pak.3
fluff-gameupdates.s3.amazonaws.com/android_eu/data/environments.pak.3
```

It also fetches a `.xal` file that seems to contain references to different activities, effects, animations and upcoming minigames within the Furby Connect World App:
```
fluff-gameupdates.s3.amazonaws.com/android_eu/versions/1.4.0.0/assets.xal
```

The `.pak` files can be decoded by first uncompressing them via `zlib-flate -uncompress < audio.pak.3 > audio.raw` and then using [QuickBMS](http://aluigi.altervista.org/quickbms.htm) for extracting single files from the resulting outputs. Luckily, these outputs use the "XPK2" file format, which is used by Exient in various other games, so a QuickBMS [script already exists](http://aluigi.altervista.org/bms/xpk2.bms). QuickBMS can be used in the following way:
```
﻿quickbms.exe xpk2.bms audio.raw audio_out
```

Now unfortunately, when listening to the different audio files and looking at the contents of the other files, it turns out that *none of these files actually get flashed to Furby's memory*. They all just appear to be in-game elements.

## Movies and DLC files
As it turns out, the Furby Connect World also makes a second request to Amazon AWS servers after starting up. This one is harder to discover, since its domain name somewhat obfuscates its original meaning. Whether this is intentional in order to divert any attention away from the Furby Connect World App or has some technical meaning, I don't know.

On every startup, the App makes several DNS requests. One of the requests is for the aforementioned `fluff-gameupdates.s3.amazonaws.com`, but also one for `crash-reports.exient.com` and interestingly `api.fluff-prod.nbla.net.lan` and `api.fluff-prod.nbla.net`. However, it also looks up `chromecastpd.s3.amazonaws.com`, which really doesn't appear to be anything Furby-related, and proceeds to perform HTTPS-encrypted communication with the webserver.

In order to sniff this communication, you can use a man-in-the-middle proxy like [mitmproxy](https://mitmproxy.org/) and an Android App that forces all traffic to use this proxy tunnel like [ProxyDroid](https://play.google.com/store/apps/details?id=org.proxydroid) or any of the alternatives. This will requre your Android device to be rooted!

Now by sniffing the encrypted GET requests, we can find out that the Furby Connect World first downloads a file that contains references to different in-game movie theater movies (songs / cat videos / ...), their release dates and their corresponding XML files:
```
http://chromecastpd.s3.amazonaws.com/furbyconnect/cinemav010/masterlist.xml
```

After parsing the masterlist XML file, the Furby Connect World continues to download the video-specific XML files, e.g.
```
http://chromecastpd.s3.amazonaws.com/furbyconnect/cinemav010/jinglebellrock.xml
http://chromecastpd.s3.amazonaws.com/furbyconnect/cinemav010/cheerleader.xml
http://chromecastpd.s3.amazonaws.com/furbyconnect/cinemav010/dogpiano2.xml
…
```

Now the App downloads the MP4 videos for the movie theater specified in the video XML files:
```
http://chromecastpd.s3.amazonaws.com/furbyconnect/cinemav010/jinglebellrock.mp4
http://chromecastpd.s3.amazonaws.com/furbyconnect/cinemav010/cheerleader.mp4
http://chromecastpd.s3.amazonaws.com/furbyconnect/cinemav010/dogpiano.mp4
…
```

Then if, and only if, the App has seen a Furby Connect before (or as soon as you first connect your Furby to the app), it will fetch the current DLC file containing the current release of songs, movement definitions and LCD eye animations for Furby, currently that would be
```
http://chromecastpd.s3.amazonaws.com/furbyconnect/cinemav010/tu003150.dlc
http://chromecastpd.s3.amazonaws.com/furbyconnect/cinemav010/tu003410.dlc
```
for the English version. The `masterlist.xml` document also specifies DLC files for the Russian-language Furbies (and possibly more languages in the future).

These DLC files are what we are really after, since we can flash our own content to Furby by modifying the original DLC files or creating our own. Analysis of Furby's Bluetooth communication shows that these DLC files get flashed to the toy in their raw format, so we only need to figure out a way to decode these files and eventually inject our own content, see [the documentation page about DLC files](dlcformat.md).
