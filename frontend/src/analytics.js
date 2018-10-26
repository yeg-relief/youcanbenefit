module.exports = function (tracking_id, src, trace) {
    try {
        (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
            (i[r].q=i[r].q||[]).push(arguments)};i[r].l=1*new Date();a=s.createElement(o);
            m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
        })(window,document,'script',src,'ga');

        (function(){
            var script = document.createElement('script');
            var m = document.getElementsByTagName('script')[0];
            script.async = true;
            script.src = "/assets/autotrack.custom.js";
            m.parentNode.insertBefore(script, m)
        })();

        window.ga_debug = { trace: trace || false };
        ga('create', tracking_id, 'auto');
        ga('require', 'eventTracker');
        ga('require', 'urlChangeTracker');
        ga('require', 'outboundLinkTracker');
        ga('send', 'pageview');
    } catch(e) {
        console.log("COULD NOT CREATE DYNAMIC ANALYTICS SCRIPT.");
        console.error(e)
    }
};
