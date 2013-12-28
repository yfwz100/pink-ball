/*globals jQuery */
/*jslint browser: true, evil: true */
(function ($) {
    'use strict';
    
    if ($) {
        document.write('<style>.container { opacity: 0; transition: 1s; }</style>');
    }
    
    $(function () {
        $(window).resize(function (event) {
            var $stage = $('#stage'),
                width = $stage.width(),
                height = $stage.height(),
                s = {
                    width: $(document).width(),
                    height: $(document).height()
                };

            $stage.css({
                position: 'absolute',
                left: (s.width - width) / 2 + 'px',
                top: (s.height - height) / 3 + 'px'
            });

        }).resize();
        $('.container').css('opacity', '1');
    });
}(jQuery));