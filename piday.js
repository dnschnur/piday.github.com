$(function() {

  var form = $('form');
  var inputs = form.find(':input');
  var required = inputs.filter('[required]');
  var submit = inputs.filter('[type=submit]');
  var confirmation = form.find('.confirmation');

  // On touch devices, the links with drop-downs aren't normally hoverable, so
  // we need to disable their action to allow them to expand the drop-down only.
  if ('ontouchstart' in document.documentElement) {
    $('.menu-item:has(.menu-dropdown) > a').click(function() {
      return false;
    });
  }

  // Primitive form validation; inform immediately on missing a required field
  required.blur(function() {
    var input = $(this);
    input.toggleClass('missing', !input.val());
  });

  // Keep the submit button disabled until everything is valid
  required.keyup(function() {
    var valid = true;
    required.each(function() {
      return valid &= !!$(this).val();
    });
    submit.prop('disabled', !valid);
  });

  // Submit asynchronously and show a confirmation message
  form.submit(function(event) {
    event.preventDefault();

    confirmation.hide();
    inputs.prop('disabled', true);

    var url = form.attr('action');
    $.post(url, form.serialize()).done(function() {
      inputs.prop('disabled', false);
      confirmation.show();
    });
    return false;
  });
});
