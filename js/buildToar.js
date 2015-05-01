var faculties = {};
var chugim = {};
var maslulim = {};

var chosenMaslulim = [];

function loadCourses() {
    var firstYear = [], secondYear = [], thirdYear = [];
    chosenMaslulim.forEach(function(maslul) {
    maslul.fetchAgadim(function() {
            maslul.getAgadim().forEach(function(egged) {
                console.log(egged);
                switch (egged.year) {
                    case 1:
                    case '1':
                    default:
                        firstYear.push(egged);
                        break;
                    case 2:
                    case '2':
                        secondYear.push(egged);
                        break;
                    case 3:
                    case '3':
                        thirdYear.push(egged);
                        break;
                }
            });

            $("#year1 > table > tbody").html('');
            $("#year2 > table > tbody").html('');
            $("#year3 > table > tbody").html('');
            firstYear.forEach(function(egged) {
                egged.fetchCourses(function() {
                    egged.getCourses().forEach(function(course) {
                        $("#year1 > table > tbody").append(
                            "<tr><td>" + course.id  + "</td><td>" + course.name + "</td><td>" + course.naz +"</td></tr>"
                        );
                    });
                });
            });
            
            secondYear.forEach(function(egged) {
                egged.fetchCourses(function() {
                    egged.getCourses().forEach(function(course) {
                        $("#year2 > table > tbody").append(
                            "<tr><td>" + course.id  + "</td><td>" + course.name + "</td><td>" + course.naz +"</td></tr>"
                        );
                    });
                });
            });
            
            thirdYear.forEach(function(egged) {
                egged.fetchCourses(function() {
                    egged.getCourses().forEach(function(course) {
                        $("#year3 > table > tbody").append(
                            "<tr><td>" + course.id  + "</td><td>" + course.name + "</td><td>" + course.naz +"</td></tr>"
                        );
                    });
                });
            });
            
            $("#notCourses").hide("slide");
            $("#courses").show("slide");
        });
    });
}

function updateMaslulim(chug) {
    if (chosenMaslulim.length > 0) {
        chosenMaslulim[0].getSecondPossibleMaslulim(chug.id, function(maslulim) {
            maslulim.forEach(function(maslul) {
                window.maslulim[maslul.id] = maslul;
                $('#maslul > #buttons').data('selectize').addOption(
                    {
                        id: maslul.id,
                        text: maslul.name
                    }
                );
            });
        });
    } else {
        chug.fetchMaslulim(function() {
            $('#maslul > #buttons').data('selectize').clearOptions();
            chug.getMaslulim().forEach(function(maslul) {
                window.maslulim[maslul.id] = maslul;
                $('#maslul > #buttons').data('selectize').addOption(
                    {
                        id: maslul.id,
                        text: maslul.name
                    }
                );
            });
            $('#maslul > #buttons').data('selectize').refreshOptions();
            $('#maslul > #buttons').data('selectize').enable();
        });
    }
}

function updateChugim(faculty) {
    faculty.fetchChugim(function() {
        $('#chug > #buttons').data('selectize').clearOptions();
        faculty.getChugim().forEach(function(chug) {
            window.chugim[chug.id] = chug;
            $('#chug > #buttons').data('selectize').addOption(
                {
                    id: chug.id,
                    text: chug.name
                }
            );                   
        });
        $('#chug > #buttons').data('selectize').refreshOptions();
        $('#chug > #buttons').data('selectize').enable(); 
    });
}

function updateFaculties() {
    $("#courses").hide("slide");
    $("#notCourses").show("slide");
    $("#finished > a").addClass("disabled").click(function() { });
    window.faculties = {};
    window.chugim = {};
    window.maslulim = {};
    $('#chug > #buttons').data('selectize').clearOptions();
    $('#chug > #buttons').data('selectize').refreshOptions();
    $('#chug > #buttons').data('selectize').disable();
    
    $('#maslul > #buttons').data('selectize').clearOptions();
    $('#maslul > #buttons').data('selectize').refreshOptions();
    $('#maslul > #buttons').data('selectize').disable();
    
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
        searchField: 'text',
        onChange: function(value) {
            updateMaslulim(chugim[value]);
        }
    });
    $('#chug > #buttons').data('selectize', $chugSel[0].selectize);
    $('#chug > #buttons').data('selectize').disable();
    
    $maslulSel = $('#maslul > #buttons').selectize({
        create: false,
        valueField: 'id',
        labelField: 'text',
        searchField: 'text',
        onChange: function(value) {
                $("#finished > a").removeClass("disabled").click(function() {
                    chosenMaslulim.push(maslulim[value]);
                    loadCourses();
                });
            }
    });
    $('#maslul > #buttons').data('selectize', $maslulSel[0].selectize);
    $('#maslul > #buttons').data('selectize').disable();
    
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
    
    $(".addMaslul").click(function() {
        updateFaculties();
    });
    $(document).foundation('accordion', 'reflow');
});