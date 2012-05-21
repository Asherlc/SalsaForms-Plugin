//This is our actual plugin
(function($) {
  $.salsaform = function(options) {

    console.log('Salsaforms lugin has started. Fasten your seatbelts!');

    //Add the CSS styles to the page
    $('head').append('<link rel="stylesheet" href="style2.css" type="text/css" />');

    //Some variable's we'll need later
    var page_type,
        page_param;

    var form = $('div.salsa form');

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
    }

    //Now that we know what kind of page it is, let's get the elements we want and store them in handy variables
    switch (page_type)
    {
      case 'signup_page':
        console.log('This is a signup page');
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
      
    //If the validation option is truthy, use the jQuery validate plugin
    if (options.validate) {
      console.log('Form validation is set to run.');
      form.validate();
    }

    //If the ajax option is truthy, then submit the form with ajax, hide it, and show a TY div
    if (options.ajax) {
      console.log('Form is set to submit via ajax.');
      submit_form_ajax(form);
    }

    //Change the submit button text
    console.log('Changing the submit button text to: '+options.button_text);
    $('div.salsa input[type="submit"]').val(options.button_text);
  };
})(jQuery);