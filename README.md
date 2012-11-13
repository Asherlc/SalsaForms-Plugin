SalsaForms-Plugin
=================

jQuery plugin to make Salsa forms a little less horrible.

This plugin does the following:
* Validates the form
* Turns signup forms into two column layout
* Changes the submit button text
* Submits form via ajax and loads addthis if desired

Options
-------

You can also set the following options in the plugin firer:
* validate: true/false (defaults to true)
* buttonText: string (defaults to 'Take Action')
* thankYouMessage: string (defaults to 'Now, share your action with your friends:')
* addThis: Use addThis for the thank you (defaults to true) 

Example Code
------------

To use it, insert this code in your form:

<link rel="stylesheet" href="http://assets.trilogyinteractive.com/shared/css/SalsaForms-2.0.css" />
<link rel="stylesheet" href="http://assets.trilogyinteractive.com/shared/css/SalsaForms-structure-2.0.css" />
<script src="http://ajax.aspnetcdn.com/ajax/jquery.validate/1.10.0/jquery.validate.min.js"></script>
<script src="http://s7.addthis.com/js/250/addthis_widget.js"></script>
<script src="http://assets.trilogyinteractive.com/shared/salsaform-2-0/salsaforms.js"></script>
<script>
$(document).ready(function() {
  $('.salsa form').salsaForm();
});
</script>

FAQ:
----

Q: The (mandatory) WYSIWIG in the questionnaire wizard won't let me include the code!

A: Make a questionnaire-only template!
