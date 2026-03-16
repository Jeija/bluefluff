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

## Build the image
Not really a complex build. Simply build the docker image in the same directory where the Dockerfile is.
```
docker build --tag bluefluff .
```

## Requirements

- A Linux host with Bluetooth Low Energy support (built-in or USB BT 4.0+ adapter)
- A **Furby Connect** toy (not compatible with older Furby models)
- Docker

> **macOS / Windows:** BLE hardware passthrough through Docker Desktop's VM layer is not supported. This image is intended for **Linux hosts only**.

## Quick Start

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

