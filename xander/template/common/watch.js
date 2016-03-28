(function($) {
    function update(){
        var now = moment(),
            second = now.seconds() * 6,
            minute = now.minutes() * 6 + second / 60,
            hour = ((now.hours() % 12) / 12) * 360 + 90 + minute / 12;


        jQuery('#hour').css("-webkit-transform", "rotate(" + hour + "deg)");
        jQuery('#minute').css("-webkit-transform", "rotate(" + minute + "deg)");
        jQuery('#second').css("-webkit-transform", "rotate(" + second + "deg)");
    }

    function timedUpdate () {
        update();
        setTimeout(timedUpdate, 1000);
    }
 
    timedUpdate();

})(jQuery);
