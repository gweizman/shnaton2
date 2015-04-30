$(function() {
    $(".showCourse").click(function() {
        console.log($(this));
        loadCourse($(this).data('id'));
    });
});