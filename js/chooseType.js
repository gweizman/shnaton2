$(function() {
    $("#existingStudent").click(function() {
        typeChosen = "exists"
        loadMainPage();
    });
    $("#newStudent").click(function() {
        typeChosen = "new"
        loadMainPage();
    });
});