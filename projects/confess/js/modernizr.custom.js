/* Minimal Modernizr shim – provides only cssanimations + prefixed() needed by transisi.js */
window.Modernizr = (function () {
    var style = document.createElement('div').style;

    function prefixed(prop) {
        var prefixes = ['', 'Webkit', 'Moz', 'O', 'ms'];
        var cap = prop.charAt(0).toUpperCase() + prop.slice(1);
        for (var i = 0; i < prefixes.length; i++) {
            var p = prefixes[i] + (i === 0 ? prop : cap);
            if (p in style) {
                return i === 0 ? prop : prefixes[i] + cap;
            }
        }
        return false;
    }

    var cssAnimations = 'animationName' in style ||
                        'WebkitAnimationName' in style ||
                        'MozAnimationName' in style;

    return {
        cssanimations: cssAnimations,
        prefixed: prefixed
    };
}());
