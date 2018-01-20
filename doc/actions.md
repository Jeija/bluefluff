# Action Sequences
## Description
Furby's behaviour is organized in a long list of action sequences, where each sequence contains corresponding speech / audio, eye movement and body movement. However, depending on the action, body and eye movement may vary when running the same action multiple times. Most of these actions are preprogrammed and cannot be changed (from my current understanding), but some of them are part of the DLC file updates.

## Triggering actions via Bluetooth
Action sequences are triggered by the a Bluetooth command to the GeneralPlus processor containing the following numbers in a hierarchical structure:
* **input**: The top-level category of the Action
* **index**: Index of the action within the input
* **subindex**: Number of the action within the index
* **specific**: Number of the specific reaction inside the subindex

Usually, the input is a larger category (like "cinema movies", "feelings" or "reactions") while the index describes different types of e.g. reactions inside the input (like reactions to food, petting, ...). The subindex can then define different ways to react (for example positive, negative, disgusted). The specific is then only used to have more diverse reactions and make Furby less repetitive, although all of the actions have more or less the same meaning.

However, this hierarchy can also be used in different ways. When playing songs in the movie theater for instance, the specific numbers define the chronological order of actions.

## List
As there are so many actions, they are now contained on a seperate [Action List Page](actionlist.md), broken down by category.
