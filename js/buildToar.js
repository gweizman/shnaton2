var faculties = {};

function updateChugim(faculty) {
    faculty.fetchChugim(function() {
        $('#chug > #buttons').data('selectize').clearOptions();
        faculty.getChugim().forEach(function(chug) {
            $('#chug > #buttons').data('selectize').addOption(
                {
                    id: chug.id,
                    text: chug.name
                }
            );                   
        });
        $('#chug > #buttons').data('selectize').enable(); 
    });
}

function updateFaculties() {
    window.faculties = {};
    populateFaculties(function(faculties) {
        $('#faculty > #buttons').data('selectize').clearOptions();
         faculties.forEach(function(faculty) {
            window.faculties[faculty.id] = faculty;
            $('#faculty > #buttons').data('selectize').addOption(
                {
                    id: faculty.id,
                    text: faculty.name
                }
            );
            $('#faculty > #buttons').data('selectize').refreshOptions();
        });
    });
}

$(function() {
    $facultySel = $('#faculty > #buttons').selectize({
        create: false,
        valueField: 'id',
        labelField: 'text',
        searchField: 'text',
        onChange: function(value) { 
            updateChugim(faculties[value]);
        }
    });
    $('#faculty > #buttons').data('selectize', $facultySel[0].selectize);
    $chugSel = $('#chug > #buttons').selectize({
        create: false,
        valueField: 'id',
        labelField: 'text',
        searchField: 'text'
    });
    $('#chug > #buttons').data('selectize', $chugSel[0].selectize);
    $('#chug > #buttons').data('selectize').disable();
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