/*
 * serializeForm
 * https://github.com/danheberden/serializeForm
 *
 * Copyright (c) 2012 Dan Heberden
 * Licensed under the MIT, GPL licenses.
 */
(function( $ ){
  $.fn.serializeForm = function(options) {

    // don't do anything if we didn't get any elements
    if ( this.length < 1) {
      return false;
    }

    var data = {};
    var lookup = data; //current reference of data
    var selector = ':input[type!="checkbox"][type!="radio"], input:checked';
    var checkboxBoolean = null;
    if (options && options.checkboxBoolean) {
        selector = ':input[type!="radio"], input[type=radio]:checked';
        // checkboxBoolean can be 1 or true
        checkboxBoolean = options.checkboxBoolean;
    }

    var getVal = function($el) {
        // the value will only match 'on' if there is no value set on the checkbox
        // however I feel like I've seen an 'off' value before when not checked
        // so I'm checking for that as well out of paranoia
        if (checkboxBoolean && $el.val().match(/^(on|off)$/)) {
            if (checkboxBoolean === 1) {
                return ($el.is(':checked')) ? 1 : 0;
            } else if (checkboxBoolean === true) {
                return $el.is(':checked');
            }
        }

        return $el.val();
    };
    var parse = function() {

      // Ignore disabled elements
      if (this.disabled) {
        return;
      }

      // data[a][b] becomes [ data, a, b ]
      var named = this.name.replace(/\[([^\]]+)?\]/g, ',$1').split(',');
      var cap = named.length - 1;
      var $el = $( this );

      // Ensure that only elements with valid `name` properties will be serialized
      if ( named[ 0 ] ) {
        for ( var i = 0; i < cap; i++ ) {
          // move down the tree - create objects or array if necessary
          lookup = lookup[ named[i] ] = lookup[ named[i] ] ||
            ( (named[ i + 1 ] === "" || named[ i + 1 ] === '0') ? [] : {} );
        }

        // at the end, push or assign the value
        if ( lookup.length !==  undefined ) {
          lookup.push( getVal($el) );
        } else {
          lookup[ named[ cap ] ]  = getVal($el);
        }

        // assign the reference back to root
        lookup = data;
      }
    };

    // first, check for elements passed into this function
    this.filter( selector ).each( parse );

    // then parse possible child elements
    this.find( selector ).each( parse );

    // return data
    return data;
  };
}( jQuery ));
