// Userlist data array for filling in info box
var candidateListData = [];

// On Docuement Ready =============================================================
$(document).ready(function() {

    // Populate the user table on initial page load
    populateCandidateList();

    // Username link click
    $('#candidateList table tbody').on('click', 'td a.linkshowcandidate', showCandidateInfo);

    // Add User button click
    $('#btnAddCandidate').on('click', addCandidate);

    // Delete User link click
    $('#candidateList table tbody').on('click', 'td a.linkdeletecandidate', deleteCandidate);

});

// Functions =============================================================

// Fill table with data
function populateCandidateList() {

    // Empty content string
    var tableContent = '';

    // jQuery AJAX call for JSON
    $.getJSON( '/prezs/prezlist', function( data ) {

        // Stick our candidate data array into a candidatelist variable in the global object
        candiateListData = data;

        // For each item in our JSON, add a table row and cells to the content string
        $.each(data, function(){
            tableContent += '<tr>';
            tableContent += '<td><a href="#" class="linkshowcandidate" rel="' + this.candidatename + '" title="Show Candidate Details">' + this.candidatename + '</a></td>';
            tableContent += '<td>' + this.email + '</td>';
            tableContent += '<td><a href="#" class="linkdeletecandidate" rel="' + this._id + '">delete</a></td>';
            tableContent += '</tr>';
        });

        // Inject the whole content string into our existing HTML table
        $('#candidateList table tbody').html(tableContent);
    });
};

// Show User Info
function showCandidateInfo(event) {

    // Prevent Link from Firing
    event.preventDefault();

    // Retrieve username from link rel attribute
    var thisCandidateName = $(this).attr('rel');

    // Get Index of object based on id value
    var arrayPosition = candiateListData.map(function(arrayItem) { return arrayItem.candidatename; }).indexOf(thisCandidateName);

    // Get our User Object
    var thisCandidateObject = candiateListData[arrayPosition];

    //Populate Info Box
    $('#candidateInfoName').text(thisCandidateObject.fullname);
    $('#candidateInfoAge').text(thisCandidateObject.age);
    $('#candidateInfoGender').text(thisCandidateObject.gender);
    $('#candidateInfoLocation').text(thisCandidateObject.location);

};

// Add User
function addCandidate(event) {
    event.preventDefault();

    // Super basic validation - increase errorCount variable if any fields are blank
    var errorCount = 0;
    $('#addCandidate input').each(function(index, val) {
        if($(this).val() === '') { errorCount++; }
    });

    // Check and make sure errorCount's still at zero
    if(errorCount === 0) {

        // If it is, compile all user info into one object
        var newUser = {
            'candidatename': $('#addCandidate fieldset input#inputCandidateName').val(),
            'email': $('#addCandidate fieldset input#inputCandidateEmail').val(),
            'fullname': $('#addCandidate fieldset input#inputCandidateFullname').val(),
            'age': $('#addCandidate fieldset input#inputCandidateAge').val(),
            'location': $('#addCandidate fieldset input#inputCandidateLocation').val(),
            'gender': $('#addCandidate fieldset input#inputCandidateGender').val()
        }

        // Use AJAX to post the object to our adduser service
        $.ajax({
            type: 'POST',
            data: newUser,
            url: '/prezs/addprez',
            dataType: 'JSON'
        }).done(function( response ) {

            // Check for successful (blank) response
            if (response.msg === '') {

                // Clear the form inputs
                $('#addCandidate fieldset input').val('');

                // Update the table
                populateCandidateList();

            }
            else {

                // If something goes wrong, alert the error message that our service returned
                alert('Error: ' + response.msg);

            }
        });
    }
    else {
        // If errorCount is more than 0, error out
        alert('Please fill in all fields');
        return false;
    }
};

// Delete User
function deleteCandidate(event) {

    event.preventDefault();

    // Pop up a confirmation dialog
    var confirmation = confirm('Are you sure you want to delete this Candidate?');

    // Check and make sure the user confirmed
    if (confirmation === true) {

        // If they did, do our delete
        $.ajax({
            type: 'DELETE',
            url: '/prezs/deleteprez/' + $(this).attr('rel')
        }).done(function( response ) {

            // Check for a successful (blank) response
            if (response.msg === '') {
            }
            else {
                alert('Error: ' + response.msg);
            }

            // Update the table
            populateCandidateList();

        });

    }
    else {

        // If they said no to the confirm, do nothing
        return false;

    }

};