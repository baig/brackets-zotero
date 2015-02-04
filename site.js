$.extend($.easing, {
    def: 'easeOutQuad',
    easeInOutExpo: function (x, t, b, c, d) {
        if (t == 0) return b;
        if (t == d) return b + c;
        if ((t /= d / 2) < 1) return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
        return c / 2 * (-Math.pow(2, -10 * --t) + 2) + b;
    }
});

// NavScroller
(function ($) {

    var settings;
    var disableScrollFn = false;
    var navItems;
    var navs = {},
        sections = {};

    $.fn.navScroller = function (options) {
        settings = $.extend({
            scrollToOffset: 70,
            scrollSpeed: 800,
            activateParentNode: true,
        }, options);
        navItems = this;

        //attatch click listeners
        navItems.on('load click', function (event) {
            event.preventDefault();
            var navID = $(this).attr("href").substring(1);
            disableScrollFn = true;
            activateNav(navID);
            populateDestinations(); //recalculate these!
            $('html,body').animate({
                    scrollTop: sections[navID] - settings.scrollToOffset
                },
                settings.scrollSpeed, "easeInOutExpo",
                function () {
                    disableScrollFn = false;
                }
            );
        });

        //populate lookup of clicable elements and destination sections
        populateDestinations(); //should also be run on browser resize, btw

        // setup scroll listener
        $(document).scroll(function () {
            if (disableScrollFn) {
                return;
            }
            var page_height = $(window).height();
            var pos = $(this).scrollTop();
            for (i in sections) {
                if ((pos + settings.scrollToOffset >= sections[i]) && sections[i] < pos + page_height) {
                    activateNav(i);
                }
            }
        });
    };

    function populateDestinations() {
        navItems.each(function () {
            var scrollID = $(this).attr('href').substring(1);
            navs[scrollID] = (settings.activateParentNode) ? this.parentNode : this;
            sections[scrollID] = $(document.getElementById(scrollID)).offset().top;
        });
    }

    function activateNav(navID) {
        for (nav in navs) {
            $(navs[nav]).removeClass('active');
        }
        $(navs[navID]).addClass('active').trigger("activated");
    }
})(jQuery);


// Responsive Nav
(function ($) {
    
    var nav = null;
    var $ul = null;
    var $lis = null;
    
    var lisWidth = 0;
    var ulHeight = 0;
    var isMini = false;
    var prevActive = "";
    
    $.fn.responsiveNav = function (options) {
        $nav = this
        $ul = $nav.find('ul')
        
        this.find('li').each( function() {
            lisWidth += $(this).width()
        })
        
        updateNav()
        $(window).on('resize orientationchange', updateNav)
    };
    
    function updateNav(e) {
        if (lisWidth > window.innerWidth) {
            var active
            if (!isMini) active = activeLi()
            else active = prevActive
            prevActive = active
            
            $ul.css('display', 'none')
            
            attachA(active)
        } else {
            removeA()
            $ul.append($lis)
        }
    }
    
    function activeLi() {
        var active;
        active = $ul.find('li.active').text()
        if (!active) active = $ul.find('li:first').not('#temp').text()
        return active
    }
        
    function attachA(active) {
        // saving height of ul
        console.log(ulHeight)
        if (!isMini) {
            $nav.append(
                '<ul id="temp-ul">' +
                    '<li id="temp">' +
                        '<a id="label">' + active + '</a>' +
                        '<svg xmlns="http://www.w3.org/2000/svg" id="hamburger" height="32px" width="32px" version="1.1"><path d="M4,10h24c1.104,0,2-0.896,2-2s-0.896-2-2-2H4C2.896,6,2,6.896,2,8S2.896,10,4,10z M28,14H4c-1.104,0-2,0.896-2,2  s0.896,2,2,2h24c1.104,0,2-0.896,2-2S29.104,14,28,14z M28,22H4c-1.104,0-2,0.896-2,2s0.896,2,2,2h24c1.104,0,2-0.896,2-2  S29.104,22,28,22z"/></svg>' +
                    '</li>' +
                '</ul>'
            )
            
            $ul.children().css('display', 'block');
            $nav.append($ul.detach())
            
            $ul.hide();
            
            $nav.on('activated', autoUpdateLabel)
            
            $('svg#hamburger').on('click', showMenu)
        }
        
        isMini = true
    }
    
    function autoUpdateLabel(e) {
        console.log("ACTIVATED")
        var activeLabel = $(e.target).text()
        $('a#label').text(activeLabel)
    }
    
    function removeA() {
        $nav.find('ul#temp-ul').remove()
        $ul.css('display', 'block')
        $ul.children().css('display', 'inline-block');
        // Detaching Handlers
        $nav.off('activated')
        $('svg#hamburger').off('click')
        $ul.off('click')
        isMini = false
    }
    
    function showMenu(e) {
        if (!ulHeight) {
            ulHeight = $ul.height()
        }
        
        $ul.on('click', 'li', function(e) {
            $ul.fadeOut('fast', 'linear')
        })
        $ul.fadeToggle('fast', 'linear')
    }
        
    
})(jQuery);


$(document).ready(function () {
    
    $('nav li a').navScroller();

    $('nav').responsiveNav();

    //section divider icon click gently scrolls to reveal the section
    $(".sectiondivider").on('click', function (event) {
        $('html,body').animate({
            scrollTop: $(event.target.parentNode).offset().top - 50
        }, 400, "linear");
    });

    //links going to other sections nicely scroll
    $(".container a").each(function () {
        if ($(this).attr("href").charAt(0) == '#') {
            $(this).on('click', function (event) {
                event.preventDefault();
                var target = $(event.target).closest("a");
                var targetHight = $(target.attr("href")).offset().top
                $('html,body').animate({
//                    scrollTop: targetHight - 100
                    scrollTop: targetHight - 170
                }, 800, "easeInOutExpo");
            });
        }
    });

});