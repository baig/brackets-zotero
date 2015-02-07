/**
 * Notify.js
 *
 * Author: Wasif Hasan Baig <pr.wasif@gmail.com>
 *
 * Adapted from OhSnap.js (http://justindomingue.github.io/ohSnap/)
 * originally authored by Justin Domingue (https://github.com/justindomingue)
 */

var timeouts = [];

function _clearTimeOuts(arrTimeouts) {
    var size = arrTimeouts.length
    for (var i = 0; i < size; i++) {
        clearTimeout(timeouts[i]);
    }
}

function notify(text, color, icon, removePreviousOnes, dismiss) {
    // text : message to show (HTML tag allowed)
    // Available colors : red, green, blue, orange, yellow --- add your own!

    // Set some variables
    var time = '8000';
    var $container = $('#zotero-notification-bar');
    var icon_markup = "";

    if (dismiss == void 0) dismiss = true;
    if (icon) icon_markup = "<span class='" + icon + "'></span> ";

    if (removePreviousOnes) {
        _clearTimeOuts(timeouts)
        console.log(timeouts)
        $container.children().remove()
    }

    // Generate the HTML
    var html = $('<div style="display: none" class="alert alert-' + color + '">' + icon_markup + text +
        ((!!dismiss) ? '' : ' - <em>click to dismiss</em>') +
        '</div>');

    // Append the label to the container
    $container.append(html);

    html.slideDown();

    // Remove the notification on click
    html.on('click', function () {
        xnotify($(this));
    });

    // After 'time' seconds, the animation fades out
    if (dismiss) {
        var timeoutId = setTimeout(function () {
            xnotify($container.children('.alert').first());
        }, time);
        timeouts.push(timeoutId)
    }
}

function xnotify(element) {
    // Called without argument, the function removes all alerts
    // element must be a jQuery object

    if (typeof element !== "undefined") {
        element.slideUp(function () {
            element.remove();
        })
    } else {
        $('.alert').slideUp(function () {
            $('.alert').remove();
        })
    }
}