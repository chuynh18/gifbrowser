"use strict";

var deleteButtonsMode = false;
var deleteGifsMode = false;
var receivedGifs;

// When the user scrolls the page, execute myFunction
window.onscroll = function() {myFunction()};

// Get the header
var header = document.getElementById("myHeader");

// Get the offset position of the navbar
var sticky = header.offsetTop;

// Add the sticky class to the header when you reach its scroll position. Remove "sticky" when you leave the scroll position
function myFunction() {
  if (window.pageYOffset >= 150) {
    header.classList.add("sticky");
  } else {
    header.classList.remove("sticky");
  };
};

// this stores the default gif searches
var topics = ["cool 3d world", "sfm", "prequel memes", "computational fluid dynamics", "finite element analysis", "bad cgi"];

// this stores the names of the buttons the user added
var userAddedTopics = [];

$(function() {

    // this appends the default gif searches
    for (var i = 0; i < topics.length; i++) {
        var gifButton = $("<div>");
        gifButton.addClass("searchGif");
        gifButton.attr("value", topics[i]);
        gifButton.attr("offset", 0);
        gifButton.text(topics[i]);
        $("#button").append(gifButton);
    }

    // guard against abuse cases
    $("#buttonAdd").on("click", function(event) {
        var buttons = $("<div>");
        var enteredText = $("#gifInput").val();

        event.preventDefault();
        if (enteredText === "") {
            alert("Enter some text first!");
        }
        else if (enteredText.length > 60) {
            alert("Don't try to break my page!  Does your search really need to be that long?  60 characters ought to be enough for anybody.")
        }
        else if (topics.indexOf(enteredText) > -1 || userAddedTopics.indexOf(enteredText) > -1) {
            alert("That button already exists.")
        }
        else {
            buttons.text(enteredText);
            buttons.attr("value", enteredText);
            buttons.attr("offset", 0);
            buttons.addClass("searchGif");
            $("#button").append(buttons);
            $("#gifInput").val("");
            if (userAddedTopics.indexOf(enteredText) === -1 && topics.indexOf(enteredText) === -1) {
                userAddedTopics.push(enteredText);
            };
        };
    });

    // this is the actual API call, limiting to 10 gifs to mitigate hitting rate limit
    var searchGifOnClick = function(offset) {

        // this is where the magic on the client side happens
        var giphy = $(this).attr("value");
        var queryURL = "https://api.giphy.com/v1/gifs/search?q=" + giphy + "&api_key=PWuJeLENc0xCg38ONwNbgjIcGzyPXnyO&limit=10&offset=" + ($(this).attr("offset"))*10;
        console.log(queryURL);
        
        // Creates AJAX call to Giphy
        $.ajax({
        url: queryURL,
        method: "GET"
        }).then(function(response) {
            console.log(response);

            receivedGifs = response;

            for (var i = 0; i < receivedGifs.data.length; i++) {
                var gifDiv = $("<div>");

                var gifImage = $("<img>");
                gifImage.attr("src", receivedGifs.data[i].images.fixed_height.url);
                gifImage.attr("animated", receivedGifs.data[i].images.fixed_height.url);
                gifImage.attr("still", receivedGifs.data[i].images.fixed_height_still.url);
                gifImage.attr("alt", receivedGifs.data[i].title);
                gifImage.addClass("gif");
                gifImage.attr("animationState", "animated");

                var gifInfo = $("<div>");
                gifInfo.append("<b>Title:</b> ", receivedGifs.data[i].title);
                gifInfo.append("<br><b>Rating:</b> ", receivedGifs.data[i].rating);

                gifDiv.append(gifImage);
                gifDiv.append(gifInfo);
                gifDiv.addClass("giphyGif");
                gifDiv.css({"display": "inline-block", "margin": "10px 20px"});

                $("#gifs").prepend(gifDiv);
            };

        });
        // this increments the offset of the clicked div by 1 each time the div is clicked
        // every time the same button is clicked, NEW gifs are retrieved, NOT DUPES!  MAGICAL!
        var tempOffset = $(this).attr("offset");
        tempOffset++;
        $(this).attr("offset", tempOffset);
    
    };

    // the thing that actually listens for the click
    $(document).on("click", ".searchGif", searchGifOnClick);

    // this is the function that removes GIF search buttons
    var deleteModeOn = function() {
        $(this).remove();
        console.log($(this)[0]);
        console.log($(this)[0].textContent);
        if (topics.indexOf($(this)[0].textContent) > -1) {
            topics.splice(topics.indexOf($(this)[0].textContent), 1);
        }
        if (userAddedTopics.indexOf($(this)[0].textContent) > -1) {
            userAddedTopics.splice(userAddedTopics.indexOf($(this)[0].textContent), 1);
        }
    };

    // this function toggles between making the gif search buttons remove themselves or searching for gifs
    // it works by creating the proper on click event handler while deleting the other one
    $(document).on("click", "#deleteMode", function() {
        if (deleteButtonsMode === false) {
            deleteButtonsMode = true;
            $(document).off("click", ".searchGif", searchGifOnClick);
            console.log("Remove gif search button on click: " + deleteButtonsMode);
            $("#deleteMode").css("background-color", "red");
            $(".searchGif").css("background-color", "orange");
            $(document).on("click", ".searchGif", deleteModeOn);
        }
        else if (deleteButtonsMode === true) {
            deleteButtonsMode = false;
            $("#deleteMode").css("background-color", "lightcyan");
            $(".searchGif").css("background-color", "green");
            console.log("Remove gif search button on click: " + deleteButtonsMode);
            $(document).on("click", ".searchGif", searchGifOnClick);
            $(document).off("click", ".searchGif", deleteModeOn);
        };
    });

    // this is for deleting gifs
    var deleteGifsOn = function() {
        $(this).remove();
    };

    // this makes it so we delete gifs when delete mode is on and user clicks a gif
    $(document).on("click", "#deleteGif", function() {
        if (deleteGifsMode === false) {
            deleteGifsMode = true;
            $("#deleteGif").css("background-color", "red");
            console.log("Remove individual GIFs on click: " + deleteGifsMode);
            $(document).on("click", ".giphyGif", deleteGifsOn);
        }
        else if (deleteGifsMode === true) {
            deleteGifsMode = false;
            $("#deleteGif").css("background-color", "lightcyan");
            console.log("Remove individual GIFs on click: " + deleteGifsMode);
            $(document).off("click", ".giphyGif", deleteGifsOn);
        };
    });

    // this function ensures the appropriate instructional message is always displayed
    $(document).on("click", function() {
        if ($("#button").children().length === 0) {
            $("#deleteModeMessage").html("<font color='red'><b>You've removed all the buttons.</b>  Add buttons to search for GIFs!</font>")
        }
        else if (deleteButtonsMode === true) {
            $("#deleteModeMessage").html("<font color='red'><b>Delete mode enabled.</b>  You can remove search buttons by clicking on them.</font>")
        }
        else if (deleteButtonsMode === false) {
            $("#deleteModeMessage").html("<font color='white'>Click a button above to retrieve GIFs!</font>")
        };
    });

    // careful, this clears the page of GIFs
    $(document).on("click", "#deleteAllGifs", function() {
        var input = prompt('Wipe all GIFs from the page?  Type "Wipe them out, all of them" to confirm.');
        if (input === "Wipe them out, all of them") {
            $("#gifs").empty();
            // this resets all the button offsets to 0
            // otherwise the user wouldn't be able to see the same gifs unless they refresh the page
            $(".searchGif").attr("offset", 0);
            console.log("Execute:  Order 66.  On a more lighthearted note, button offsets were also reset to 0.")
        }
        else {
            console.log("ABORT:  the page will NOT be wiped.");
        }
    });

    // click a gif to toggle play/pause
    $(document).on("click", ".gif", function() {
        if (deleteGifsMode === false) {
            if ($(this).attr("animationState") === "still") {
            $(this).attr("animationState", "animated");
            $(this).attr("src", $(this).attr("animated"));
            console.log($(this).attr("src") + " set to " + $(this).attr("animationState"));
            }

            else if ($(this).attr("animationState") === "animated") {
            $(this).attr("animationState", "still");
            $(this).attr("src", $(this).attr("still"));
            console.log($(this).attr("src") + " set to " + $(this).attr("animationState"));
            };
        };
    });

// this belongs to jQuery's document ready    
});