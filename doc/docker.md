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
[+] Building 63.5s (13/13) FINISHED                                                                              docker:default
 => [internal] load build definition from Dockerfile                                                                       0.0s
 => => transferring dockerfile: 832B                                                                                       0.0s
 => [internal] load metadata for docker.io/library/node:16-bullseye                                                        1.3s
 => [auth] library/node:pull token for registry-1.docker.io                                                                0.0s
 => [internal] load .dockerignore                                                                                          0.0s
 => => transferring context: 2B                                                                                            0.0s
 => [1/7] FROM docker.io/library/node:16-bullseye@sha256:cd59a61258b82b86c1ff0ead50c8a689f6c3483c5ed21036e11ee741add419eb  0.1s
 => => resolve docker.io/library/node:16-bullseye@sha256:cd59a61258b82b86c1ff0ead50c8a689f6c3483c5ed21036e11ee741add419eb  0.1s
 => [internal] load build context                                                                                          0.0s
 => => transferring context: 7.19kB                                                                                        0.0s
 => CACHED [2/7] RUN apt-get update && apt-get install -y     bluetooth     bluez     libbluetooth-dev     libudev-dev     0.0s
 => CACHED [3/7] WORKDIR /opt                                                                                              0.0s
 => [4/7] COPY . /opt/bluefluff                                                                                            0.1s
 => [5/7] WORKDIR /opt/bluefluff/fluffd                                                                                    0.1s
 => [6/7] RUN npm install                                                                                                 45.8s
 => [7/7] WORKDIR /opt/bluefluff                                                                                           0.3s 
 => exporting to image                                                                                                    15.5s 
 => => exporting layers                                                                                                    7.2s 
 => => exporting manifest sha256:746160d22fca925d59082c2dbf2651e870c4c30bfa510f839636e7a1de1552e1                          0.0s 
 => => exporting config sha256:bac7f2ec9107f65ebf8b7574da3a50532b3ad023b7310cbad9b06b66503e31b9                            0.0s 
 => => exporting attestation manifest sha256:c3aea3a7060dd2b018610c8807a8edb7ccf3669a5aa6ba35aaa6fc4518ecdb8d              0.1s 
 => => exporting manifest list sha256:e4403e343d051bafdb7625bfc99249d3fc999f2ad039ea7905e097165ff75cab                     0.0s
 => => naming to docker.io/library/bluefluff:latest                                                                        0.0s
 => => unpacking to docker.io/library/bluefluff:latest                                                                     8.1s
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
> **Note:** If you see a warning like `noble: Initialization of USB device failed: ENODEV, No such device` this means there may be an issue with your bluetooth adapter. It may not be turned on or may be soft-blocked.


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

