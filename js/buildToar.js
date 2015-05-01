function updateChugim(faculty) {
    $("#chug-faculty").html($(this).html());
    $(faculty).data("object").fetchChugim(function() {
        $(faculty).data("object").getChugim().forEach(function(chug) {
            $("#chug > #buttons").append('<a data-id="' + chug.id + '" class="button">' + chug.name + '</a>');
            $("#chug > #buttons > a[data-id=\"" + chug.id + "\"]").data("object", chug);                   
        });
        $("#faculty").hide("slide", function() {
                $("#chug").show("slide");
        });
    });
}

function updateFaculties() {
    populateFaculties(function(faculties) {
        console.log(faculties);
        $("#faculty > #buttons").html('');
        faculties.forEach(function(faculty) {
            $("#faculty > #buttons").append('<option data-id="' + faculty.id + '" value="' + faculty.id + '">' + faculty.name + '</option>');
            $("#faculty > #buttons > option[data-id=\"" + faculty.id + "\"]").data("object", faculty);
        });
        $('#faculty > #buttons').selectize({
            create: false,
            sortField: 'text'
        });
    });
    $("#faculty > #buttons > .button").click(function() {
            updateChugim(this);
    });
}

$(function() {
    updateFaculties();
    
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