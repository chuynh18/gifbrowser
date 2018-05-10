Gif browser readme
==================

Hello, this is a quick and dirty readme for my quick and dirty Giphy API homework assignment.

I belted this out immediately after getting home on the day the assignment was given.  There are a lot of unimplemented features that I won't get to (I was too busy making the Darth Plagueis the Wise thing instead.  **No regrets AT ALL**.)  https://chuynh18.github.io/tragedy/

Known issues
------------

This project is not mobile repsonsive *AT ALL*.  In fact, it's probably a horrible user experience if the browser window is even a tiny bit thin horizontally.  I was thinking about making the div where the buttons sit feature horizontal scrolling for mobile resolutions; ideally, this would mean that the page width was such that the page itself would not need to be scrolled horizontally.  Only the div with the buttons would scroll side-to-side.

I added in some extra functionality not called out in the requirements, such as the ability to delete gif search buttons.  I also made it obvious to the user whenver they were in "delete" mode.  However, there is an edge case.  I store how many times each button has been clicked as an attribute.  This way, every time any button is clicked, new gifs will be retrieved.  However, if the user deletes and recreates a button, the offsets are lost, and duplicate gifs will be displayed.  I believe I could fix this fairly easily by storing the offset external to the button.

Other notes and closing thoughts
--------------------------------

My motivation was fairly low for this assignment, as I felt like it didn't require me to really think about any new logic.  However, gifs are always fun, so there's that.

Major off-topic digression
--------------------------

Also, by doing the Darth Plagueis the wise thing, I had a lot of fun, and learned a little more about a bunch of things...  browser compatibility with audio formats is one example (I chose to encode the audio with Vorbis inside webm containers; Chrome and Firefox play nice, Microsoft browsers do not).  I also learned that the trend of essentially deprecating autoplay is something that web devs will have to think about.  Well, more like they have to take action now, with Google's recent decision in Chrome.  Mobile browsers are also fairly aggressive at curbing autoplay for obvious reasons (limited data plans, the likelihood that autoplay would be a distration given that phones are used in public places, etc.)

I also did something in the Darth Plagueis the Wise page that I'm fairly proud about.  I thought it was the first clever idea I got while programming.  Originally, I stored Palpatine's lines in an array of objects.  Each object contained the text for the line and the path to the corresponding audio file.  The amount of delay for each line was fixed, as with the delays for periods and commas.  However, humans do not speak at a constant rate, and actors are even less likely to do so.  So, I added the delays for periods, commas, and after each line to the object.  This meant that every line could have different delay lengths.  However, I wanted to actually change the speed that the text was displayed at arbitrary points.  More precisely, this meant changing the delay after each character (milliseconds per character aka delay per character is obviously simply the inverse of characters per second aka speed.)

My first thought was to build my own "script parser" where it would recognize certain syntax as "commands" rather than text to be displayed.  This would work, but I wasn't sure I could build such a thing with my knowledge.  My next thought was to add keys to each object that would act as pointers to the next audio file and next text line, respectively.  In effect, I would be hacking in the concept of linked lists to my array of objects.  I didn't want to do this, because the idea is obviously pretty kludgy and fragile.  If I wanted to add a new line in the middle, I would have to manually update all the IDs in subsequent objects.  Ew.

My realization was that I could have the function that handles the display of text and audio look for the presence of absence of the audio key in each object.  If it detected an audio key, it'd clear out the text, as semantically, this would be starting a new line (line in the sense of actor's lines).  However, in the absence of an audio key, the program will only append a space to the existing line being displayed.  It still is reading from the next object in the array, meaning it's looking at brand new delay values for characters, commas, periods, and end-of-line.  This allows me to vary the rate of delivery mid-line (once again, "line" in the sense of actor's lines).  I thought this was a clever and elegant solution, relatively speaking, as it allows me to continue to use my existing functions almost unmodified.  I only had to add in the conditiona to check for the presence or absence of the audio key.  I can continue to use my existing logic of incrementing the index number, and I can add in new lines of text without having to modify the program behavior.