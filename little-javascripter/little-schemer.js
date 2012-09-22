// The Little JavaScripter
// http://www.crockford.com/javascript/little.js
// Copyright 2003 Douglas Crockford. All rights reserved wrrrld wide.

// May 4, 2011


// Produce a printable presentation of an s-expression

function p(x) {
    var r;
    if (isList(x)) {
        r = '(';
        do {
            r += p(car(x)) + ' ';
            x = cdr(x);
        } while (isList(x));
        if (r.charAt(r.length - 1) === ' ') {
            r = r.substr(0, r.length - 1);
        }
        if (isAtom(x)) {
            r += ' . ' + x;
        }
        return r + ')';
    }
    if (isNull(x)) {
        return '()';
    }
    return x;
}


// Produce an s-expression from a string.

var s = function (x) {

    var tx = /\s*(\(|\)|[^\s()]+|$)/g,
        result;
    tx.lastIndex = 0;
    result = (function list() {
        var head = null,
            neo  = null,
            r    = tx.exec(x),
            sexp = (r && r[1]) || '',
            tail = null;

        if (sexp !== '(') {
            return sexp;
        }
        while (true) {
            sexp = list();
            if (sexp === '' || sexp === ')') {
                return head;
            }
            neo = [sexp];
            if (tail) {
                tail[1] = neo;
            } else {
                tail = head = neo;
            }
            tail = neo;
        }
    }());
    s.lastIndex = tx.lastIndex;
    return result;
};


// Produce an object using another object as its prototype.

Object.prototype.begetObject = function () {
    var F = function () {};
    F.prototype = this;
    return new F();
};

var global = this;


// Little Scheme primitives

function add1(n) {
  return +n + 1;
}

function car(s) {
  return s[0];
}

function cdr(s) {
  //return s[1];
  //Crockford's version is the line above
  return s.slice(1, s.length);
}

function cons(a, d) {
  //return [a, d];
  //Crockford's version is the line above
  var x = d;
  x.unshift(a);
  return x;
}

function isAtom(a) {
  return typeof a === 'string' || 
         typeof a === 'number' || 
         typeof a === 'boolean';
}

function isBoolean(a) {
  return typeof a === 'boolean';
}

function isEq(s, t) {
  return s === t;
}

function isFunction(a) {
  return typeof a === 'function';
}

function isList(a) {
  return a && typeof a === 'object' && a.constructor === Array;
}

function isNumber(a) {
  return isFinite(a);
}

function isNull(a) {
  //return typeof a === 'undefined' || (typeof a === 'object' && !a);
  //Crockford's version is the line above
  return typeof a === 'undefined' || typeof a[0] === 'undefined';
}

function isUndefined(a) {
  return typeof a === 'undefined';
}

function isZero(s) {
  return s === 0;
}

function sub1(n) {
  return n - 1;
}

// Took the primitives from Crockford, will define the rest myself
// Will redefine primitives if need be
// dlederle, 8/12/12

function print(x) {
  console.log(x);  
}

// Chapter 2
var isLat = function(l) {
  return isNull(l) || (isAtom(car(l)) && isLat(cdr(l)));
};

var isMember = function(a, lat) {
  return isNull(lat) ? false : isEq(a, car(lat)) || isMember(a, cdr(lat));
};

// Chapter 3
var rember = function(a, lat) {
  if (isNull(lat)) {
    return [];
  } else if (isEq(a, car(lat))) { 
    return cdr(lat) 
  } else {
      return cons(car(lat), rember(a, cdr(lat)))
  }
};

var firsts = function(l) {
  return isNull(l) ? [] : cons(car(car(l)), firsts(cdr(l)));
};
/*print(firsts([["apple", "peach", "pumpkin"],
              ["plum", "pear", "cherry"],
              ["grape", "raisin", "pea"],
              ["bean", "carrot", "eggplant"]]));

print(firsts([[["five", "plums"],
              ["four"]],
              ["eleven", "green", "oranges"],
              [["no"], "more"]]));
In my own words: firsts returns the first element of each list it is given.
 * Their words were a bit more precise...
*/

/*
 * In my own words: insertR takes three values, a new value, 
 * an old value and a list. It searches for the old value in 
 * the list, and inserts the new value to the right of the old. */
var insertR = function(n, o, l) {
  if (isNull(l)) {
    return [];
  } else if (isEq(o, car(l))) {
    return cons(o, cons(n, cdr(l))); //Add new on the rest of the list, then add old back
  } else {
    return cons(car(l), insertR(n, o, cdr(l)));
  }
};

var insertL = function(n, o, l) {
  if (isNull(l)) {
    return [];
  } else if (isEq(o, car(l))) {
    return cons(n, cons(o, cdr(l))); 
  } else {
    return cons(car(l), insertL(n, o, cdr(l)));
  }
};

var subst = function(n, o, l) {
  if (isNull(l)) {
    return [];
  } else if (isEq(o, car(l))) {
    return cons(n, cdr(l)); 
  } else {
    return cons(car(l), subst(n, o, cdr(l)));
  }
};

var multirember = function(a, l) {
  if(isNull(l)) {
    return [];
  } else if(isEq(car(l), a)) {
    return multirember(a, cdr(l));
  } else {
    return cons(car(l), multirember(a, cdr(l)));
  }
};

var multiinsertR = function(n, o, l) {
  if(isNull(l)) {
    return [];
  } else if(isEq(car(l), o)) {
    return cons(car(l), cons(n,
              multiinsertR(n, o, cdr(l))));
  } else {
    return cons(car(l), multiinsertR(n, o, cdr(l)));
  }
};

var multiinsertL = function(n, o, l) {
  if(isNull(l)) {
    return [];
  } else if(isEq(car(l), o)) {
    return cons(n, cons(car(l),
              multiinsertL(n, o, cdr(l))));
  } else {
    return cons(car(l), multiinsertL(n, o, cdr(l)));
  }
};

var multisubst = function(n, o, l) {
  if(isNull(l)) {
    return [];
  } else if(isEq(car(l), o)) {
    return cons(n, multisubst(n, o, cdr(l)));
  } else {
    return cons(car(l), multisubst(n, o, cdr(l)));
  }
};


