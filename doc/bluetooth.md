# Furby's Bluetooth Communication
## Bluetooth Low Energy
Furby doesn't use regular "old" Bluetooth, but the newer Bluetooth Low Energy (BLE) or Bluetooth Smart standard. This means his functionality is exposed through a hierarchical structure called Generic Attribute Profile (GATT).

GATT defines services (conventially used for the different functions of a product, think of something like a "Heart Rate" and a "Current Time" service on a BLE-enabled smartwatch) that contain characteristics (different attributes of a service, e.g. sensor location and actual heart rate are properties of the "Heart Rate" service) which can be read and written to. Services and Characteristics are uniquely identified by their UUID.

## Furby's services and characteristics
### GATT hierarchy
Furby Connect exposes the following services and characteristics:

* Service `1800` "Generic Access", with characteristics:
	* Characteristic `2a00` "Device Name" (R/W)
	* Characteristic `2a01` "Appearance" (R)
	* Characteristic `2a04` "Peripheral Preferred Connection (R)
* Service `1801` "Generic Attribute", with characteristics:
	* Characteristic `2a05` "Service Changed" (Indicate)
* Service `180a` "Device Information", with characteristics:
	* Characteristic `2a29` "Manufacturer Name" (Read)
	* Characteristic `2a24` "Model Number" (Read)
	* Characteristic `2a25` "Serial Number" (Read)
	* Characteristic `2a27` "Hardware Revision" (Read)
	* Characteristic `2a26` "Firmware Revision" (Read)
	* Characteristic `2a28` "Software Revision" (Read)
* Service `000015301212efde1523785feabcd123`, probably [Nordic nRF 51 DFU OTA](http://developer.nordicsemi.com/nRF51_SDK/nRF51_SDK_v7.x.x/doc/7.2.0/s110/html/a00071.html#ota_spec_number) updater, with characteristics:
	* Characteristic `000015321212efde1523785feabcd123` DFU packet (W)
	* Characteristic `000015311212efde13785feabcd123` DFU control (W/notify)
	* Characteristic `000015341212efde1523785feabcd123` ?? (R)
* Service `dab91435b5a1e29cb041bcd562613bde`, "Fluff" characteristic for interfacing with Furby's Nordic and GeneralPlus microprocessors:
	* Characteristic `dab91382b5a1e29cb041bcd562613bde` "GeneralPlusListen" (R/notify)
	* Characteristic `dab91383b5a1e29cb041bcd562613bde` "GeneralPlusWrite" (R/W)
	* Characteristic `dab90756b5a1e29cb041bcd562613bde` "NordicListen" (R/notify)
	* Characteristic `dab90757b5a1e29cb041bcd562613bde` "NordicWrite" (R/W)
	* Characteristic `dab91440b5a1e29cb041bcd562613bde`, mysterious characteristic 1, (R/notify)
	* Characteristic `dab91441b5a1e29cb041bcd562613bde`, mysterious characteristic 2, (R/W)
	* Characteristic `dab90755b5a1e29cb041bcd562613bde`, "RSSIListen" (R/notify)
	* Characteristic `dab90758b5a1e29cb041bcd562613bde`, "FileWrite" (R/W)

### Fluff service
The interesting service here is the fourth one, `dab91435b5a1e29cb041bcd562613bde`, which I will refer to as the "Fluff" Service. This service controls everything specifically related to the Furby. The other services appear to only be part of a standard Bluetooth Low Energy implementation using a nRF 51 series SoC from Nordic Semiconductor.

Warning: The Service UUIDs seem to look all the same, but look closely and you will see that they actually differ in their third and fourth byte!

#### GeneralPlus characteristics
* GeneralPlusWrite can be used to send commands to the Furby. Commands are a simple array of bytes with a maximum length of 20. The first byte in the array determines the kind of command you want to send (e.g. "Set Antenna LED Color", "Start Action Sequence", "Set Name") while the other bytes are parameters for the command. See [the list of GeneralPlus commands / responses](generalplus.md) for more information.
* GeneralPlusListen can be "subscribed" to in order to make Furby report new sensor values or responses to commands written to GeneralPlusWrite. Once again, the first byte in the array determines the type of answers, see [the list of GeneralPlus commands / responses](generalplus.md) for details.

#### Nordic characteristics
NordicListen and NordicWrite are basically the Nordic Semiconductor SoC counterpart to GeneralPlusWrite / GeneralPlusListen with a smaller subset of commands and responses relevant for bluetooth communication and especially DLC file transfer. See [the list of nordic commands and respones](nordic.md) for details.

#### The FileWrite characteristic
The BLE connection is not only used for commands and sensor data, but also for transferring the DLC update files from the Furby Connect World App to Furby's memory. The file transfer is initialized and managed by GeneralPlusWrite / GeneralPlusListen commands and responses, while the actual files are being sent to the FileWrite characteristic. The transfer speed control is handled by the NordicWrite and NordicListen characteristics.

After the initialization of the transfer, the App just sends the raw contents of the DLC file to the FileWrite characteristic in their correct order, without any kind of packet header. This is probably to save space, since the single packets are only 20 bytes long and the realistic throughput is only ~4kB/s, since BLE is a slow protocol that was not intended for this kind of usage.

#### Other characteristics
* The RSSIListen, given its name, seems to have something to do with signal strength indication, but I haven't been able to make use of that yet, just subscribing doesn't automatically report any data. But I also haven't really tried, so it might actually do something.
* I don't know what the two mysterious characteristics (one of them for reading, the other one for writing) are used for, but I haven't seriously investigated that. My assumption would be that they are for Furby-to-Furby ("F2F") communication, so that two Furbies next to each other can exchange information such as their name and synchronize their actions like singing together.
