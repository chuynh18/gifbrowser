"use strict";

var removeMode = false;
var receivedGifs;

$(function() {

    // this stores the default gif searches
    var topics = ["Cool 3D World", "sfm", "prequel memes", "computational fluid dynamics", "finite element analysis", "bad cgi"];

    // this appends the default gif searches
    for (var i = 0; i < topics.length; i++) {
        var gifButton = $("<div>");
        gifButton.addClass("searchGif");
        gifButton.attr("value", topics[i]);
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
            buttons.addClass("searchGif");
            $("#button").append(buttons);
            $("#gifInput").val("");
            event.preventDefault();
        };
    });

    // this is the actual API call, limiting to 10 gifs to mitigate hitting rate limit
    var searchGifOnClick = function () {
        console.log("hey, you clicked " + $(this).attr("value"));

        var giphy = $(this).attr("value");
        var queryURL = "http://api.giphy.com/v1/gifs/search?q=" + giphy + "&api_key=PWuJeLENc0xCg38ONwNbgjIcGzyPXnyO&limit=10";
        // Creates AJAX call to Giphy
        $.ajax({
        url: queryURL,
        method: "GET"
        }).then(function(response) {
            console.log(response);
        // receivedGifs.data[i].images.fixed_height.url
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
                gifDiv.css({"display": "inline-block", "margin": "10px 20px"});

                $("#gifs").append(gifDiv);
            }

        })
          
    };

    // the thing that actually listens for the click
    $(document).on("click", ".searchGif", searchGifOnClick);

    // this is the function that removes GIF search buttons
    var deleteModeOn = function() {
        $(this).remove();
    };

    // this function toggles between making the gif buttons remove themselves or searching for gifs
    // it works by creating the proper on click event handler while deleting the other one
    $(document).on("click", "#deleteMode", function() {
        if (removeMode === false) {
            removeMode = true;
            $(document).off("click", ".searchGif", searchGifOnClick);
            console.log("remove mode set to: " + removeMode);
            $("#deleteMode").css("background-color", "red");
            $(document).on("click", ".searchGif", deleteModeOn);
        }
        else if (removeMode === true) {
            removeMode = false;
            $("#deleteMode").css("background-color", "lightcyan");
            console.log("remove mode set to: " + removeMode);
            $(document).on("click", ".searchGif", searchGifOnClick);
            $(document).off("click", ".searchGif", deleteModeOn);
        };
    });

    // this function ensures the appropriate instructional message is always displayed
    $(document).on("click", function() {
        if ($("#button").children().length === 0) {
            $("#deleteModeMessage").html("<font color='red'><b>You've removed all the buttons.</b>  Add buttons to search for GIFs!</font>")
        }
        else if (removeMode === true) {
            $("#deleteModeMessage").html("<font color='red'><b>Delete mode enabled.</b>  You can remove GIF search buttons by clicking on them.</font>")
        }
        else if (removeMode === false) {
            $("#deleteModeMessage").text("Click a button above to retrieve GIFs!")
        };
    });

});