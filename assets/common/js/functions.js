function utf8_encode(s) {
    return unescape(encodeURIComponent(s));
  }

function utf8_decode(s) {
    return decodeURIComponent(escape(s));
  }