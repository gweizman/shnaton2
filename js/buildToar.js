$(function() {
    populateFaculties(function(faculties) {
        faculties.forEach(function(faculty) {
            $("#faculty > #buttons").append('<a data-id="' + faculty.id + '" class="button">' + faculty.name + '</a>');
            $("#faculty > #buttons > a[data-id=\"" + faculty.id + "\"]").data("object", faculty);
        });
    });
    
    $("#faculty > .button").click(function() {
        $("#chug-faculty").html($(this).html(), function() {
            $(this).data("object").fetchChugim(function() {
                $(this).data("object").getChugim.forEach(function(chug) {
                    $("#chug > #buttons").append('<a data-id="' + chug.id + '" class="button">' + chug.name + '</a>');
                    $("#chug > #buttons > a[data-id=\"" + chug.id + "\"]").data("object", chug);                   
                });
                $("#faculty").hide("slide", function() {
                        $("#chug").show("slide");
                });
            });
        });
    });
    
    $("#chug > .button").click(function() {
        $("#maslul-chug-faculty").html( $("#chug-faculty").html() + " / " + $(this).html());
        $("#chug").hide("slide");
        $("#maslul").show("slide");
    });
    
    $("#maslul > .button").click(function() {
        $("#courses-maslul-chug-faculty").html( $("#maslul-chug-faculty").html() + " / " + $(this).html());
        $("#maslul").hide("slide");
        $("#courses").show("slide");
    });
    $(document).foundation('accordion', 'reflow');
});