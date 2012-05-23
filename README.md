SalsaForms-Plugin
=================

jQuery plugin to make Salsa forms a little less horrible.

This plugin does the following:
* Validates the formTurns signup forms into two column layout
* Gives everything pre
* Changes the submit button text
* Submits form via ajax and loads addthis if a redirect isn't specified
* Gives salsa forms some nice looking styles

Options
-------

You can also set the following options in the plugin firer:
* validate: true/false (defaults to true)
* ajax: true/false (defaults to true, unless a redirect is specified in the wizard)
* buttonText: string (defaults to 'Take Action')
* thankYouMessage: string (defaults to 'Now, share your action with your friends:')
* addThis: true/false (defaults to true)
* prettify: true/false (defaults to true, set this to false if your site has built in salsa form styles)

Example Code
------------

To use it, insert this code in your form:

  <script type='text/javascript' src='https://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js'></script>
  <script type="text/javascript" src="https://assets.trilogyinteractive.com/shared/js/salsaforms.js"></script>
  <script>
  $(document).ready(function() {
    $.salsaform();
  });
  </script>

Example instance where we want the button to say "Sign petition", and no validation:

  <script type='text/javascript' src='https://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js'></script>
  <script type="text/javascript" src="https://assets.trilogyinteractive.com/shared/js/salsaforms.js"></script>
  <script>
  $(document).ready(function() {
    $.salsaform({
      validate: false,
      buttonText: 'Sign petition'
    });
  });
  </script>

FAQ:
----

Q: Why are jQuery and the plugin included in the sample code?

A: Because Salsa loads an ancient version of jQuery, which prevents this form from working. So, we have to override it right away with the new version, then give it the plugin right away. Fun!