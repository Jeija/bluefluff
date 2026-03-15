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
    && rm -rf /var/lib/apt/lists/*

# Install simple static web server
RUN npm install -g http-server

# Prevent bluez from taking exclusive control of adapter
ENV NOBLE_HCI_DEVICE_ID=0
ENV NOBLE_REPORT_ALL_HCI_EVENTS=1

# Create app directory
WORKDIR /opt

# Clone repo
RUN git clone https://github.com/Jeija/bluefluff.git

# Install Node dependencies
WORKDIR /opt/bluefluff/fluffd
RUN npm install

# Expose fluffd HTTP API
EXPOSE 3872
EXPOSE 8000

# Start UI server + fluff daemon
WORKDIR /opt/bluefluff
CMD sh -c "http-server fluffd-client -p 8000 & node fluffd/fluffd.js"
