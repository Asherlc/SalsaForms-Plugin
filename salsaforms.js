(function($) {

  "use strict";

  $.fn.salsaForm = function (options) {
    var form = $(this),
        defaults,
        validateOptions,
        restructure;

    //Set the default for the options
    defaults = {
        //Validate client-side with jQuery validator?
        validate : true,
        //What should the submit button say?
        buttonText : 'Take Action',
        //Should this use addthis for the TY?
        addthis: true,
        //Set a default thank you message
        thankYouMessage: 'Now, share your action with your friends:',
        //Should we restructure the page?
        restructure: true,
        //Restructure if device is mobile?
        mobile: true
    };

    options = $.extend(defaults,options);

    function mobileDevice() {
        return navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/webOS/i) || navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i) || navigator.userAgent.match(/iPod/i) || navigator.userAgent.match(/BlackBerry/i);
    }

    function setValidationClasses() {
        form.find('[name="Email"], [name="emailString"]').addClass('email');
        form.find('[name="Zip"]').addClass('zip PostalCode');

        var requiredList = $('[name="required"]').val();
  
        if (requiredList) {
            var requiredArray = requiredList.split(',');
            //For each required field name, find the appropriate field and add a class of "required"
            $.each(requiredArray, function(index, value) {
                form.find('[name="'+value+'"]').addClass('required');
            });
        }
      
    }

    //Load the addthis stuff into the page
    function loadaddthis() {
      var buttons = ['email', 'google_plusone', 'tweet', 'facebook_like', 'expanded'],
          addthisButtons;

      //Initialize the variable that will hold our HTML string
      addthisButtons = '<div id="addthis">';
      //Cycle through the hash, and make an anchor element for each
      for (var button in buttons) {
        addthisButtons += '<a class="addthis_button_'+buttons[button]+'"></a>';
      }
      addthisButtons += '</div>';
      $('#success-message').append(addthisButtons);
      //Initialize addthis magic on that div
      addthis.toolbox("#success-message");
      addthis.init();
    }

    //This function submits a form via Ajax
    function submitFormAjax() {
        form.submit(function(e) {
            var formData;

            e.preventDefault();
            if (form.valid()) {
                formData = form.serialize();
                //Post that sucker to salsa! But don't wait for success callback, because Salsa is shitty and will say it fails no matter what
                $.ajax({
                    type: 'POST',
                    url: form.attr('action'),
                    data: formData
                });
                form.slideUp('slow',
                  function () {
                      form.replaceWith('<div id="success-message"><h2>Thank you!</h2><p>'+options.thankYouMessage+'</p></div>');
                      loadaddthis();
                      form.slideDown();
                });
            }
        });
    }


    //These functions restructure the page, so that it is easier to style
    restructure = {
        action: function() {
            $('div#signers-page').insertAfter(form);
            $('.petitionContent').appendTo('#info-page');
        },
        signup_page: function() {
            $('.salsa form style').nextUntil('input').detach().insertBefore(form).wrapAll('<div id="info-page" />');
        },
        questionnaire: function() {
            $('.salsa form style').nextUntil('input').detach().insertBefore(form).wrapAll('<div id="info-page" class="questionnaire" />');
        },
        tell_a_friend: function() {
            $('[name="organization_KEY"]').nextUntil('script').detach().insertBefore(form).wrapAll('<div id="info-page" class="taf" />');
        },
        donate_page: function() {
            $('#eligibility, #cc_type, #ccExpMonth, #ccExpYear, #CVV2, #cc_number').addClass('required');
        },
        supporter_my_donate_page: function() {
          //Not yet implemented
        }
    };

    function URLParams() {
        var vars = {};
        window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
            vars[key] = value;
        });
        return vars;
    }

    function mobileRestructure() {
        var salsaDiv = $('div.salsa').addClass('mobile').detach();

        $('head').append('<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">');
        $('body').empty().append(salsaDiv);
        $('#signers-page, #info-page, #mainForm').addClass('mobile');
    }

    function pageType() {
        var type;
        //Iterate over the parameters, find on that has _KEY in it (that tells us what page type it is)
        $.each(URLParams(), function(parameterName, value) {
            var keyPattern;
            keyPattern = new RegExp( "_KEY" );
            if (keyPattern.test(parameterName)) {
              type = parameterName.replace( '_KEY', '' );
            }
       });
      return type;
    }

    if (options.restructure) {
      var type = pageType();
      restructure[type]();
    }
    if (options.addthis && (form.find('[name="redirect"]').val().length < 1) && addthis) {
      submitFormAjax();
    }
    if (options.mobile && mobileDevice()) {
        mobileRestructure();
    }
    if (options.validate && $().validate()) {
        setValidationClasses();
        form.validate(validateOptions);
    }
    if (options.buttonText) {
        $('div.salsa input[type="submit"]').val(options.buttonText);
    }


    validateOptions = {
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


  };
})(jQuery);