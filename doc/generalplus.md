# GeneralPlus Commands and Responses
GeneralPlus commands and responses are the values written to / read from the GeneralPlusWrite / GeneralPlusListen characteristics of Fluff service. These values are arrays of bytes, where the first byte in the array determines the type of action / information while the other bytes are the actual content of the packet. The following lists are incomplete!

## Commands
| Identifier | Function | Parameters | Result / Explanation |
|------------|----------|------------|----------------------|
| `0x10` | Trigger action by input | `00:Input` | Trigger random action by action sequence input. Index, subindex and specific are randomly chosen. |
| `0x11` | Trigger action by index | `00:Input:Index` | Trigger random action by action sequence input and index. Subindex and specific are randomly chosen. |
| `0x12` | Trigger action by subindex | `00:Input:Index:Subindex` | Trigger random action by action sequence input, index and subindex. Specific is randomly chosen. |
| `0x13` | Trigger specifc action | `00:Input:Index:Subindex:Specific` | Trigger actions precisely defined by its specific. |
| `0x14` | Set Antenna Color | Antenna color RGB value, 3 bytes for red, green and blue | |
| `0x20` | Furby Message | 1 byte for different actions | See table below |
| `0x24` | Set Moodmeter | 3 bytes: action, type and value | Set Furby's mood, such as Fullness, Wellness etc. `action` can be 1 to set the value or 0 or the increase the value. Type can be 0=Excitedness, 1=Displeasedness, 2=Tiredness, 3=Fullness, 4=Wellness. Value is the new value to be set / the increase.
| `0x31` | Set Notifications | ?? | Seems to set some "Blue Antenna" notifications, e.g. for the egg machine. Responds with FurbyMessage `20:1b` "CustomNotificationSet".
| `0x46` | ?? | ?? | Answers `20:0d` "SequenceCancalled", but doesn't actually do anything. |
| `0x53` | Delete File ?? | ?? | Triggers `0x53` response packet |
| `0x54` | Get File Size ?? | ?? | Triggers `0x54` response packet |
| `0x55` | Get Checksum ?? | ?? | Triggers `0x55` response packet |
| `0x56` | ?? | ?? | Triggers `0x56` response packet |
| `0x57` | ?? | ?? | Triggers `0x57` response packet |
| `0x58` | ?? | ?? | Triggers `0x58` response packet |
| `0x60` | Load DLC | 1 byte, DLC slot | Load DLC for activation, responds with `0xdc` packet |
| `0x61` | Activate loaded DLC | none | Makes content of DLC accessible and changes value on DLC slot debug menu screen to "3". Responds with `0xdc` packet. |
| `0x62` | Deactivate active DLC. | 1 byte, DLC slot | Makes content of DLC inaccessible without deleting the slot content. Changes value on DLC slot debug screen to "2" and responds with `0xdc` packet. |
| `0x70` | ?? | ?? | Responds with a `0x56` packet |
| `0x71` | ?? | ?? | Responds with a `0x57` packet |
| `0x72` | Get slot allocation information | none | Get information on Furby's DLC slot states, answers with `0x72` packet |
| `0x73` | Get information on one specific DLC Slot | 1 byte, presumably the slot number | Answers with a `0x73` packet |
| `0x74` | Delete DLC slot contents | 1 byte, the slot to delete | Marks DLC slot as deleted and answers with `0x74` |
| `0xbc` | ?? | 1 byte, enable (1) or disable (0) | Not observed, only found references to this, called "BodyCam". Triggers `20:15` / `20:16` response. |
| `0xdb` | Cycle through LCD debug menu | none | There are 7 different debug menus: Furby mood, RTC and BLE overview, Accelerometer, Microphone, Furby-to-Furby (F2F), DLC slots and notification timings |
| `0xe0` | ?? | ?? | Has something to do with Group activation. Sending `e0:00:00:00:00` results in a "Group not active" (`20:19`) when executing actions, sending `e0:00:00:00:01` fixes that.
| `0xe1` | ?? | ?? | ?? / Triggers `0xe0` response.
| `0xe2` | ?? | ?? | Causes a TimedGroupSet (`20:1a`) FurbyMessage response
| `0xe3` | ?? | none | Responds with `0xe0` packet. |
| `0xf0` | ?? | ?? | Responds with `0xf0` packet. |
| `0xf2` | ?? | Probably 1 byte | Responds with `f2:00` or `f2:00`. Might have something to do with Furby-to-Furby communication. |
| `0xfe` | Get GeneralPlus firmware version | none | Responds with `0xfe` packet |

### FurbyMessages (Commands)
* `20:01` … Triggers `20:05` `20:01` once
* `20:02` … Triggers `20:02` `20:04` once
* `20:05` … Disconnect
* `20:06` … Returns ImHereSignal
* `20:07` … Disconnects?
* `20:08` … Disconnects?
* `20:0a` … Triggers 20:0e
* `20:0b` … Triggers 20:0d
* `20:0c` … Triggers 23:08
* `20:0d` … Triggers continuous sensor data stream from accelerometer (`0x21` data)
* `20:0e` … Stops continous datastream triggered by 20:0d
* `20:0f` … Triggers 25:00 (get language)
* `20:10` … Responds with FurbiesMet

## Responses
| Identifier | Name / Function | Contents | Explanation |
|------------|-----------------|----------|-------------|
| `0x20` | FurbyMessage | 1 byte | See table below for detailed information |
| `0x21` | Antenna / Sensor / Movement status | 7 bytes | Should be easy to decode |
| `0x22` | ImHereSignal | 18 bytes | Probably contains information about mood / personality |
| `0x23` | CurrentMode | ?? | ?? |
| `0x24` | FileTransferMode | 1 byte | See table below for detailed information |
| `0x25` | Language | 1 byte | `0x00` seems to be for english-speaking Furbies |
| `0x26` | FurbiesMet | ?? | Triggered by `20:10` |
| `0x53` | ?? | ?? | ?? |
| `0x54` | GotFileSize | ?? | ?? |
| `0x55` | GotFileChecksum | ?? | ?? |
| `0x56` | ?? | ?? | ?? |
| `0x57` | ?? | ?? | ?? |
| `0x72` | SlotsInfo | ?? | Seem to contain some information on the current DLC slot occupation. |
| `0x73` | GotSlotInfoByIndex | ?? | ?? | ?? |
| `0x74` | GotDeleteSlotByIndex | ?? | ?? |
| `0xdc` | ReportDLC | ?? | ?? |
| `0xfe` | GPLFirmwareVersion | 1 byte, firmware version | `0x04` for me, probably firmware version of GeneralPlus chip |
| 0xf0 | ?? | ?? | ?? |
| 0xf2 | ?? | ?? | ?? |

### FileTransferModes
* `24:01` … FileAlreadyExists, EndCurrentTransfer
* `24:02` … ReadyToReceive
* `24:03` … FileTransferTimeout
* `24:04` … ReadyToAppend
* `24:05` … FileReceivedOk
* `24:06` … FileReceivedErr

### FurbyMessages (Responses)
* `20:01` … EnteredNamingMode (triggered by `20:05`)
* `20:02` … ExitedNamingMode (not observed yet)
* `20:03` … Furby named signal (not observed yet)
* `20:04` … Entered app mode (triggered by 20:02)
* `20:05` … Exited App Mode (not observed yet)
* `20:06` … ResponsePlayed
* `20:07` … SpeechPlaying
* `20:08` … SlaveAck
* `20:0a` … Mask added (not observed, not the sleep mask)
* `20:0b` … Mask removed (not observed, not the sleep mask)
* `20:0c` … SequencePlaying
* `20:0d` … SequenceCancelled (answer to `46:something`)
* `20:0e` … SequenceEnded
* `20:0f` … Requested Sequence Input out of Range
* `20:10` … Requested Sequence Index out of Range
* `20:11` … Requested Sequence SubIndex out of Range
* `20:12` … Requested Sequence Specific out of Range
* `20:13` … Sleep Mask added
* `20:14` … Sleep Mask remove
* `20:15` … BodyCam on (triggered by `bc:01`)
* `20:16` … BodyCam on (triggered by `bc:00`)
* `20:17` … LCD Eyes on (triggered by `cd:01`)
* `20:18` … LCD Eyes off (triggered by `cd:00`)
* `20:19` … Group not active (triggered when calling `e0` with zeros and then starting an action)
* `20:1a` … TimedGroupSet (Answered to `e2:something`)
* `20:1b` … CustomNotificationSet (Answered to `31:something`)
