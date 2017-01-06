# Nordic Commands and Responses
Just like with the GeneralPlus characteristics, the first byte in the array determines the type of action / information while the other bytes are the actual content of that information. The following lists are incomplete!

## Commands
Commands are sent from the App to Furby's NordicWrite characteristic. The following list has been compiled from information in Furby Connect World's `libFluff.so`, by sniffing BLE traffic and by trial and error:
* `0x01`: Get firmware version, responds with a FirmwareVersion packet
* `0x03`: Get power report, responds with ReportPower packet
* `0x04`: Communication test. Takes two bytes as parameters and responds with CommTest packet and the the *inverse* of the two parameter bytes.
* `0x06`: Responds with GotTimeStamp, I don't know what this is for yet
* `0x07`: Makes Furby disconnect, not sure if intentional
* `0x08`: Responds with `0x08`, I don't know what this is for
* `0x09`: Takes parameters `0x01:0x00` (enable) or `0x00:0x00` (disable). Enables or disables GotPacketAck responses from Nordic while writing to FileWrite characteristic.
* `0x0e`: I have no idea, but answers with `0x0e` response

## Responses
Responses are notifications send by the NordicListen characteristic to the App.
* `0x01`: Firmware version, for me that is `0x19:0x00:0x00:0x00`
* `0x03`: ReportPower, not sure what this is for, always answers `0x00` for me
* `0x04`: Commtest, answer to `0x04` command
* `0x06`: GotTimeStamp, I don't know what this is for yet
* `0x09`: GotPacketAck, seems to indicate when Furby received data on the FileWrite characteristic. Has one byte as a parameter, possibly the number of packets it has received since the last report.
* `0x0a`: GotPacketOverload, sent if too many FileWrite packets have been received in a too short amount of time to be processed.
* `0x0d`: GotCurrentConnParam, I don't know where this is used yet.
* `0x0e`: I have no idea, always contains `0x0c:0x00` for me
