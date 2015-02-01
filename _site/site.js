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
        navItems.on('click', function (event) {
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
        $(navs[navID]).addClass('active');
    }
})(jQuery);


// Responsive Nav
(function ($) {
    
    var nav = null;
    var lisWidth = 0;
    var lisHeight = 0;
    var navHeight = 0;
    var liCount = 0;
    var navFixed = false;
    
    $.fn.responsiveNav = function (options) {
        nav = this
        
        this.find('li').each( function() {
            liCount += 1
            navHeight = $(this).outerHeight()
            lisWidth += $(this).width()
        })
        
        updateNav()
        
        $(window).on('resize orientationChanged', updateNav)
    };
    
    function updateNav() {
        if (lisWidth > window.innerWidth) {
            addClassToLis(nav)
            attachClickListener(nav);
        } else {
            removeClassFromLis(nav)
            detachClickListener(nav);
        }
    }
    
    function addClassToLis(nav) {
        nav.find('li').each( function() {
            $(this).addClass("nav-collapse")
        })
        
        if (!navFixed) {
            var $ul = nav.find('ul')

            var active = $ul.find('.active').text()
            if (!active) active = $ul.find('li:first').text()

            nav.find('ul').append('<li><a href="#menu">' + active + '   <span id="menu">&#x2261;</span></a></li>')
            nav.css("position", "fixed")
            nav.css("top", "-" + ((liCount * navHeight) + 3) + "px")
        }
        
        navFixed = true
    }
    
    function removeClassFromLis(nav) {
        nav.find('li').each( function() {
            console.log($(this))
            $(this).removeClass("nav-collapse")
        })
        nav.css("position", "static")
    }

    function attachClickListener(nav) {
        console.log("NAV ATTACHED")
        nav.on('click', function (e) {
            console.log("NAV CLICKED")
        });
    }
    
    function detachClickListener(nav) {
        console.log("NAV REMOVED")
        nav.off('click')
    }

})(jQuery);


$(document).ready(function () {
    
    $('nav').responsiveNav();

    $('nav li a').navScroller();

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