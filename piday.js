$(function() {

  // On touch devices, the links with drop-downs aren't normally hoverable, so
  // we need to disable their action to allow them to expand the drop-down only.
  if ('ontouchstart' in document.documentElement) {
    $('.menu-item:has(.menu-dropdown) > a').click(function() {
      return false;
    });
  }

  // Very simple lightbox; assumes element has an img, adds a -full suffix.
  var lightboxContent = $('<div class="lightbox-content"></div>');
  var lightbox = $('<div class="lightbox"></div>')
    .append(lightboxContent)
    .appendTo('body')
    .click(function() {
      lightbox.fadeOut();
    });

  $('.lightboxable').each(function() {
    var source = $(this);
    var smallImage = source.children('img').prop('src');
    var fullImage = smallImage.replace('.jpg', '-full.jpg');
    source.on({
      mouseover: function() {
        var preload = new Image();
        preload.src = fullImage;
      },
      click: function() {
        lightboxContent.css('background-image', 'url(' + fullImage + ')');
        lightbox.fadeIn(function() {
          // Fixes covered-up image with IE8 background-size:contain polyfill
          lightboxContent.css('z-index', 50);
        });
      }
    });
  });

  // Very simple AJAX submission to Google Forms, with required validation
  var form = $('form');
  var inputs = form.find(':input');
  var required = inputs.filter('[required]');
  var submit = inputs.filter('[type=submit]');
  var confirmation = form.find('.confirmation');

  // Primitive form validation; inform immediately on missing a required field
  required.blur(function() {
    var input = $(this);
    input.toggleClass('invalid', !input.val());
  });

  // Validation helper
  var validate = function() {
    var valid = true;
    required.each(function() {
      var element = $(this);
      var elementType = element.prop('type');
      if (elementType === 'radio') {
        var elementName = element.prop('name');
        valid &= !!$('input[name="' + elementName + '"]:checked').length;
      } else {
        valid &= !!$(this).val();
      }
    });
    submit.prop('disabled', !valid);
  };

  // Keep the submit button disabled until everything is valid
  required.keyup(validate).click(validate);

  // Submit asynchronously and show a confirmation message
  form.submit(function(event) {
    var url = form.attr('action');
    var data = form.serialize();

    confirmation.hide();
    inputs.prop('disabled', true);

    $.post(url, data).always(function() {
      window.console.log('You can ignore the error above.');
      inputs.prop('disabled', false);
      if (confirmation.length === 2) {
        // Special case for the RSVP form
        var attending = $('input[name="entry.1363803774"]:checked').val();
        if (attending.indexOf('Yes') === 0) {
          confirmation.first().show();
        } else {
          confirmation.last().show();
        }
      } else {
        confirmation.show();
      }
    });

    event.preventDefault();
    return false;
  });
});
