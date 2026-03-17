FROM node:16-bullseye

# Install BLE dependencies
RUN apt-get update && apt-get install -y \
    bluetooth \
    bluez \
    libbluetooth-dev \
    libudev-dev \
    build-essential \
    git \
    dbus \
    rfkill \
    tini \
  && npm install -g http-server \
  && rm -rf /var/lib/apt/lists/*

# Prevent bluez from taking exclusive control of adapter
ENV NOBLE_HCI_DEVICE_ID=0
ENV NOBLE_REPORT_ALL_HCI_EVENTS=1

# Create app directory and copy project in
WORKDIR /opt
COPY . /opt/bluefluff

# Install Node dependencies
WORKDIR /opt/bluefluff/fluffd
RUN npm install

# Expose fluffd HTTP API and webui
EXPOSE 3872 8000

# Start UI server + fluff daemon
WORKDIR /opt/bluefluff
ENTRYPOINT ["/usr/bin/tini","--"]
CMD ["sh","-c","http-server fluffd-client -p 8000 & exec node fluffd/fluffd.js"]
