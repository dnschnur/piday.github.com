$(function() {
  // On touch devices, the links with drop-downs aren't normally hoverable, so
  // we need to disable their action to allow them to expand the drop-down only.
  if ('ontouchstart' in document.documentElement) {
    $('.menu-item:has(.menu-dropdown) > a').click(function() {
      return false;
    });
  }
});
