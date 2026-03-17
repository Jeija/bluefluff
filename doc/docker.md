# bluefluff - dockerized
No need to install any dependencies simply satisfy the requirements below and you can run bluefluff!

```
                                                          ,
                    ##        .                          ),\
              ## ## ##       ==                         ( ) )
           ## ## ## ##      ===                  |'-.  .-"""-.  .-'|
       /""""""""""""""""\___/ ===                |.-.`/,, - ,,\'.-.|
  ~~~ {~~ ~~~~ ~~~ ~~~~ ~~ ~ /  ===- ~~~         '._ | (@) (@) | _.'
       \______ o          __/                       `|   (-)   |`
         \    \        __/                           > .'   '. <
          \____\______/                              | |     | |
                                                 jgs \ \     / /
                                                      ((()-()))     
```

## Requirements

- A Linux host with Bluetooth Low Energy support (built-in or USB BT 4.0+ adapter)
- A **Furby Connect** toy (not compatible with older Furby models)
- [Docker](https://docs.docker.com/engine/install/)

> **macOS / Windows:** BLE hardware passthrough through Docker Desktop's VM layer is not supported. This image is intended for **Linux hosts only**.

## Build the image
Not really a complex build. Simply build the docker image in the same directory where the Dockerfile is.
```bash
IMAGE='bluefluff'
docker build --tag ${IMAGE} .
```
### Expected build output
```
[+] Building 8.9s (12/12) FINISHED                                                                               docker:default
 => [internal] load build definition from Dockerfile                                                                       0.0s
 => => transferring dockerfile: 833B                                                                                       0.0s
 => [internal] load metadata for docker.io/library/node:16-bullseye                                                        0.3s
 => [internal] load .dockerignore                                                                                          0.0s
 => => transferring context: 2B                                                                                            0.0s
 => [1/8] FROM docker.io/library/node:16-bullseye@sha256:cd59a61258b82b86c1ff0ead50c8a689f6c3483c5ed21036e11ee741add419eb  0.1s
 => => resolve docker.io/library/node:16-bullseye@sha256:cd59a61258b82b86c1ff0ead50c8a689f6c3483c5ed21036e11ee741add419eb  0.1s
 => CACHED [2/8] RUN apt-get update && apt-get install -y     bluetooth     bluez     libbluetooth-dev     libudev-dev     0.0s
 => CACHED [3/8] RUN npm install -g http-server                                                                            0.0s
 => CACHED [4/8] WORKDIR /opt                                                                                              0.0s
 => CACHED [5/8] RUN git clone https://github.com/Jeija/bluefluff.git                                                      0.0s
 => CACHED [6/8] WORKDIR /opt/bluefluff/fluffd                                                                             0.0s
 => CACHED [7/8] RUN npm install                                                                                           0.0s
 => CACHED [8/8] WORKDIR /opt/bluefluff                                                                                    0.0s
 => exporting to image                                                                                                     8.3s
 => => exporting layers                                                                                                    0.0s
 => => exporting manifest sha256:5e103357148afd19991fa484c16af049fec47520d92738b332ab5eeab8e0da6a                          0.0s
 => => exporting config sha256:99caad1d55c60a7119cd89ee5ee9b51e7e444c52366f09465eff545aff937b2c                            0.0s
 => => exporting attestation manifest sha256:8489818debfba4d890de6f5fee6d63688f3fdd48a04603600684624afb6cc461              0.0s
 => => exporting manifest list sha256:60e81eed49a171aaf8ab353b1c64c903f746efcbd562e4ed24e94b8d13741e7e                     0.0s
 => => naming to docker.io/library/bluefluff:latest                                                                        0.0s
 => => unpacking to docker.io/library/bluefluff:latest                                                                     8.1s

 1 warning found (use docker --debug to expand):
 - JSONArgsRecommended: JSON arguments recommended for CMD to prevent unintended behavior related to OS signals (line 38)
```

## Run the container
Once your local image is built, you can run the container.

```bash
IMAGE='bluefluff'
docker run -it \
  --network host \
  --device /dev/bus/usb \
  --cap-add NET_ADMIN \
  --cap-add NET_RAW \
  --volume /var/run/dbus:/var/run/dbus
  ${IMAGE}
```

> **Note:** `--network host` is required so that [noble](https://github.com/sandeepmistry/noble) (the BLE library) can access raw HCI sockets. If your Bluetooth adapter hasn't initialized yet, ensure `hciconfig` shows your adapter on the host before running.

If your Bluetooth adapter is soft-blocked, unblock it first:

```bash
rfkill unblock bluetooth
```
### Expected run output
```
Starting up http-server, serving fluffd-client

http-server version: 14.1.1

http-server settings: 
CORS: disabled
Cache: 3600 seconds
Connection Timeout: 120 seconds
Directory Listings: visible
AutoIndex: visible
Serve GZIP Files: false
Serve Brotli Files: false
Default File Extension: none

Available on:
  http://127.0.0.1:8000
  http://192.168.0.196:8000
Hit CTRL-C to stop the server
```

## Accessing the Web UI

Once the container is running, open your browser to:

| Interface | URL | Description |
|---|---|---|
| **fluffd-client Web UI** | `http://localhost:8000` | Browser-based Furby control panel |
| **fluffd HTTP API** | `http://localhost:3872` | Raw HTTP API for sending BLE commands |

The web UI will automatically scan for nearby Furby Connect devices advertising over BLE and connect to them.

## Ports

| Port | Purpose |
|---|---|
| `8000` | `fluffd-client` static web UI (served via `http-server`) |
| `3872` | `fluffd` HTTP API |

