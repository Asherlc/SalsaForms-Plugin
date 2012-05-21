//This is our actual plugin
(function($) {
  $.fn.salsaform = function(options) {

    //Add the CSS styles to the page
    $('head').append('<link rel="stylesheet" href="style2.css" type="text/css" />');

    //Some variable's we'll need later
    var page_type,
       page_param;

    //Set the default for the options
    var defaults = {
      //Validate client-side with jQuery validator?
      validate : true,
      //Should the form submit with ajax and have same-page TY?
      ajax : true,
      //What should the submit button say?
      button_text : 'Take Action',
      //What CSS layout should the form use?
      layout : 'two_column'
    };

    options = $.extend(defaults,options);

    //Get the URL parameters, which tell salsa what kind of page this is
    function get_URL_params() {
      console.log('Getting the url parameters...');
      var vars = {};
      var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
      });
      return vars;
    }

    //This function submits a form via Ajax
    function submit_form_ajax(form) {
      $(form).submit(function(e) {
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
            data: formData
          });
          //Slide up the form and hide it
          form.slideUp('slow',
          function() {
            //Slide down the TY div
            $('#signup-finish').slideDown();
          });
        }
      });
    }

    //Determine which page type we're working with
    function get_page_type() {
      //Store those params in a variable
      var URL_paramaters = get_URL_params();

      //Iterate over the parameters, find on that has _KEY in it (that tells us what page type it is)
      $.each(URL_paramaters, function(parameter_name, value) {
          console.log('Finding the page parameter..');
          var key_pattern = new RegExp( "_KEY" );
          //If one of them matches the regex, let's use it
          if ( key_pattern.test(parameter_name)) {
            page_param = parameter_name;
            console.log('The KEY parameters is: '+page_param);
          }
          page_type = page_param.replace( '_KEY', '' );
       });

      //Stop the loop
      return false;
    }

    //Send the object back for extension
    return this.each(function() {
      console.log('We are running the plugin on a new object');

      //Store the current object for later use
      var obj = $(this);

      //Store the actual form that we want in a variable
      var form = obj.find('form');

      //Get the page type
      get_page_type();
      console.log('Our page type is: '+page_type);

      //Initialize some variables we'll need later
      var description;

      //Get an array of the required fields
      var required_fields = $('input[name="required"]').val().split(',');

      //Cycle through the required fields and add a class of "required" to them
      $.each(required_fields, function(index, field_name) {
        console.log('Adding the required class to: '+field_name);
        form.find('input[name="'+field_name+'"]').addClass('required');
        console.log(form);
      });

      //Now that we know what kind of page it is, let's get the elements we want and store them in handy variables
      switch (page_type)
      {
        case 'signup_page':
          $('div.memberSignup').after('<div id="salsa_description">');
          $('input[name="redirect"]').before('</div>');
          description = $('#salsa_description').detach();
          console.log('This is a signup page');
          console.log(description);
          break;
        case 'donate_page':
          break;
        case 'action':
          //description = obj.find('info-page').not('form').html().detach; 
          //console.log('This is an action page');
          break;
        case 'tell_a_friend':
          break;
        case 'questionnaire':
          break;
        case 'supporter_my_donate_page':
          break;
      }

      console.log('hello');

      //Put the description in a useful place
      $('div.salsa').prepend($('#salsa_description'));

      
      //If the validation option is truthy, use the jQuery validate plugin
      if (options.validate) {
        form.validate();
      }

      //If the ajax option is truthy, then submit the form with ajax, hide it, and show a TY div
      if (options.ajax) {
        submit_form_ajax(form);
      }

      //Change the submit button text
      obj.find('#submitSignup').val(options.button_text);
    });
  };
})(jQuery);