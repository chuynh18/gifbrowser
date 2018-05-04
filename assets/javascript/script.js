"use strict";

var removeMode = false;

$(function() {

var topics = ["Cool 3D World", "sfm", "prequel memes", "computational fluid dynamics", "monte carlo methods", "finite element analysis", "bad cgi"];

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
    }
  });

});

// replace with api call
var searchGifOnClick = function () {
    console.log("hey, you clicked " + $(this).attr("value"));
};

// the thing that actually listens for the click
$(document).on("click", ".searchGif", searchGifOnClick);

var deleteModeOn = function() {
    $(this).remove();
};

$(document).on("click", "#deleteMode", function() {
    if (removeMode === false) {
        removeMode = true;
        $(document).off("click", ".searchGif", searchGifOnClick);
        console.log("remove mode set to: " + removeMode);
        $("#deleteModeMessage").html("<font color='red'><b>Delete mode enabled.</b>  You can remove GIF search buttons by clicking on them.</font>")
        $("#deleteMode").css("background-color", "red");
        $(document).on("click", ".searchGif", deleteModeOn);
    }
    else if (removeMode === true) {
        removeMode = false;
        $("#deleteMode").css("background-color", "lightcyan");
        console.log("remove mode set to: " + removeMode);
        $("#deleteModeMessage").text("Click a button above to retrieve GIFs!")
        $(document).on("click", ".searchGif", searchGifOnClick);
        $(document).off("click", ".searchGif", deleteModeOn);
    };
});