$( document ).ready(function() {
    console.log('before');
})
$('.updateForm').hide();

$('.updateButton').click(function() {
    console.log('here');
    $('.updateForm').show();
})