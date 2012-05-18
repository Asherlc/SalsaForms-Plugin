$.fn.salsaform = function (options) {

  //Set the default for the options
  var defaults = {
    //Validate client-side with jQuery validator?
    validate = true,
    //Should the form submit with ajax and have same-page TY?
    ajax = true,
    //What should the submit button say?
    button_text = 'Take Action',
    //What CSS layout should the form use?
    layout = 'two_column'
  }

  var options = $.extend(defaults,options);

  //This function will get the elements between two selectors
  function get_all_between(first_element,last_element) {
    var first_elementement = $(first_element); // First Element
    var last_elementement = $(last_element); // Last Element
    var collection = new Array(); // Collection of Elements
    collection.push(first_elementement); // Add First Element to Collection
    $(first_element).nextAll().each(function(){ // Traverse all siblings
        var siblingID  = $(this).attr("id"); // Get Sibling ID
        if (siblingID != $(last_elementement).attr("id")) { // If Sib is not last_elementement
                collection.push($(this)); // Add Sibling to Collection
        } else { // Else, if Sib is last_elementement
                return false; // Break Loop
        }
    });         
    return collection; // Return Collection
  }

  //Determine which page type we're working with
  function get_page_type {
    //Get the URL parameters, which tell salsa what kind of page this is
    function get_URL_params() {
      var vars = {};
      var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
      });
      return vars;
    }

    //Store those params in a variable
    var URL_paramaters = get_URL_params();

    //Iterate over the parameters, find on that has _KEY in it (that tells us what page type it is)
    var page_type = $.each(URL_paramaters, function(parameter_name, value) {
      var key_pattern = new RegExp( "_KEY" );
      return parameter_name.replace( '_KEY', '' ); 
    });

    return page_type;
 }

  //Send the object back for extension
  return this.each(function) {

    //Store the current object for later use
    obj = $(this);

    //Store the actual form that we want in a variable
    var form = obj.find('form');

    //Get the page type
    var page_type = get_page_type();

    //Initialize some variables we'll need later
    var description;

    //Get an array of the required fields
    var required_fields = $('input[name="required"]').value().split(',');

    //Cycle through the required fields and add a class of "required" to them
    $.each(required_field, function(index, field_name) {
      obj.find('input[name="'+field_name+'"]').addClass('required');
    });

    //Now that we know what kind of page it is, let's get the elements we want and store them in handy variables
    switch (page_type)
    {
      case 'signup_page':
        description = get_all_between('.memberSignup','input');
        break;
      case 'donate_page':
        break;
      case 'action':
        description = obj.find('info-page').not('form').html().detach;  
        break;
      case 'tell_a_friend':
        break;
      case 'questionnaire':
        break;
      case 'supporter_my_donate_page':
        break;
    }

    //Put the description in a useful place
    $('div.salsa').append('<div id="salsa_description"></div>');
    $('#salsa_description').html(description);

    //If the validation option is truthy, use the jQuery validate plugin
    if (options.validate) {
      form.validate();
    }

    //If the ajax option is truthy, then submit the form with ajax, hide it, and show a TY div
    if (options.ajax) {
      //On submit, do the following
      $(form.submit(function(e) {
        //Stop the form from submitting as normal
        e.preventDefault();
        //Check to see if the validation passed
        if (form.valid()) {
          //Serialize the form data
          var formData = form.serialize();
          //Post that sucke to salsa! But don't wait for success callback, because Salsa is shitty and will say it fails no matter what
          $.ajax({
            type: 'POST',
            url: form.attr('action'),
            data: formData,
          });
          //Slide up the form and hide it
          form.slideUp('slow',
          function() {
            //Slide down the TY div
            $('#signup-finish').slideDown();
          });
        }
       });        
    });

    }
  }
}