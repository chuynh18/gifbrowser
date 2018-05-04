"use strict";

var deleteButtonsMode = false;
var deleteGifsMode = false;
var receivedGifs;

$(function() {

    // this stores the default gif searches
    var topics = ["Cool 3D World", "sfm", "prequel memes", "computational fluid dynamics", "finite element analysis", "bad cgi"];

    // this appends the default gif searches
    for (var i = 0; i < topics.length; i++) {
        var gifButton = $("<div>");
        gifButton.addClass("searchGif");
        gifButton.attr("value", topics[i]);
        gifButton.attr("offset", 0);
        gifButton.text(topics[i]);
        $("#button").append(gifButton);
    }

    $("#buttonAdd").on("click", function(event) {
        var buttons = $("<div>");
        var enteredText = $("#gifInput").val();
        if (enteredText === "") {
            alert("Enter some text first!");
        }
        else {
            buttons.text(enteredText);
            buttons.attr("value", enteredText);
            buttons.attr("offset", 0);
            buttons.addClass("searchGif");
            $("#button").append(buttons);
            $("#gifInput").val("");
            event.preventDefault();
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
                gifImage.attr("alt", receivedGifs.data[i].title);

                var gifInfo = $("<div>");
                gifInfo.append("<b>Title:</b> ", receivedGifs.data[i].title);
                gifInfo.append("<br><b>Rating:</b> ", receivedGifs.data[i].rating);

                gifDiv.append(gifImage);
                gifDiv.append(gifInfo);
                gifDiv.addClass("giphyGif");
                gifDiv.css({"display": "inline-block", "margin": "10px 20px"});

                $("#gifs").append(gifDiv);
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
    };

    // this function toggles between making the gif search buttons remove themselves or searching for gifs
    // it works by creating the proper on click event handler while deleting the other one
    $(document).on("click", "#deleteMode", function() {
        if (deleteButtonsMode === false) {
            deleteButtonsMode = true;
            $(document).off("click", ".searchGif", searchGifOnClick);
            console.log("Remove gif search button on click: " + deleteButtonsMode);
            $("#deleteMode").css("background-color", "red");
            $(document).on("click", ".searchGif", deleteModeOn);
        }
        else if (deleteButtonsMode === true) {
            deleteButtonsMode = false;
            $("#deleteMode").css("background-color", "lightcyan");
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
            $("#deleteModeMessage").html("<font color='darkgreen'>Click a button above to retrieve GIFs!</font>")
        };
    });

    // careful, this clears the page of GIFs
    $(document).on("click", "#deleteAllGifs", function() {
        var input = prompt('Wipe all GIFs from the page?  Type "Wipe them out" to confirm.');
        console.log(input);
        if (input === null) {
            console.log("ABORT ABORT ABORT");
            return;
        }
        else if (input === "Wipe them out") {
            $("#gifs").empty();
            // this resets all the button offsets to 0
            // otherwise the user wouldn't be able to see the same gifs unless they refresh the page
            $(".searchGif").attr("offset", 0);
        };
    });

});