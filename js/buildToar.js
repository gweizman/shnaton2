var faculties = {};
var chugim = {};
var maslulim = {};

var chosenMaslulim = [];

function addEgged(agadim, id, callback, firstYear, secondYear, thirdYear) {
    if (agadim.length == id) {
        callback();
    }
    else {
        switch (agadim[id].year) {
            case 1:
            case '1':
            default:
                agadim[id].fetchCourses(function() {
                     agadim[id].getCourses().forEach(function(course) {
                            if (!(course.id in firstYear)) {
                                firstYear[course.id] = course;
                                $("#year1 > table > tbody").append("<tr><td>" + course.id  + "</td><td>" + course.name + "</td><td>" + course.naz +"</td></tr>");
                            }
                     });
                    addEgged(agadim, id + 1, callback, firstYear, secondYear, thirdYear);
                });
                break;
            case 2:
            case '2':
                agadim[id].fetchCourses(function() {
                     agadim[id].getCourses().forEach(function(course) {
                         if (!(course.id in secondYear)) {
                            secondYear[course.id] = course;
                            $("#year2 > table > tbody").append("<tr><td>" + course.id  + "</td><td>" + course.name + "</td><td>" + course.naz +"</td></tr>");
                        }
                     });
                    addEgged(agadim, id + 1, callback, firstYear, secondYear, thirdYear);
                });
                break;
            case 3:
            case '3':
                agadim[id].fetchCourses(function() {
                     agadim[id].getCourses().forEach(function(course) {
                        if (!(course.id in thirdYear)) {
                            thirdYear[course.id] = course;
                            $("#year3 > table > tbody").append("<tr><td>" + course.id  + "</td><td>" + course.name + "</td><td>" + course.naz +"</td></tr>");
                        }
                     });
                    addEgged(agadim, id + 1, callback, firstYear, secondYear, thirdYear);
                });
                break;
        }
    }
}

function loadCourses() {
    var firstYear = {}, secondYear = {}, thirdYear = {};
    chosenMaslulim.forEach(function(maslul) {
    maslul.fetchAgadim(function() {
            $("#year1 > table > tbody").html('');
            $("#year2 > table > tbody").html('');
            $("#year3 > table > tbody").html('');
            addEgged(maslul.getAgadim(), 0, function() {
                $("#notCourses").hide("slide");
                $("#courses").show("slide");
            }, firstYear, secondYear, thirdYear);
        });
    });
}

function updateMaslulim(chug) {
    if (chosenMaslulim.length > 0) {
        chosenMaslulim[0].getSecondPossibleMaslulim(chug.id, function(maslulim) {
            console.log(maslulim);
            maslulim.forEach(function(maslul) {
                console.log(maslul.id);
                window.maslulim[maslul.id] = maslul;
                console.log(window.maslulim);
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
    $('#faculty > #buttons').data('selectize').clear(true);
    $('#faculty > #buttons').data('selectize').clearOptions();
    $('#faculty > #buttons').data('selectize').refreshOptions();
    
    $('#chug > #buttons').data('selectize').clear(true);
    $('#chug > #buttons').data('selectize').clearOptions();
    $('#chug > #buttons').data('selectize').refreshOptions();
    $('#chug > #buttons').data('selectize').disable();
    
    $('#maslul > #buttons').data('selectize').clear(true);
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
                    chosenMaslulim.push(maslulim[$('#maslul > #buttons').data('selectize').getValue()]);
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