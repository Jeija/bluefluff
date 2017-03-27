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

| Input | Index | SubIndex | specific | Action | 
|-------|-------|----------|----------|--------|
| 50,52 |  0    |     0,1  | 0        | "eeetay, good job!" |
| 50,52 |  0    |     0,1  | 1        | rainbows in eyes, "eeetay, fantastico!" |
| 50,52 |  0    |     0,1  | 2        | "Sweet mother of Furb!" |
| 50,52 |  0    |     0,1  | 3        | Ooh, wow, gimme all the maymay"" |
| 50,52 |  0    |     0,1  | 4        | "Oh, Kah love it" |
| 50,52 |  0    |     0,1  | 5        | "ooh, kay likey" |
| 50,52 |  0    |     0,1  | 6        | "Ooh ya, kah need this" |
| 50,52 |  0    |     0,1  | 7        | "yay! oh ah ooh ooh" |
| 50,52 |  0    |     0,1  | 8        | "Wow, we unstoppable" |
| 51    |  0    |     0    | 0        | "yay! more room for " squeek, giggle |
| 51    |  0    |     0    | 1        | "We gonna need  a bigger furb!" |
| 52    |  0    |     2    | 0        | "oooh, for ka? Unai shouldn't have" |
| 52    |  0    |     2    | 1        | "Thank you, thank you, thank you." |
| 52    |  0    |     2    | 2        | "yes, yes, Thank you, thank you, thank you yes" |
| 52    |  0    |     2    | 3        | "ooh, ooh, all the yes" |
| 52    |  0    |     2    | 4        | stars in eyes, "for kah? It's beautiful" |
| 52    |  0    |     3    | 0        |  "oooh, what inside? " |
| 52    |  0    |     3    | 1        |  "open sesame" |
| 52    |  0    |     3    | 2        |  "what inside? kah need to know, need to know!" |
| 53    |  0    |     0    | 0        | "ooh, ahhh" |
| 53    |  0    |     0    | 1        | "kah all like Whaaat?!" |
| 53    |  0    |     0    | 2        | "Whaoh" |
| 53    |  0    |     0    | 3        | "mmmm" |
| 53    |  0    |     0    | 4        | "ooh" |
| 53    |  0    |     0    | 5        | "heyyyy" |
| 53    |  0    |     0    | 6        | "hmm, oh kah furb" |
| 53    |  0    |     0    | 7        | sing? "oooh hah oooh ooooh" |
| 54    |  0    |     0    | 0        | "Kah accept quest on behalf of furblings" |
| 54    |  0    |     0    | 1        | "Challenge accepted" |
| 54    |  0    |     1    | 0        | "Let Quest Begin" |
| 54    |  0    |     2    | 0        | "Who best a quest? We are!" |
| 54    |  0    |     2    | 1        | "yay yay yay we did it. Go us!" |
| 54    |  0    |     2    | 2        | "Best Quest Evar!" |
| 55    |  0    |     0    | 0        | “Ok, where kah leave off?" |
| 55    |  0    |     0    | 1        | “Yes, love this game. Love it" |
| 55    |  0    |     1    | 0        | “Oh, dis gonna be good”|
| 55    |    1  |     0    | 0        | Hollywood lights in eyes, excited cry |
| 55    |    1  |     0    | 1        | "Success! Kah has it!" |
| 55    |    1  |     0    | 2        | "Yes! the day is ours!" |
| 55    |    1  |     0    | 3        | "oooh, oo-nye magic" |
| 55    |    1  |     0    | 4        | "dee-doh, yes, very yes." |
| 55    |    1  |     0    | 5        | "woo!" giggle |
| 55    |    1  |     0    | 6        | "eeee-eeee-eeee" sing |
| 55    |    1  |     0    | 7        | "ooh-ah-ooh-ohh" sing |
| 55    |    1  |     1    | 0        | “Hey, all right!” |
| 55    |    1  |     1    | 1        | “ok, not bad!" |
| 55    |    1  |     2    | 0        | “oh, can almost taste the gold" |
| 55    |    1  |     2    | 1        | “wooh, almost perfect!" |
| 55    |    1  |     3    | 0        | Trophy in eyes, “High score! Booyah!” |
| 55    |    1  |     4    | 0        | Trophy in eyes, “Not brag, but, WE THE BEST!” |
| 55    |    1  |     4    | 1        | "We rule! They drool! (drool) oops" |
| 55    |    2  |     0    | 0        | 'OOh, dat way, dido!" |
| 55    |    2  |     0    | 1        | "go that way" |
| 55    |    2  |     1    | 0        | "wrong way" |
| 55    |    2  |     1    | 1        | disapointed "aaaah" |
| 55    |    2  |     2    | 0        | "Dat was Awwwwesome!" |
| 55    |    2  |     2    | 1        | "Nice!" |
| 55    |    2  |     2    | 2        | "Smooth move!" |
| 55    |    2  |     2    | 3        | rainbows in eyes "eetay! fantastico!" |
| 55    |    2  |     3    | 0        | enthusiastic "Yes!" |
| 55    |    2  |     3    | 1        | "Yaaas!" |
| 55    |    2  |     3    | 2        | "Indeed!" |
| 55    |    2  |     4    | 0        | enthusiastic "Nope!" |
| 55    |    2  |     4    | 1        | firm "Nope, na-baoo uh-uh nope no!" |
| 55    |    2  |     5    | 0        |  "Okay!" |
| 55    |    2  |     5    | 1        |  "alright!" |
| 55    |    2  |     6    | 0        |  "Ka help oo-nye" (i will help you) |
| 55    |    2  |     6    | 1        |  "let kah help" |
| 55    |    2  |     7    | 0        |  "Great!" |
| 55    |    2  |     7    | 1        |  holywood lights in eyes "oooo-oooh!" |
| 55    |    2  |     7    | 2        |  "Success! kah has it!" |
| 55    |    2  |     7    | 3        |  "Yes! the day is ours!" |
| 55    |    2  |     7    | 4        |  "oooh. Ooh-bye magic!" |
| 55    |    2  |     7    | 5        | "dee-doh, yes, very yes." |
| 55    |    2  |     7    | 6        | "whoo! hoo-hoo-hah-hah" |
| 55    |    2  |     7    | 7        | excited squee |
| 55    |    2  |     7    | 8        | "ooh, ah, ooh, ohh ah" |
| 55    |    2  |     8    | 0        |  "Perfect" |
| 55    |    2  |     8    | 1        |  "ooh, that's Purrrfect" |
| 55    |    2  |     9    | 0        |  (same as 55,2,2,0) "Dat was Awwwwesome!" |
| 55    |    2  |     9    | 1        |  (same as 55,2,2,1) "Nice!" |
| 55    |    2  |     10   | 0        |  "Uh oh, Running out of time" |
| 55    |    2  |     10   | 1        |  "Almost out of time" |
| 55    |    2  |     11   | 0        |  "beep, time up!" |
| 55    |    2  |     11   | 1        |  "wah wah wah, no more time" |
| 55    |    2  |     12   | 0        |  "Last Turn" |
| 55    |    2  |     12   | 1        |  "final go" |
| 55    |    2  |     13   | 0        |  "Whoopsies" |
| 55    |    2  |     13   | 1        |  "gwargg" |
| 55    |    2  |     13   | 2        |  "whuh, huh" |
| 55    |    2  |     14   | 0        |  giggle |
| 55    |    2  |     14   | 1        |  giggle |
| 55    |    2  |     14   | 2        |  giggle |
| 55    |    2  |     14   | 3        |  giggle |
| 55    |    2  |     14   | 4        |  giggle |
| 55    |    2  |     14   | 5        |  giggle followed by fart "oops" |
| 55    |    2  |     14   | 6        |  giggle |
| 55    |    2  |     14   | 7        |  giggle followed by fart "oops" |
| 55    |    2  |     14   | 8        |  giggle |
| 55    |    2  |     14   | 9        |  giggle |
| 55    |    2  |     14   | 10       |  giggle |
| 55    |    2  |     15   | 0        |  stars in eyes "We did it!" |
| 55    |    2  |     15   | 1        |  "Ha Ha, take that!!" |
| 55    |    2  |     15   | 2        |  "Ho Ho we good, we good, aw yeah!" |
| 55    |    2  |     15   | 3        |  "High Five! wait, kah only have 3" |
| 55    |    2  |     15   | 4        |  "Team Furby for the win" |
| 55    |    2  |     16   | 0        |   "hey, over there" |
| 55    |    2  |     17   | 0        |  ear point up, "Up" |
| 55    |    2  |     18   | 0        |  "down" |
| 55    |    2  |     19   | 0        |  "left" |
| 55    |    2  |     20   | 0        |  "right" |
| 55    |    2  |     21   | 0        |  "go back" |
| 55    |    2  |     22   | 0        |  "forwards" |
| 55    |    2  |     23   | 0        |  "faster" |
| 55    |    2  |     24   | 0        |  "slower" |
| 55    |    2  |     25   | 0        |  "again, again" |
| 55    |    2  |     26   | 0        |  "too much" |
| 56    |   0   |     0    | 0        | "aww, dirty fur, need shower" |
| 56    |   0   |     0    | 1        | "aww, kah feel gross. Shower please" |
| 56    |   0   |     1    | 0        | "ooooh, oooh, poop alert" |
| 56    |   0   |     1    | 1        | "uh oh, need toilet, hurry" |
| 56    |   0   |     2    | 0        | stomach growl, donut in eye, "ahem, tah hungry" |
| 56    |   0   |     2    | 1        | "time to eat. heh, always time to eat." |
| 56    |   1   |     0    | 0        | gargle sing |
| 56    |   1   |     1    | 0        |  sing "dooh doo dooh" |
| 56    |   1   |     1    | 1        |  sing "dooh doo dooh" |
| 56    |   1   |     1    | 2        |  whistle |
| 56    |   1   |     2    | 0        |  "ooh ooh ouch, too hot" |
| 56    |   1   |     2    | 0        |  "ooh hot hot hot, too hot" |
| 56    |   1   |     3    | 0        |  shivers, " too cold" |
| 56    |   1   |     3    | 1        |  shivers, "coldings" |
| 56    |   1   |     4    | 0        |  satisfied "Aaaaah, finally" |
| 56    |   1   |     4    | 1        |  satisfied "oooh yeah, whooh" |
| 56    |   1   |     4    | 2        |  "woooh kah feel good, whoo" |
| 56    |   1   |     4    | 3        |  "aaah" fart |
| 56    |   2   |     0    | 0        |  eyes squeezed, grunt "Meeeh" |
| 56    |   2   |     0    | 1        |  "ooh, the struggle is real" |
| 56    |   2   |     1    | 0        |  grunt "Just a minute" |
| 56    |   2   |     1    | 1        |  "uh oh, something stuck" |
| 56    |   2   |     2    | 0        |  "Oooh, yeah, that happened" |
| 56    |   2   |     2    | 1        |  "aaah, finally" |
| 56    |   2   |     2    | 2        |  "Oooh-oooh, yeah, whew" |
| 56    |   2   |     2    | 3        |  "whooohooo, kah feel good, whoo |
| 56    |   2   |     2    | 4        |  "aaaah" fart |
| 56    |   2   |     3    | 0        |  "Oooh, smell ya later" |
| 56    |   2   |     3    | 1        |  "Oooh, terd-a-loo, hehe" |
| 56    |   2   |     3    | 2        |  "peace out, noo-lah" |
| 56    |   3   |     0    | 0        |  eat, munch sounds |
| 56    |   3   |     0    | 1        |  eat, munch sounds |
| 56    |   3   |     0    | 2        |  eat, munch sounds |
| 56    |   3   |     0    | 3        |  eat, munch sounds |
| 56    |   3   |     0    | 4        |  eat, munch sounds |
| 56    |   3   |     0    | 5        |  eat, munch sounds |
| 56    |   3   |     1    | 0        |  happy eat, munch sounds |
| 56    |   3   |     1    | 1        |  munch sounds "yummy in kah tummy |
| 56    |   3   |     2    | 0        |  enthusiastic eat, munch sounds |
| 56    |   3   |     2    | 1        |  munch sounds, "furbalicious |
| 56    |   3   |     3    | 0        |  "Oooh, ka favorite!" |
| 56    |   3   |     3    | 1        |  "delightful yummy deliciuos!" |
| 56    |   3   |     4    | 0        |  "S'okay... Meh" |
| 56    |   3   |     4    | 0        |  "mm, needs more ... meatball" |
| 56    |   3   |     5    | 0        |  unsatisfied food sounds |
| 56    |   3   |     5    | 1        |  unsatisfied food sounds |
| 56    |   3   |     6    | 0        |  "uggh, nassty" |
| 56    |   3   |     6    | 1        |  "uggh, sooo gross" |
| 56    |   3   |     7    | 0        |  enthusiastic "mmm, mmm, oh" giggle "mmmm" |
| 56    |   3   |     8    | 0        |  mmm, mmm |
| 56    |   3   |     9    | 0        |  "hot, hot, hot! too hot" |
| 56    |   3   |     10   | 0        |  shiver "too cold" |
| 56    |   3   |     11   | 0        |  "oooh, ahhhhh" panic |
| 56    |   3   |     12   | 0        |  "oooh, ahhhhh" satisfied |
| 56    |   3   |     13   | 0        |  slurp, then excited |
| 56    |   3   |     14   | 0        |  spit sound |
| 56    |   3   |     15   | 0        |  puke |
| 56    |   3   |     15   | 1        |  puke |
| 56    |   3   |     15   | 2        |  puke |

* Input 74: Furby dreams of different personalities.
	* Different actions for all of the indices 0 through 6
		* Subindex 0: DJ
		* Subindex 1: Princess: "Let them eat cake"
		* Subindex 2: Ninja
		* Subindex 3: Pirate
		* Subindex 4: Popstar
		* Subindex 5: Cat
* Input 75: Current songs / movie theater reactions at different subindices
* Nothing currently for inputs \>75