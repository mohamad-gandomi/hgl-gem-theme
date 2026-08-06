(function ($) {
  function initPostTranslationSelect() {
    var $select = $('#hgl-translation-post-select')
    var $hidden = $('#hgl-translation-post-id')

    if (!$select.length || typeof $select.select2 !== 'function') return

    $select.select2({
      allowClear: true,
      placeholder: $select.data('placeholder') || 'Search by title...',
      width: '100%',
      dropdownParent: $('#hgl-post-language')
    })

    $select.on('change', function () {
      $hidden.val($select.val() || '')
    })
  }

  $(initPostTranslationSelect)
})(jQuery)
