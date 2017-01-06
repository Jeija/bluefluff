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
**This is only a *tiny* excerpt of the massive amounts of actions Furby can perform. I'd be very grateful for contributions to this list!**
* …
* Input 56:
	* Index 0
		* Subindex 0: Cleaning station desire
		* Subindex 1: Toilet desire
		* Subindex 2: Eating / food cannon desire
	* Index 1: Furby cleaning station reactions
		* …
	* Index 2: Toilet reactions
		* …
	* Index 3: Food cannon reactions
		* Subindex 0: Eating sounds, solid
		* Subindex 1: Eating sounds, solid
		* Subindex 2: Food Furby "loves": Eating sounds, delicious
		* Subindex 3: Food Furby "likes": Delightful, favorite food
		* Subindex 4: Food Furby thinks is "OK": OK, Meh, needs more...
		* Subindex 5: Food Furby "dislikes": Bad food
		* Subindex 6: Food Furby "hates": Horrible food, nasty, gross
		* Subindex 7: ohohoho, mmmm
		* Subindex 8: mmmam aaah
		* Subindex 9: Reaction to hot / spicy food: "Hot, hot, hot, too hot"
		* Subindex 10: Reaction to cold food: "Too cold"
		* Subindex 11: aaaaah in panic
		* Subindex 12: aaaaah in relief
		* Subindex 13: Excitement
		* Subindex 14: Spits out
		* Subindex 15: Pukes
* …
* Input 74: Furby dreams of different personalities.
	* Different actions for all of the indices 0 through 6
		* Subindex 0: DJ
		* Subindex 1: Princess: "Let them eat cake"
		* Subindex 2: Ninja
		* Subindex 3: Pirate
		* Subindex 4: Popstar
		* Subindex 5: Cat
* Input 75: Current songs / movie theater reactions at different subindices
* Nothing currently for inputs >75
