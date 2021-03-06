/**
Core script to handle the entire theme and core functions
**/
import $ from 'jquery'
import 'bootstrap'
import 'bootstrap-switch'
import 'jquery-slimscroll'
import AutoSize from 'autosize'

// IE mode
var isRTL = false
var isIE8 = false
var isIE9 = false
var isIE10 = false

var resizeHandlers = []

var assetsPath = '../assets/'

var globalImgPath = 'global/img/'

var globalPluginsPath = 'global/plugins/'

var globalCssPath = 'global/css/'

// theme layout color set

var brandColors = {
  'blue': '#89C4F4',
  'red': '#F3565D',
  'green': '#1bbc9b',
  'purple': '#9b59b6',
  'grey': '#95a5a6',
  'yellow': '#F8CB00'
}

// initializes main settings
var handleInit = function () {
  if ($('body').css('direction') === 'rtl') {
    isRTL = true
  }

  isIE8 = !!navigator.userAgent.match(/MSIE 8.0/)
  isIE9 = !!navigator.userAgent.match(/MSIE 9.0/)
  isIE10 = !!navigator.userAgent.match(/MSIE 10.0/)

  if (isIE10) {
    $('html').addClass('ie10') // detect IE10 version
  }

  if (isIE10 || isIE9 || isIE8) {
    $('html').addClass('ie') // detect IE10 version
  }
}

// runs callback functions set by App.addResponsiveHandler().
var _runResizeHandlers = function () {
  // reinitialize other subscribed elements
  for (var i = 0; i < resizeHandlers.length; i++) {
    var each = resizeHandlers[i]
    each.call()
  }
}

var handleOnResize = function () {
  var windowWidth = $(window).width()
  var resize
  if (isIE8) {
    var currheight
    $(window).resize(function () {
      if (currheight === document.documentElement.clientHeight) {
        return // quite event since only body resized not window.
      }
      if (resize) {
        clearTimeout(resize)
      }
      resize = setTimeout(function () {
        _runResizeHandlers()
      }, 50) // wait 50ms until window resize finishes.
      currheight = document.documentElement.clientHeight // store last body client height
    })
  } else {
    $(window).resize(function () {
      if ($(window).width() !== windowWidth) {
        windowWidth = $(window).width()
        if (resize) {
          clearTimeout(resize)
        }
        resize = setTimeout(function () {
          _runResizeHandlers()
        }, 50) // wait 50ms until window resize finishes.
      }
    })
  }
}

// Handlesmaterial design checkboxes
var handleMaterialDesign = function () {
  // Material design ckeckbox and radio effects
  $('body').on('click', '.md-checkbox > label, .md-radio > label', function () {
    var the = $(this)
    // find the first span which is our circle/bubble
    var el = $(this).children('span:first-child')

    // add the bubble class (we do this so it doesnt show on page load)
    el.addClass('inc')

    // clone it
    var newone = el.clone(true)

    // add the cloned version before our original
    el.before(newone)

    // remove the original so that it is ready to run on next click
    $('.' + el.attr('class') + ':last', the).remove()
  })

  if ($('body').hasClass('page-md')) {
    // Material design click effect
    // credit where credit's due http://thecodeplayer.com/walkthrough/ripple-click-effect-google-material-design
    var element, circle, d, x, y
    $('body').on('click', 'a.btn, button.btn, input.btn, label.btn', function (e) {
      element = $(this)

      if (element.find('.md-click-circle').length === 0) {
        element.prepend('<span class="md-click-circle"></span>')
      }

      circle = element.find('.md-click-circle')
      circle.removeClass('md-click-animate')

      if (!circle.height() && !circle.width()) {
        d = Math.max(element.outerWidth(), element.outerHeight())
        circle.css({height: d, width: d})
      }

      x = e.pageX - element.offset().left - circle.width() / 2
      y = e.pageY - element.offset().top - circle.height() / 2

      circle.css({top: y + 'px', left: x + 'px'}).addClass('md-click-animate')

      setTimeout(function () {
        circle.remove()
      }, 1000)
    })
  }

  // Floating labels
  var handleInput = function (el) {
    if (el.val() !== '') {
      el.addClass('edited')
    } else {
      el.removeClass('edited')
    }
  }

  $('body').on('keydown', '.form-md-floating-label .form-control', function (e) {
    handleInput($(this))
  })
  $('body').on('blur', '.form-md-floating-label .form-control', function (e) {
    handleInput($(this))
  })

  $('.form-md-floating-label .form-control').each(function () {
    if ($(this).val().length > 0) {
      $(this).addClass('edited')
    }
  })
}

// Handles custom checkboxes & radios using jQuery iCheck plugin
var handleiCheck = function () {
  if (!$().iCheck) {
    return
  }

  $('.icheck').each(function () {
    var checkboxClass = $(this).attr('data-checkbox') ? $(this).attr('data-checkbox') : 'icheckbox_minimal-grey'
    var radioClass = $(this).attr('data-radio') ? $(this).attr('data-radio') : 'iradio_minimal-grey'

    if (checkboxClass.indexOf('_line') > -1 || radioClass.indexOf('_line') > -1) {
      $(this).iCheck({
        checkboxClass: checkboxClass,
        radioClass: radioClass,
        insert: '<div class="icheck_line-icon"></div>' + $(this).attr('data-label')
      })
    } else {
      $(this).iCheck({
        checkboxClass: checkboxClass,
        radioClass: radioClass
      })
    }
  })
}

// Handles Bootstrap switches
var handleBootstrapSwitch = function () {
  if (!$().bootstrapSwitch) {
    return
  }
  $('.make-switch').bootstrapSwitch()
}

// Handles Bootstrap confirmations
var handleBootstrapConfirmation = function () {
  if (!$().confirmation) {
    return
  }
  $('[data-toggle=confirmation]').confirmation({btnOkClass: 'btn btn-sm btn-success', btnCancelClass: 'btn btn-sm btn-danger'})
}

// Handles Bootstrap Accordions.
var handleAccordions = function () {
  $('body').on('shown.bs.collapse', '.accordion.scrollable', function (e) {
    App.scrollTo($(e.target))
  })
}

// Handles Bootstrap Tabs.
var handleTabs = function () {
  // activate tab if tab id provided in the URL
  if (encodeURI(location.hash)) {
    var tabid = encodeURI(location.hash.substr(1))
    $('a[href="#' + tabid + '"]').parents('.tab-pane:hidden').each(function () {
      var tabid = $(this).attr('id')
      $('a[href="#' + tabid + '"]').click()
    })
    $('a[href="#' + tabid + '"]').click()
  }

  if ($().tabdrop) {
    $('.tabbable-tabdrop .nav-pills, .tabbable-tabdrop .nav-tabs').tabdrop({
      text: '<i class="fa fa-ellipsis-v"></i>&nbsp<i class="fa fa-angle-down"></i>'
    })
  }
}

// Handles Bootstrap Modals.
var handleModals = function () {
  // fix stackable modal issue: when 2 or more modals opened, closing one of modal will remove .modal-open class.
  $('body').on('hide.bs.modal', function () {
    if ($('.modal:visible').size() > 1 && $('html').hasClass('modal-open') === false) {
      $('html').addClass('modal-open')
    } else if ($('.modal:visible').size() <= 1) {
      $('html').removeClass('modal-open')
    }
  })

  // fix page scrollbars issue
  $('body').on('show.bs.modal', '.modal', function () {
    if ($(this).hasClass('modal-scroll')) {
      $('body').addClass('modal-open-noscroll')
    }
  })

  // fix page scrollbars issue
  $('body').on('hidden.bs.modal', '.modal', function () {
    $('body').removeClass('modal-open-noscroll')
  })

  // remove ajax content and remove cache on modal closed
  $('body').on('hidden.bs.modal', '.modal:not(.modal-cached)', function () {
    $(this).removeData('bs.modal')
  })
}

// Handles Bootstrap Tooltips.
var handleTooltips = function () {
  // global tooltips
  $('.tooltips').tooltip()

  // portlet tooltips
  $('.portlet > .portlet-title .fullscreen').tooltip({
    trigger: 'hover',
    container: 'body',
    title: 'Fullscreen'
  })
  $('.portlet > .portlet-title > .tools > .reload').tooltip({
    trigger: 'hover',
    container: 'body',
    title: 'Reload'
  })
  $('.portlet > .portlet-title > .tools > .remove').tooltip({
    trigger: 'hover',
    container: 'body',
    title: 'Remove'
  })
  $('.portlet > .portlet-title > .tools > .config').tooltip({
    trigger: 'hover',
    container: 'body',
    title: 'Settings'
  })
  $('.portlet > .portlet-title > .tools > .collapse, .portlet > .portlet-title > .tools > .expand').tooltip({
    trigger: 'hover',
    container: 'body',
    title: 'Collapse/Expand'
  })
}

// Handles Bootstrap Dropdowns
var handleDropdowns = function () {
  /*
   Hold dropdown on click
   */
  $('body').on('click', '.dropdown-menu.hold-on-click', function (e) {
    e.stopPropagation()
  })
}

var handleAlerts = function () {
  $('body').on('click', '[data-close="alert"]', function (e) {
    $(this).parent('.alert').hide()
    $(this).closest('.note').hide()
    e.preventDefault()
  })

  $('body').on('click', '[data-close="note"]', function (e) {
    $(this).closest('.note').hide()
    e.preventDefault()
  })

  $('body').on('click', '[data-remove="note"]', function (e) {
    $(this).closest('.note').remove()
    e.preventDefault()
  })
}

// Handle textarea autosize
var handleTextareaAutosize = function () {
  if (typeof AutoSize === 'function') {
    AutoSize(document.querySelector('textarea.autosizeme'))
  }
}

// Handles Bootstrap Popovers

// last popep popover
var lastPopedPopover

var handlePopovers = function () {
  $('.popovers').popover()

  // close last displayed popover

  $(document).on('click.bs.popover.data-api', function (e) {
    if (lastPopedPopover) {
      lastPopedPopover.popover('hide')
    }
  })
}

// Handles scrollable contents using jQuery SlimScroll plugin.
var handleScrollers = function () {
  App.initSlimScroll('.scroller')
}

// Handles Image Preview using jQuery Fancybox plugin
var handleFancybox = function () {
  if (!$.fancybox) {
    return
  }

  if ($('.fancybox-button').size() > 0) {
    $('.fancybox-button').fancybox({
      groupAttr: 'data-rel',
      prevEffect: 'none',
      nextEffect: 'none',
      closeBtn: true,
      helpers: {
        title: {
          type: 'inside'
        }
      }
    })
  }
}

// Handles counterup plugin wrapper
var handleCounterup = function () {
  if (!$().counterUp) {
    return
  }

  $('[data-counter="counterup"]').counterUp({
    delay: 10,
    time: 1000
  })
}

// Fix input placeholder issue for IE8 and IE9
var handleFixInputPlaceholderForIE = function () {
  // fix html5 placeholder attribute for ie7 & ie8
  if (isIE8 || isIE9) { // ie8 & ie9
    // this is html5 placeholder fix for inputs, inputs with placeholder-no-fix class will be skipped(e.g: we need this for password fields)
    $('input[placeholder]:not(.placeholder-no-fix), textarea[placeholder]:not(.placeholder-no-fix)').each(function () {
      var input = $(this)

      if (input.val() === '' && input.attr('placeholder') !== '') {
        input.addClass('placeholder').val(input.attr('placeholder'))
      }

      input.focus(function () {
        if (input.val() === input.attr('placeholder')) {
          input.val('')
        }
      })

      input.blur(function () {
        if (input.val() === '' || input.val() === input.attr('placeholder')) {
          input.val(input.attr('placeholder'))
        }
      })
    })
  }
}

// Handle Select2 Dropdowns
var handleSelect2 = function () {
  if ($().select2) {
    $.fn.select2.defaults.set('theme', 'bootstrap')
    $('.select2me').select2({
      placeholder: 'Select',
      width: 'auto',
      allowClear: true
    })
  }
}

// handle group element heights
var handleHeight = function () {
  $('[data-auto-height]').each(function () {
    var parent = $(this)
    var items = $('[data-height]', parent)
    var height = 0
    var mode = parent.attr('data-mode')
    var offset = parseInt(parent.attr('data-offset') ? parent.attr('data-offset') : 0)

    items.each(function () {
      if ($(this).attr('data-height') === 'height') {
        $(this).css('height', '')
      } else {
        $(this).css('min-height', '')
      }

      var height_ = (mode === 'base-height' ? $(this).outerHeight() : $(this).outerHeight(true))
      if (height_ > height) {
        height = height_
      }
    })

    height = height + offset

    items.each(function () {
      if ($(this).attr('data-height') === 'height') {
        $(this).css('height', height)
      } else {
        $(this).css('min-height', height)
      }
    })

    if (parent.attr('data-related')) {
      $(parent.attr('data-related')).css('height', parent.height())
    }
  })
}

let App = new class {
  // main function to initiate the theme
  init () {
    // IMPORTANT!!!: Do not modify the core handlers call order.

    // Core handlers
    handleInit() // initialize core variables
    handleOnResize() // set and handle responsive

    // UI Component handlers
    handleMaterialDesign() // handle material design
    handleiCheck() // handles custom icheck radio and checkboxes
    handleBootstrapSwitch() // handle bootstrap switch plugin
    handleScrollers() // handles slim scrolling contents
    handleFancybox() // handle fancy box
    handleSelect2() // handle custom Select2 dropdowns
    handleAlerts() // handle closabled alerts
    handleDropdowns() // handle dropdowns
    handleTabs() // handle tabs
    handleTooltips() // handle bootstrap tooltips
    handlePopovers() // handles bootstrap popovers
    handleAccordions() // handles accordions
    handleModals() // handle modals
    handleBootstrapConfirmation() // handle bootstrap confirmations
    handleTextareaAutosize() // handle autosize textareas
    handleCounterup() // handle counterup instances

    // Handle group element heights
    App.addResizeHandler(handleHeight) // handle auto calculating height on window resize

    // Hacks
    handleFixInputPlaceholderForIE() // IE8 & IE9 input placeholder issue fix
  }

  // main function to initiate core javascript after ajax complete
  initAjax () {
    // handleUniform() // handles custom radio & checkboxes
    handleiCheck() // handles custom icheck radio and checkboxes
    handleBootstrapSwitch() // handle bootstrap switch plugin
    handleScrollers() // handles slim scrolling contents
    handleSelect2() // handle custom Select2 dropdowns
    handleFancybox() // handle fancy box
    handleDropdowns() // handle dropdowns
    handleTooltips() // handle bootstrap tooltips
    handlePopovers() // handles bootstrap popovers
    handleAccordions() // handles accordions
    handleBootstrapConfirmation() // handle bootstrap confirmations
  }

  // init main components
  initComponents () {
    this.initAjax()
  }

  // public function to remember last opened popover that needs to be closed on click
  setLastPopedPopover (el) {
    lastPopedPopover = el
  }

  // public function to add callback a function which will be called on window resize
  addResizeHandler (func) {
    resizeHandlers.push(func)
  }

  // public functon to call _runresizeHandlers
  runResizeHandlers () {
    _runResizeHandlers()
  }

  // wrApper function to scroll(focus) to an element
  scrollTo (el, offeset) {
    var pos = (el && el.size() > 0) ? el.offset().top : 0

    if (el) {
      if ($('body').hasClass('page-header-fixed')) {
        pos = pos - $('.page-header').height()
      } else if ($('body').hasClass('page-header-top-fixed')) {
        pos = pos - $('.page-header-top').height()
      } else if ($('body').hasClass('page-header-menu-fixed')) {
        pos = pos - $('.page-header-menu').height()
      }
      pos = pos + (offeset !== undefined ? offeset : -1 * el.height())
    }

    $('html,body').animate({
      scrollTop: pos
    }, 'slow')
  }

  initSlimScroll (el) {
    if (!$().slimScroll) {
      return
    }

    $(el).each(function () {
      if ($(this).attr('data-initialized')) {
        return // exit
      }

      var height

      if ($(this).attr('data-height')) {
        height = $(this).attr('data-height')
      } else {
        height = $(this).css('height')
      }

      $(this).slimScroll({
        allowPageScroll: true, // allow page scroll when the element scroll is ended
        size: '7px',
        color: ($(this).attr('data-handle-color') ? $(this).attr('data-handle-color') : '#bbb'),
        wrapperClass: ($(this).attr('data-wrapper-class') ? $(this).attr('data-wrapper-class') : 'slimScrollDiv'),
        railColor: ($(this).attr('data-rail-color') ? $(this).attr('data-rail-color') : '#eaeaea'),
        position: isRTL ? 'left' : 'right',
        height: height,
        alwaysVisible: ($(this).attr('data-always-visible') === '1'),
        railVisible: ($(this).attr('data-rail-visible') === '1'),
        disableFadeOut: true
      })

      $(this).attr('data-initialized', '1')
    })
  }

  destroySlimScroll (el) {
    if (!$().slimScroll) {
      return
    }

    $(el).each(function () {
      if ($(this).attr('data-initialized') === '1') { // destroy existing instance before updating the height
        $(this).removeAttr('data-initialized')
        $(this).removeAttr('style')

        var attrList = {}

        // store the custom attribures so later we will reassign.
        if ($(this).attr('data-handle-color')) {
          attrList['data-handle-color'] = $(this).attr('data-handle-color')
        }
        if ($(this).attr('data-wrapper-class')) {
          attrList['data-wrapper-class'] = $(this).attr('data-wrapper-class')
        }
        if ($(this).attr('data-rail-color')) {
          attrList['data-rail-color'] = $(this).attr('data-rail-color')
        }
        if ($(this).attr('data-always-visible')) {
          attrList['data-always-visible'] = $(this).attr('data-always-visible')
        }
        if ($(this).attr('data-rail-visible')) {
          attrList['data-rail-visible'] = $(this).attr('data-rail-visible')
        }

        $(this).slimScroll({
          wrapperClass: ($(this).attr('data-wrapper-class') ? $(this).attr('data-wrapper-class') : 'slimScrollDiv'),
          destroy: true
        })

        var the = $(this)

        // reassign custom attributes
        $.each(attrList, function (key, value) {
          the.attr(key, value)
        })
      }
    })
  }

  // function to scroll to the top
  scrollTop () {
    App.scrollTo()
  }

  // wrApper function to  block element(indicate loading)
  blockUI (options) {
    options = $.extend(true, {}, options)
    var html = ''
    if (options.animate) {
      html = '<div class="loading-message ' + (options.boxed ? 'loading-message-boxed' : '') + '">' + '<div class="block-spinner-bar"><div class="bounce1"></div><div class="bounce2"></div><div class="bounce3"></div></div>' + '</div>'
    } else if (options.iconOnly) {
      html = '<div class="loading-message ' + (options.boxed ? 'loading-message-boxed' : '') + '"><img src="' + this.getGlobalImgPath() + 'loading-spinner-grey.gif" align=""></div>'
    } else if (options.textOnly) {
      html = '<div class="loading-message ' + (options.boxed ? 'loading-message-boxed' : '') + '"><span>&nbsp&nbsp' + (options.message ? options.message : 'LOADING...') + '</span></div>'
    } else {
      html = '<div class="loading-message ' + (options.boxed ? 'loading-message-boxed' : '') + '"><img src="' + this.getGlobalImgPath() + 'loading-spinner-grey.gif" align=""><span>&nbsp&nbsp' + (options.message ? options.message : 'LOADING...') + '</span></div>'
    }

    if (options.target) { // element blocking
      var el = $(options.target)
      if (el.height() <= ($(window).height())) {
        options.cenrerY = true
      }
      el.block({
        message: html,
        baseZ: options.zIndex ? options.zIndex : 1000,
        centerY: options.cenrerY !== undefined ? options.cenrerY : false,
        css: {
          top: '10%',
          border: '0',
          padding: '0',
          backgroundColor: 'none'
        },
        overlayCSS: {
          backgroundColor: options.overlayColor ? options.overlayColor : '#555',
          opacity: options.boxed ? 0.05 : 0.1,
          cursor: 'wait'
        }
      })
    } else { // page blocking
      $.blockUI({
        message: html,
        baseZ: options.zIndex ? options.zIndex : 1000,
        css: {
          border: '0',
          padding: '0',
          backgroundColor: 'none'
        },
        overlayCSS: {
          backgroundColor: options.overlayColor ? options.overlayColor : '#555',
          opacity: options.boxed ? 0.05 : 0.1,
          cursor: 'wait'
        }
      })
    }
  }

  // wrApper function to  un-block element(finish loading)
  unblockUI (target) {
    if (target) {
      $(target).unblock({
        onUnblock: function () {
          $(target).css('position', '')
          $(target).css('zoom', '')
        }
      })
    } else {
      $.unblockUI()
    }
  }

  startPageLoading (options) {
    if (options && options.animate) {
      $('.page-spinner-bar').remove()
      $('body').append('<div class="page-spinner-bar"><div class="bounce1"></div><div class="bounce2"></div><div class="bounce3"></div></div>')
    } else {
      $('.page-loading').remove()
      $('body').append('<div class="page-loading"><img src="' + this.getGlobalImgPath() + 'loading-spinner-grey.gif"/>&nbsp&nbsp<span>' + (options && options.message ? options.message : 'Loading...') + '</span></div>')
    }
  }

  stopPageLoading () {
    $('.page-loading, .page-spinner-bar').remove()
  }

  alert (options) {
    options = $.extend(true, {
      container: '', // alerts parent container(by default placed after the page breadcrumbs)
      place: 'append', // 'append' or 'prepend' in container
      type: 'success', // alert's type
      message: '', // alert's message
      close: true, // make alert closable
      reset: true, // close all previouse alerts first
      focus: true, // auto scroll to the alert after shown
      closeInSeconds: 0, // auto close after defined seconds
      icon: '' // put icon before the message
    }, options)

    var id = App.getUniqueID('App_alert')

    var html = '<div id="' + id + '" class="custom-alerts alert alert-' + options.type + ' fade in">' + (options.close ? '<button type="button" class="close" data-dismiss="alert" aria-hidden="true"></button>' : '') + (options.icon !== '' ? '<i class="fa-lg fa fa-' + options.icon + '"></i>  ' : '') + options.message + '</div>'

    if (options.reset) {
      $('.custom-alerts').remove()
    }

    if (!options.container) {
      if ($('.page-fixed-main-content').size() === 1) {
        $('.page-fixed-main-content').prepend(html)
      } else if (($('body').hasClass('page-container-bg-solid') || $('body').hasClass('page-content-white')) && $('.page-head').size() === 0) {
        $('.page-title').after(html)
      } else {
        if ($('.page-bar').size() > 0) {
          $('.page-bar').after(html)
        } else {
          $('.page-breadcrumb, .breadcrumbs').after(html)
        }
      }
    } else {
      if (options.place === 'append') {
        $(options.container).append(html)
      } else {
        $(options.container).prepend(html)
      }
    }

    if (options.focus) {
      App.scrollTo($('#' + id))
    }

    if (options.closeInSeconds > 0) {
      setTimeout(function () {
        $('#' + id).remove()
      }, options.closeInSeconds * 1000)
    }

    return id
  }

  // public function to initialize the fancybox plugin

  initFancybox () {
    handleFancybox()
  }

  // public helper function to get actual input value(used in IE9 and IE8 due to placeholder attribute not supported)
  getActualVal (el) {
    el = $(el)
    if (el.val() === el.attr('placeholder')) {
      return ''
    }
    return el.val()
  }

  // public function to get a paremeter by name from URL
  getURLParameter (paramName) {
    var searchString = window.location.search.substring(1)
    var i
    var val
    var params = searchString.split('&')

    for (i = 0; i < params.length; i++) {
      val = params[i].split('=')
      if (val[0] === paramName) {
        return unescape(val[1])
      }
    }
    return null
  }

  // check for device touch support
  isTouchDevice () {
    try {
      document.createEvent('TouchEvent')
      return true
    } catch (e) {
      return false
    }
  }

  // To get the correct viewport width based on  http://andylangton.co.uk/articles/javascript/get-viewport-size-javascript/
  getViewPort () {
    var e = window
    var a = 'inner'
    if (!('innerWidth' in window)) {
      a = 'client'
      e = document.documentElement || document.body
    }

    return {
      width: e[a + 'Width'],
      height: e[a + 'Height']
    }
  }

  getUniqueID (prefix) {
    return 'prefix_' + Math.floor(Math.random() * (new Date()).getTime())
  }

  // check IE8 mode
  isIE8 () {
    return isIE8
  }

  // check IE9 mode
  isIE9 () {
    return isIE9
  }

  // check RTL mode
  isRTL () {
    return isRTL
  }

  getAssetsPath () {
    return assetsPath
  }

  setAssetsPath (path) {
    assetsPath = path
  }

  setGlobalImgPath (path) {
    globalImgPath = path
  }

  getGlobalImgPath () {
    return assetsPath + globalImgPath
  }

  setGlobalPluginsPath (path) {
    globalPluginsPath = path
  }

  getGlobalPluginsPath () {
    return assetsPath + globalPluginsPath
  }

  getGlobalCssPath () {
    return assetsPath + globalCssPath
  }

  // get layout color code by color name
  getBrandColor (name) {
    if (brandColors[name]) {
      return brandColors[name]
    } else {
      return ''
    }
  }

  getResponsiveBreakpoint (size) {
    // bootstrap responsive breakpoints
    var sizes = {
      'xs': 480,     // extra small
      'sm': 768,     // small
      'md': 992,     // medium
      'lg': 1200     // large
    }

    return sizes[size] ? sizes[size] : 0
  }
}()

export default App
