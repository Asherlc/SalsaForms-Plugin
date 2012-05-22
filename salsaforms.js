(function($) {
  $.salsaform = function (options) {

    console.log('Salsaforms plugin has started. Fasten your seatbelts!');

    //Store the form, we'll be using it later
    var form = $('div.salsa form');

    //Set the default for the options
    var defaults = {
      //Validate client-side with jQuery validator?
      validate : true,
      //Should the form submit with ajax and have same-page TY?
      ajax : true,
      //What should the submit button say?
      buttonText : 'Take Action',
      //What CSS layout should the form use?
      layout : 'two_column',
      //Should this use AddThis for the TY?
      addThis: true,
      //What is the addThis profile ID?
      addThisID: '4ebc8b1c2a3a1066'
    };

    options = $.extend(defaults,options);

     //Add the CSS styles to the page
    $('head').append('<link rel="stylesheet" href="http://assets.trilogyinteractive.com/shared/css/SalsaForms.css" type="text/css" />');

    //Load the addThis and Validate JS files
    $.getScript('http://s7.addthis.com/js/250/addthis_widget.js#domready=1');
    $.getScript('http://ajax.aspnetcdn.com/ajax/jquery.validate/1.9/jquery.validate.min.js');

    //Give the fields appropriate classes to use jQuery validate with little to no tweaking
    function setValidationClasses() {
      
      console.log('Setting validation classes.');

      //Set the email and zip classes, which have special rules
      $('[name="Email"]').addClass('email');
      $('[name="Zip"]').addClass('zip');

    
      //Store the string of required fields
      var requiredList = $('[name="required"]').val();
  
      //Is there a hidden list of required fields?
      if (requiredList) {
        //Split the string into an array of required field names
        var requiredArray = requiredList.split(',')
        //For each required field name, find the appropriate field and add a class of "required"
        $.each(requiredArray, function(index, value) {
          $('[name="'+value+'"]').addClass('required');
        });
      }
      
    }

    //Load the TY page with ajax
    function loadThankYou() {
      //Load the TY page, and slide it down
      var thankYouURL = $('[name="redirect"]').val();
      //Loading the TY page
      $('#success_message').load(thankYouURL).slideDown;
    }

    //Load the AddThis stuff into the page
    function loadAddThis() {
      //First give it an array of buttons we want
      svcs = ['email', 'google_plusone', 'tweet', 'facebook_like', 'expanded'];
      //Initialize the variable that will hold our HTML string
      var addThisButtons  = '';
      //Cycle through the hash, and make an anchor element for each
      for (var s in svcs) {
        addThisButtons += '<a class="addthis_button_'+svcs[s]+'"></a>';
      }
      //Put all that HTML in the success message div
      $('#success_message').html(addThisButtons);
      //Initialize AddThis magic on that div
      addthis.toolbox("#success_message");
      addthis.init();
    }

    //This function submits a form via Ajax
    function submitFormAjax(form) {
      $(form).submit(function(e) {
        //Stop the form from submitting as normal
        e.preventDefault();
        //Check to see if the validation passed
        if (form.valid()) {
          //Serialize the form data
          var formData = form.serialize();
          //Post that sucker to salsa! But don't wait for success callback, because Salsa is shitty and will say it fails no matter what
          $.ajax({
            type: 'POST',
            url: form.attr('action'),
            data: formData
          });
          //Slide up the form and hide it
          $('div.salsa').slideUp('slow',
            function () {
              $('div.salsa').before('<div id="success_message"></div>');
              if (options.addThis) {
                console.log('Loading AddThis');
                loadAddThis();
              }else{
                loadThankYou();
              }
          });
        }
      });
    }


    //If the validation option is truthy, use the jQuery validate plugin
    console.log('Checking if validation set to run.');
    if (options.validate) {
      setValidationClasses();
      console.log('Form validation is set to run.');
      form.validate();
    }

    //If the ajax option is truthy, then submit the form with ajax, hide it, and show a TY div
    console.log('Checking if ajax set to run.');
    if (options.ajax) {
      console.log('Form is set to submit via ajax.');
      submitFormAjax(form);
    }

    //Change the submit button text
    console.log('Changing the submit button text to: '+options.buttonText);
    $('div.salsa input[type="submit"]').val(options.buttonText);

  };
})(jQuery);
$(document).ready(function() {
$.salsaform();
});