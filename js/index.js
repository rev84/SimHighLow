// Generated by CoffeeScript 1.10.0
var Utl, addHistory, init, initGraph, initTimes, n2filename, n2p, play, refreshTotal, sumHigh, sumLow;

window.times = [];

window.histories = [];

window.CONST_MAX_GRAPH_WIDTH = 300;

window.CONST_HISTORY_COUNT = 10;

window.CONST_SPEED = 10;

window.CONST_HISTORY_OK_MIN = 15;

$().ready(function() {
  return init();
});

init = function() {
  initGraph();
  initTimes();
  return play();
};

play = function(isCotinuePlay) {
  var ba, baP, get, getP, highNum, history, isSelectHigh, j, lowNum, n, ok, okP, powers, sameNum, trumps;
  if (isCotinuePlay == null) {
    isCotinuePlay = true;
  }
  trumps = [];
  for (n = j = 0; j < 54; n = ++j) {
    trumps.push(n);
  }
  trumps = Utl.shuffle(trumps);
  ok = 0;
  ba = trumps.pop();
  powers = Utl.arrayFill(13, 4);
  powers[13] = 2;
  powers[n2p(ba)]--;
  history = [];
  history.push([ba, null, null]);
  while (trumps.length > 0) {
    isSelectHigh = true;
    baP = n2p(ba);
    lowNum = sumLow(powers, baP);
    highNum = sumHigh(powers, baP);
    sameNum = powers[baP];
    if (lowNum > highNum) {
      isSelectHigh = false;
    }
    okP = isSelectHigh ? highNum / (lowNum + highNum + sameNum) : lowNum / (lowNum + highNum + sameNum);
    get = trumps.pop();
    getP = n2p(get);
    powers[getP]--;
    history.push([get, isSelectHigh, okP]);
    if ((baP < getP && isSelectHigh) || (baP > getP && !isSelectHigh)) {
      ok++;
    } else if ((baP > getP && isSelectHigh) || (baP < getP && !isSelectHigh)) {
      break;
    }
    ba = get;
  }
  addHistory({
    ok: ok,
    history: history
  });
  window.times[ok]++;
  refreshTotal();
  if (isCotinuePlay) {
    return setTimeout(play, window.CONST_SPEED);
  }
};

sumLow = function(ary, num) {
  var j, n, ref, sum;
  sum = 0;
  for (n = j = 0, ref = num; 0 <= ref ? j < ref : j > ref; n = 0 <= ref ? ++j : --j) {
    sum += n;
  }
  return sum;
};

sumHigh = function(ary, num) {
  var j, n, ref, ref1, sum;
  sum = 0;
  for (n = j = ref = num + 1, ref1 = ary.length; ref <= ref1 ? j < ref1 : j > ref1; n = ref <= ref1 ? ++j : --j) {
    sum += n;
  }
  return sum;
};

refreshTotal = function() {
  var maxTime, totalTime;
  $('.times').each(function() {
    return $(this).html(window.times[$(this).data('id')]);
  });
  totalTime = Utl.arraySum(window.times);
  $('.persent').each(function() {
    var persent;
    persent = window.times[$(this).data('id')] / totalTime * 100;
    persent = Math.round(persent * 1000000) / 1000000;
    return $(this).html('' + persent + '%');
  });
  maxTime = Utl.arrayMax(window.times);
  return $('.graph').each(function() {
    return $(this).css('width', window.CONST_MAX_GRAPH_WIDTH * window.times[$(this).data('id')] / maxTime);
  });
};

addHistory = function(hash) {
  var historyTr, isHigh, j, l, len, len1, len2, n, o, p, record, ref, ref1, ref2, str, table, tr;
  if (window.CONST_HISTORY_OK_MIN !== null && hash.ok < window.CONST_HISTORY_OK_MIN) {
    return;
  }
  historyTr = $('<tr>').append($('<td>').html(hash.ok));
  table = $('<table>');
  tr = $('<tr>');
  ref = hash.history;
  for (j = 0, len = ref.length; j < len; j++) {
    record = ref[j];
    n = record[0], isHigh = record[1], p = record[2];
    tr.append($('<td>').append($('<img>').attr('src', n2filename(n)).addClass('history_trump')));
  }
  table.append(tr);
  tr = $('<tr>');
  ref1 = hash.history;
  for (l = 0, len1 = ref1.length; l < len1; l++) {
    record = ref1[l];
    n = record[0], isHigh = record[1], p = record[2];
    str = '';
    if (isHigh === true) {
      str = 'High';
    } else if (isHigh === false) {
      str = 'Low';
    }
    tr.append($('<td>').html(str));
  }
  table.append(tr);
  tr = $('<tr>');
  ref2 = hash.history;
  for (o = 0, len2 = ref2.length; o < len2; o++) {
    record = ref2[o];
    n = record[0], isHigh = record[1], p = record[2];
    str = '';
    if (p !== null) {
      str = '' + (Math.round((p * 100) * 10) / 10) + '%';
    }
    tr.append($('<td>').html(str));
  }
  table.append(tr);
  historyTr.append(table);
  $('#history tr').eq(0).after(historyTr);
  if (window.CONST_HISTORY_COUNT !== null) {
    return $('#history>tbody>tr:gt(' + (window.CONST_HISTORY_COUNT + 2) + ')').remove();
  }
};

initTimes = function() {
  return window.times = Utl.arrayFill(54, 0);
};

initGraph = function() {
  var index, j, results, tr;
  tr = $('<tr>');
  tr.append($('<th>').html('成功')).append($('<th>').html('回数')).append($('<th>').html('割合')).append($('<th>').html('グラフ'));
  $('#result').append(tr);
  results = [];
  for (index = j = 0; j <= 53; index = ++j) {
    tr = $('<tr>').append($('<th>').html(index)).append($('<td>').addClass('times').data('id', index)).append($('<td>').addClass('persent').data('id', index)).append($('<td>').append($('<img>').attr('src', 'img/graph.png').addClass('graph').data('id', index)));
    results.push($('#result').append(tr));
  }
  return results;
};

n2p = function(n) {
  if (3 < (Math.floor(n / 13))) {
    return 13;
  }
  return n % 13;
};

n2filename = function(n) {
  var num, suit;
  suit = (function() {
    switch (Math.floor(n / 13)) {
      case 0:
        return 's';
      case 1:
        return 'd';
      case 2:
        return 'h';
      case 3:
        return 'c';
      default:
        return 'x';
    }
  })();
  num = n % 13 + 1;
  return 'img/' + suit + (Utl.zerofill(num, 2)) + '.png';
};

Utl = (function() {
  function Utl() {}

  Utl.numFormat = function(num) {
    return String(num).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,');
  };

  Utl.rand = function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  Utl.genPassword = function(length) {
    var chars, i, j, ref, res;
    if (length == null) {
      length = 4;
    }
    chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    res = '';
    for (i = j = 0, ref = length; 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
      res += chars.substr(this.rand(0, chars.length - 1), 1);
    }
    return res;
  };

  Utl.adrBar = function(url) {
    return window.history.replaceState('', '', '' + url);
  };

  Utl.getQuery = function(key, defaultValue) {
    var j, k, len, p, params, query, ref, res, v;
    if (key == null) {
      key = null;
    }
    if (defaultValue == null) {
      defaultValue = null;
    }
    query = document.location.search.substring(1);
    params = query.split('&');
    res = {};
    for (j = 0, len = params.length; j < len; j++) {
      p = params[j];
      ref = p.split('='), k = ref[0], v = ref[1];
      res[k] = v;
    }
    if (key === null) {
      return res;
    }
    if (res[key] != null) {
      return res[key];
    }
    return defaultValue;
  };

  Utl.normalize = function(num, min, max) {
    var range;
    if (min == null) {
      min = 0;
    }
    if (max == null) {
      max = 1;
    }
    range = Math.abs(max - min);
    if (num < min) {
      num += range * Math.ceil(Math.abs(num - min) / range);
    } else if (max <= num) {
      num -= range * (Math.floor(Math.abs(num - max) / range) + 1);
    }
    return num;
  };

  Utl.time = function(date) {
    if (date == null) {
      date = null;
    }
    if (date === null) {
      date = new Date();
    }
    return Math.floor(+date / 1000);
  };

  Utl.militime = function(date, getAsFloat) {
    if (date == null) {
      date = null;
    }
    if (getAsFloat == null) {
      getAsFloat = false;
    }
    if (date === null) {
      date = new Date();
    }
    return +date / (getAsFloat ? 1000 : 1);
  };

  Utl.dateStr = function(date, dateSep) {
    if (date == null) {
      date = null;
    }
    if (dateSep == null) {
      dateSep = '-';
    }
    if (date === null) {
      date = new Date();
    }
    return '' + this.zerofill(date.getFullYear(), 4) + dateSep + this.zerofill(date.getMonth() + 1, 2) + dateSep + this.zerofill(date.getDate(), 2);
  };

  Utl.datetimeStr = function(date, dateSep, timeSep, betweenSep) {
    if (date == null) {
      date = null;
    }
    if (dateSep == null) {
      dateSep = '-';
    }
    if (timeSep == null) {
      timeSep = ':';
    }
    if (betweenSep == null) {
      betweenSep = ' ';
    }
    if (date === null) {
      date = new Date();
    }
    return this.dateStr(date, dateSep) + betweenSep + this.zerofill(date.getHours(), 2) + timeSep + this.zerofill(date.getMinutes(), 2) + timeSep + this.zerofill(date.getSeconds(), 2);
  };

  Utl.difftime = function(targetDate, baseDate, nowSec, nowStr, agoStr, secStr, minStr, hourStr, dayStr, monStr, yearStr) {
    var baseTime, d, diffTime, h, m, mo, targetTime, y;
    if (baseDate == null) {
      baseDate = null;
    }
    if (nowSec == null) {
      nowSec = 0;
    }
    if (nowStr == null) {
      nowStr = 'ついさっき';
    }
    if (agoStr == null) {
      agoStr = '前';
    }
    if (secStr == null) {
      secStr = '秒';
    }
    if (minStr == null) {
      minStr = '分';
    }
    if (hourStr == null) {
      hourStr = '時間';
    }
    if (dayStr == null) {
      dayStr = '日';
    }
    if (monStr == null) {
      monStr = '月';
    }
    if (yearStr == null) {
      yearStr = '年';
    }
    if (baseDate === null) {
      baseTime = this.time();
    }
    targetTime = this.time(targetDate);
    diffTime = baseTime - targetTime;
    if (diffTime < 0) {
      return null;
    }
    if (nowSec >= diffTime) {
      return nowStr;
    }
    y = Math.floor(diffTime / (60 * 60 * 24 * 30 * 12));
    if (y > 0) {
      return '' + y + yearStr + agoStr;
    }
    diffTime -= y * (60 * 60 * 24 * 30 * 12);
    mo = Math.floor(diffTime / (60 * 60 * 24 * 30));
    if (mo > 0) {
      return '' + mo + monStr + agoStr;
    }
    diffTime -= mo * (60 * 60 * 24 * 30);
    d = Math.floor(diffTime / (60 * 60 * 24));
    if (d > 0) {
      return '' + d + dayStr + agoStr;
    }
    diffTime -= d * (60 * 60 * 24);
    h = Math.floor(diffTime / (60 * 60));
    if (h > 0) {
      return '' + h + hourStr + agoStr;
    }
    diffTime -= h * (60 * 60);
    m = Math.floor(diffTime / 60);
    if (m > 0) {
      return '' + m + minStr + agoStr;
    }
    diffTime -= m * 60;
    if (diffTime > 0) {
      return '' + diffTime + secStr + agoStr;
    }
    return nowStr;
  };

  Utl.zerofill = function(num, digit) {
    return ('' + this.repeat('0', digit) + num).slice(-digit);
  };

  Utl.repeat = function(str, times) {
    return Array(1 + times).join(str);
  };

  Utl.shuffle = function(ary) {
    var i, n, ref;
    n = ary.length;
    while (n) {
      n--;
      i = this.rand(0, n);
      ref = [ary[n], ary[i]], ary[i] = ref[0], ary[n] = ref[1];
    }
    return ary;
  };

  Utl.inArray = function(needle, ary) {
    var j, len, v;
    for (j = 0, len = ary.length; j < len; j++) {
      v = ary[j];
      if (v === needle) {
        return true;
      }
    }
    return false;
  };

  Utl.clone = function(obj) {
    if ($.isArray(obj)) {
      $.extend(true, [], obj);
    } else if (obj instanceof Object) {
      $.extend(true, {}, obj);
    }
    return obj;
  };

  Utl.arrayFill = function(length, val) {
    var i, j, ref, res;
    if (val == null) {
      val = null;
    }
    res = [];
    for (i = j = 0, ref = length; 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
      res[i] = this.clone(val);
    }
    return res;
  };

  Utl.array2dFill = function(x, y, val) {
    var j, l, ref, ref1, res, xx, yAry, yy;
    if (y == null) {
      y = null;
    }
    if (val == null) {
      val = null;
    }
    if (y === null) {
      y = x;
    }
    res = [];
    yAry = [];
    for (yy = j = 0, ref = y; 0 <= ref ? j < ref : j > ref; yy = 0 <= ref ? ++j : --j) {
      yAry[yy] = this.clone(val);
    }
    for (xx = l = 0, ref1 = x; 0 <= ref1 ? l < ref1 : l > ref1; xx = 0 <= ref1 ? ++l : --l) {
      res[xx] = this.clone(yAry);
    }
    return res;
  };

  Utl.arraySum = function(ary) {
    var j, len, sum, v;
    sum = 0;
    for (j = 0, len = ary.length; j < len; j++) {
      v = ary[j];
      sum += v;
    }
    return sum;
  };

  Utl.arrayMin = function(ary) {
    var j, len, min, v;
    min = null;
    for (j = 0, len = ary.length; j < len; j++) {
      v = ary[j];
      if (min === null || min > v) {
        min = v;
      }
    }
    return min;
  };

  Utl.arrayMax = function(ary) {
    var j, len, max, v;
    max = null;
    for (j = 0, len = ary.length; j < len; j++) {
      v = ary[j];
      if (max === null || max < v) {
        max = v;
      }
    }
    return max;
  };

  Utl.count = function(object) {
    return Object.keys(object).length;
  };

  Utl.uuid4 = function() {
    var i, j, random, uuid;
    uuid = '';
    for (i = j = 0; j < 32; i = ++j) {
      random = Math.random() * 16 | 0;
      if (i === 8 || i === 12 || i === 16 || i === 20) {
        uuid += '-';
      }
      uuid += (i === 12 ? 4 : (i === 16 ? random & 3 | 8 : random)).toString(16);
    }
    return uuid;
  };

  Utl.delLs = function(key) {
    return localStorage.removeItem(key);
  };

  Utl.setLs = function(key, value) {
    var json;
    if (value == null) {
      value = null;
    }
    if (value === null) {
      return this.delLs(key);
    }
    json = JSON.stringify(value);
    return localStorage.setItem(key, json);
  };

  Utl.getLs = function(key) {
    var error, res;
    res = localStorage.getItem(key);
    try {
      res = JSON.parse(res);
    } catch (error) {
      res = null;
    }
    return res;
  };

  return Utl;

})();