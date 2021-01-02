//const $ = require("https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js");

window.onload = function() {
    // Add popup
    //document.head.insertAdjacentHTML("afterbegin", `<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js"></script>`);
    setTimeout(addHTML, 100);
}

function eventListener() {
    // Spoilers
    $(".spoiler-title").click(function(event) { 
        $(this).toggleClass("active").next().slideToggle(300);
    });
    // Save button
    $("#save-btn").click(function(event) {
        $(".input-crt").each( (id, item) => $(item)[0].value = "" );
    });
    //Close button
    $("#fefu-close").click( () => $("#html-pass").hide() );
}

function addHTML() {
    $(document.body).append(`<div id="html-pass" style="display: none"></div>`);
    $.ajax({
        url: "popup.html", 
        context: document.body,
        success: function(response) {
            $("#html-pass").html(response);
        }
    });
    // Add document customize
    $.ajax({
        url: "document.html", 
        context: document.body,
        success: function(response) {
            $(".img-fluid")[3].html(response);
        }
    });
    setTimeout(eventListener, 100);
}