$(document).foundation();
$.ajaxSetup({ cache: false });
var typeChosen = null;

function loadPage(html, javascript) {
    $("#content").load(html);
    $.getScript(javascript);
}

function loadCourse(id) {
    console.log(id);
    $('#courseContent').load('/showCourse.html?id=' + id, function() {
        $('#courseModal').foundation('reveal', 'open');
    });
}

function loadMainPage() {
    if (typeChosen == null) {
        loadPage("/chooseType.html", "/js/chooseType.js");
    } else {
        switch (typeChosen) {
            case "exists":
                loadPage("/timeline.html", "/js/timeline.js");
                break;
            case "new":
            default:
                break;
        }
    }
}

$(function() {
    loadMainPage();
});