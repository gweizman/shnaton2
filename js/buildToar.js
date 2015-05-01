var faculties = {};
var chugim = {};
var maslulim = {};

function loadCourses(maslul) {
    var firstYear = [], secondYear = [], thirdYear = [];
    maslul.fetchAgadim(function() {
        maslul.getAgadim().forEach(function(egged) {
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
    });
    console.log(firstYear);
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
}

function updateMaslulim(chug) {
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
                    loadCourses(maslulim[value]);
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
    $(document).foundation('accordion', 'reflow');
});