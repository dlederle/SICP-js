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

//Chapter 4

var isTup = function(tup) {
  return isNull(tup) || (isNumber(car(tup)) && isTup(cdr(tup)));
};

var addTup = function(tup) {
  return isNull(tup) ? 0 : car(tup) + addTup(cdr(tup));
}

//Adds two tups of the same length
//Probably made this code too dense...
/*
var tupAdd = function(tup1, tup2) {
  return (isNull(tup1) && isNull(tup2)) ? [] : cons((car(tup1) + car(tup2)), tupAdd(cdr(tup1), cdr(tup2)));
}
*/

//Better version that takes two tups of any length
var tupAdd = function(tup1, tup2) {
  if(isNull(tup1) && isNull(tup2)) {
    return [];
  } else if(isNull(tup1)) {
    return tup2;
  } else if(isNull(tup2)) {
    return tup1;
  } else {
    return cons((car(tup1) + car(tup2)), tupAdd(cdr(tup1), cdr(tup2)));
  }
}

var length = function(lat) {
  return isNull(lat) ? 0 : 1 + length(cdr(lat));
}

//Don't think this is quite right..
var pick = function(n, lat) {
  if(n-1 == 0) {
    return car(lat);
  } else {
    return pick(n-1, cdr(lat));
  }
}

var no_nums = function(lat) {
  if(isNull(lat)) {
    return  [];
  } else if(isNumber(car(lat))) { 
    return no_nums(cdr(lat));
  } else {
    return cons(car(lat), no_nums(cdr(lat)));
  }
}

var all_nums = function(lat) {
  if(isNull(lat)) {
    return  [];
  } else if(isNumber(car(lat))) { 
    return cons(car(lat), all_nums(cdr(lat)));
  } else {
    return all_nums(cdr(lat));
  }
}

var occur = function(a, lat) {
  if(isNull(lat)) {
    return 0;
  } else if(isEq(car(lat), a)) {
    return 1 + occur(a, cdr(lat));
  } else {
    return occur(a, cdr(lat));
  }
}

//Chapter 5

//DOES NOT WORK
var remberstar = function(a, l) {
  if(isNull(l)) {
    return [];
  } 
  if(isAtom(car(l))) {
    if(isEq(car(l), a)) {
      remberstar(a, cdr(l));
    } else {
      cons(car(l), remberstar(a, cdr(l)));
    }
  } else {
    cons(remberstar(a, car(l)), remberstar(a, cdr(l)));
  }
}
print(remberstar("cup", [["coffee"], "cup", [["tea"], "cup"], ["and", ["hick"]], "cup"]));

function insertRStar(n, old, l) {

}

//Chapter 7

var isSet = function(lat) {
  if(isNull(lat)) {
    return true;  
  } else if(isMember(car(lat), cdr(lat))) {
    return false;
  } else {
    return isSet(cdr(lat));
  }
}

var makeset = function(lat) {
  /*
  if(isNull(lat)) {
    return [];
  } else if(isMember(car(lat), cdr(lat))) {
    return makeset(cdr(lat));
  } else {
    return cons(car(lat), makeset(cdr(lat)));
  }
  */
  return isNull(lat) ? [] : cons(car(lat), makeset(multirember(car(lat), cdr(lat))));
}

var isSubset = function(s1, s2) {
  /*
  if(isNull(s1)) {
    return true;
  } else if(isMember(car(s1), s2)) {
    return isSubset(cdr(s1), s2);
  } else {
    return false;
  }
  */
  return isNull(s1) ? true : isMember(car(s1), s2) && isSubset(cdr(s1), s2);
  return false;
}

var isEqSet = function(s1, s2) {
  return isSubset(s1, s2) && isSubset(s2, s1);
}

var isIntersect = function(s1, s2) {
  /*
  if(isNull(s1)) {
    return false;
  } else if(isMember(car(s1), s2)) {
    return true;
  } else {
    return isIntersect(cdr(s1), s2);
  }
  */
  return isNull(s1) ? false : isMember(car(s1), s2) || isIntersect(cdr(s1), s2);
}

var intersect = function(s1, s2) {
  if(isNull(s1)) {
    return [];
  } else if(isMember(car(s1), s2)) {
    return cons(car(s1), intersect(cdr(s1), s2));
  } else {
    return intersect(cdr(s1), s2);
  }
}

var union = function(s1, s2) {
  if(isNull(s1)) {
    return s2;
  } else if(isMember(car(s1), s2)) {
    return union(cdr(s1), s2);
  } else {
    return cons(car(s1), union(cdr(s1), s2));
  }
}

var intersectall = function(lset) {
  if(isNull(cdr(lset))) {
    return car(lset);
  } else {
    return intersect(car(lset), intersectall(cdr(lset)));
  }
}

var isPair = function(x) {
  /*
  if(isAtom(x) || isNull(x) || isNull(cdr(x))) {
    return false;
  } else if(isNull(cdr(cdr(x)))) {
    return true;
  } else {
    return false;
  }
  */
  return (isAtom(x) || isNull(x) || isNull(cdr(x))) ? false : isNull(cdr(cdr(x)));
}

var first = function(l) {
  return car(l);
}

var second = function(l) {
  return car(cdr(l));
}

var third = function(l) {
  return car(cdr(cdr(l)));
}

var build = function(s1, s2) {
  return cons(s1, cons(s2, []));
}

//This doesn't work quite right...
var isFun = function(rel) {
  return isSet(first(rel));
}

var x = [2, 3, 4, "apple", 5];
var y = [3, 4, 5, 7, "apple"];

//print(build(x, y));
