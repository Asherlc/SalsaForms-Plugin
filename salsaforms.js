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
      //Set a default thank you message
      thankYouMessage: 'Now, share your action with your friends:'
    };
    
    //Is there a redirect URL present? If so, set the default to no ajax
    console.log('Checking for a redirect...');
    if ($('[name="redirect"]').val() === 'thankYou.sjs') {
      console.log('There is a redirect, but it is a default one. Proceeding with ajax');
    }else if ($('[name="redirect"]').val().length > 1) {
      console.log('Looks like we have a redirect. Set ajax to false');
      defaults.ajax = false;
    }

    options = $.extend(defaults,options);

    function validateForm() {
      //If the validation option is truthy, use the jQuery validate plugin
      console.log('Checking if validation set to run.');
      if (options.validate) {
        setValidationClasses();
        console.log('Form validation is set to run.');
        //Validate the form, but don't put any ugly error messages
        form.validate(validateOptions);
      }
    }


     //Add the CSS styles to the page
    $('head').append('<link rel="stylesheet" href="https://assets.trilogyinteractive.com/shared/css/SalsaForms-2.0.css" type="text/css" />');
    $('head').append('<link rel="stylesheet" href="https://assets.trilogyinteractive.com/shared/css/uniform.default.css" type="text/css" />');

    //Load the addThis and Validate JS files
    $.getScript('https://s7.addthis.com/js/250/addthis_widget.js#domready=1', function() {
      console.log('Addthis script loaded');
    });
    $.getScript('https://ajax.aspnetcdn.com/ajax/jquery.validate/1.9/jquery.validate.min.js', function() {
      console.log('Validate script loaded');
      validateForm();
    });

    //Give the fields appropriate classes to use jQuery validate with little to no tweaking
    function setValidationClasses() {
      
      console.log('Setting validation classes.');

      //Set the email and zip classes, which have special rules
      $('[name="Email"]').addClass('email');
      $('[name="Zip"]').addClass('zip PostalCode');

    
      //Store the string of required fields
      var requiredList = $('[name="required"]').val();
      console.log(requiredList);
  
      //Is there a hidden list of required fields?
      if (requiredList) {
        console.log('Listing required fields...');
        //Split the string into an array of required field names
        var requiredArray = requiredList.split(',');
        //For each required field name, find the appropriate field and add a class of "required"
        $.each(requiredArray, function(index, value) {
          console.log(value+' is a required field');
          $('[name="'+value+'"]').addClass('required');
        });
      }
      
    }

    //Load the TY page with ajax
    function loadThankYou() {
      //Load the TY page, and slide it down
      var thankYouURL = $('[name="redirect"]').val();
      //Loading the TY page
      $('#success-message').load(thankYouURL).slideDown();
    }

    //Load the AddThis stuff into the page
    function loadAddThis() {
      //First give it an array of buttons we want
      var svcs = ['email', 'google_plusone', 'tweet', 'facebook_like', 'expanded'];
      //Initialize the variable that will hold our HTML string
      var addThisButtons = '<div id="addthis">';
      //Cycle through the hash, and make an anchor element for each
      for (var s in svcs) {
        addThisButtons += '<a class="addthis_button_'+svcs[s]+'"></a>';
      }
      addThisButtons += '</div>';
      //Put all that HTML in the success message div
      $('#success-message').append(addThisButtons);
      //Initialize AddThis magic on that div
      addthis.toolbox("#success-message");
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
          form.slideUp('slow',
            function () {
              form.replaceWith('<div id="success-message"><h2>Thank you!</h2><p>'+options.thankYouMessage+'</p></div>');
              if (options.addThis) {
                console.log('Loading AddThis');
                loadAddThis();
                form.slideDown();
              }else{
                loadThankYou();
              }
          });
        }
      });
    }

    //This function adds the required class to always-required fields on donation pages
    function addDonationValidationClasses() {
      $('#eligibility, #cc_type, #ccExpMonth, #ccExpYear, #CVV2, #cc_number').addClass('required');
    }

    //These functions restructure the page, so that it is easier to style
    //This is for action pages
    function restructureActionPage() {
      console.log('Cleaning up this action page...');
      $('div.signatures').insertAfter(form);
      $('.petitionContent').appendTo('#info-page');
    }

    //This one is for signup pages
    function restructureSignupPage() {
      console.log('Cleaning up this signup page...');
      $('.salsa form style').nextUntil('input').detach().insertBefore(form).wrapAll('<div id="info-page" />');
    }

    //This is for TAF pages
    function restructureTAFPage() {
      console.log('Cleaning up this TAF pages...');
      $('[name="organization_KEY"]').nextUntil('script').detach().insertBefore(form).wrapAll('<div id="info-page" class="taf" />');
    }

    //Get the URL parameters as a hash
    function getURLParams() {
      console.log('Getting the url parameters...');
      var vars = {};
      var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
      });
      return vars;
    }

    //Determine which page type we're working with
    function getPageType() {
      //Store those params in a variable
      var pageType;
      var URLParamaters = getURLParams();

      //Iterate over the parameters, find on that has _KEY in it (that tells us what page type it is)
      $.each(URLParamaters, function(parameterName, value) {
        console.log('Finding the page parameter..');
        var key_pattern = new RegExp( "_KEY" );
        //If one of them matches the regex, let's use it
        if ( key_pattern.test(parameterName)) {
          console.log('The KEY parameters is: '+parameterName);
          pageType = parameterName.replace( '_KEY', '' );
        }
       });

      return pageType;
    }

    //Now that we know what kind of page it is, let's get the elements we want and store them in handy variables
    console.log('Switching through page types...');
    switch (getPageType())
    {
      case 'signup_page':
        console.log('This is a signup page');
        restructureSignupPage();
        break;
      case 'donate_page':
        console.log('This is a donation page');
        addDonationValidationClasses();
        break;
      case 'action':
        console.log('This is an action page');
        restructureActionPage();
        break;
      case 'tell_a_friend':
        console.log('This is a TAF page');
        restructureTAFPage();
        break;
      case 'questionnaire':
        break;
      case 'supporter_my_donate_page':
        break;
    }

    var validateOptions = {
      //errorPlacement: function(error, element) {},
      errorClass: "validate-error",
      rules: {
        cc: {
          creditcard: true
        },
        Zip: {
          minlength: 5
        },
        amount: {
          required: true
        }
      },
      messages: {
          First_Name: "Please enter your first name",
          Last_Name: "Please enter your last name",
          Street: "Please enter your street address",
          State: "Please select your state",
          Employer: "Please enter an employer. If you are retired or a homemaker, please enter <em>N/A</em>; if self-employed, please enter <em>self-employed</em>",
          Occupation: "Please enter an occupation. If you are retired, please enter <em>retired</em>; if a homemaker, please enter <em>homemaker</em>",
          Employer_City: "Please enter the city where your employer is located.",
          Employer_State: "Please enter the state where your employer is located.",
          amount: "Please select a contribution amount",
          cc_type: "Please select your credit card type",
          ccExpMonth: "Please select your card's expiration date",
          eligibility: "Please confirm your eligibility",
          Email: {
              required: "Please enter an email address",
              email: "Please enter a properly formatted email address"
          },
          City: {
              required: "Please enter your city",
              minlength: "Please enter a valid city"
          },
          Zip: {
              required: "Please enter your zip code",
              minlength: "Please enter a valid zip code"
          },
          cc: {
              required: "Please enter your credit card number",
              number: "Please enter a valid credit card number"
          },
          CVV2: {
              required: "Please enter a security code",
              minlength: "Please enter a 3- or 4-digit CVV2 security code",
              number: "The security code should be all numbers"
          }
      }
    };

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