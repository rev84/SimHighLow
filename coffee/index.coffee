window.times = []
window.histories = []
window.CONST_MAX_GRAPH_WIDTH = 300
window.CONST_HISTORY_COUNT = 10
window.CONST_SPEED = 10
window.CONST_HISTORY_OK_MIN = 15

$().ready ->
  init()

init = ->
  initGraph()
  initTimes()

  play()


play = (isCotinuePlay = true)->
  # シャッフルトランプ
  trumps = []
  trumps.push n for n in [0...54]
  trumps = Utl.shuffle trumps

  ok = 0
  ba = trumps.pop()

  powers = Utl.arrayFill 13, 4
  powers[13] = 2
  powers[n2p(ba)]--

  # [0] 引いたカード、[1] 選択、[2]確率
  history = []
  history.push [ba, null, null]

  while trumps.length > 0
    # 多い方を選ぶ
    isSelectHigh = true
    baP = n2p(ba)
    lowNum = sumLow(powers, baP)
    highNum = sumHigh(powers, baP)
    sameNum = powers[baP]
    isSelectHigh = false if lowNum > highNum

    # 成功確率
    okP = if isSelectHigh then highNum / (lowNum+highNum+sameNum) else lowNum / (lowNum+highNum+sameNum)

    get = trumps.pop()
    getP = n2p get
    powers[getP]--
    history.push [get, isSelectHigh, okP]

    # 正解
    if (baP < getP and isSelectHigh) or (baP > getP and not isSelectHigh)
      ok++
    # 不正解
    else if (baP > getP and isSelectHigh) or (baP < getP and not isSelectHigh)
      break

    ba = get

  # 履歴を追加
  addHistory({
    ok : ok
    history : history
  })
  # 成功回数
  window.times[ok]++

  # 再描画
  refreshTotal()

  if isCotinuePlay
    setTimeout play, window.CONST_SPEED


sumLow = (ary, num)->
  sum = 0
  sum += n for n in [0...num]
  sum

sumHigh = (ary, num)->
  sum = 0
  sum += n for n in [num+1...ary.length]
  sum

refreshTotal = ->
  # 回数
  $('.times').each ->
    $(@).html window.times[$(@).data('id')]

  # 割合
  totalTime = Utl.arraySum window.times
  $('.persent').each ->
    persent = window.times[$(@).data('id')] / totalTime * 100
    persent = Math.round(persent * 1000000) / 1000000
    $(@).html ''+persent+'%'

  # グラフ
  maxTime = Utl.arrayMax window.times
  $('.graph').each ->
    $(@).css('width', window.CONST_MAX_GRAPH_WIDTH * window.times[$(@).data('id')] / maxTime)


addHistory = (hash)->
  return if window.CONST_HISTORY_OK_MIN isnt null and hash.ok < window.CONST_HISTORY_OK_MIN

  historyTr = $('<tr>').append(
    $('<td>').html(hash.ok)
  )

  # 履歴テーブル
  table = $('<table>')
  # ひいたカード列
  tr = $('<tr>')
  for record in hash.history
    [n, isHigh, p] = record
    tr.append(
      $('<td>').append(
        $('<img>').attr('src', n2filename(n)).addClass('history_trump')
      )
    )
  table.append tr
  # 選択列
  tr = $('<tr>')
  for record in hash.history
    [n, isHigh, p] = record
    str = ''
    if isHigh is true
      str = 'High'
    else if isHigh is false
      str = 'Low'
    tr.append(
      $('<td>').html(str)
    )
  table.append tr
  # 確率列
  tr = $('<tr>')
  for record in hash.history
    [n, isHigh, p] = record
    str = ''
    if p isnt null
      str = ''+(Math.round((p * 100) * 10)/10)+'%'
    tr.append(
      $('<td>').html(str)
    )
  table.append tr

  historyTr.append table

  $('#history tr').eq(0).after(historyTr)

  if window.CONST_HISTORY_COUNT isnt null
    $('#history>tbody>tr:gt('+(window.CONST_HISTORY_COUNT+2)+')').remove()

initTimes = ->
  window.times = Utl.arrayFill 54, 0

initGraph = ->
  tr = $('<tr>')
  tr.append(
    $('<th>').html('成功')
  ).append(
    $('<th>').html('回数')
  ).append(
    $('<th>').html('割合')
  ).append(
    $('<th>').html('グラフ')
  )

  $('#result').append(tr)

  for index in [0..53]
    tr = $('<tr>').append(
      $('<th>').html(index)
    ).append(
      $('<td>').addClass('times').data('id', index)
    ).append(
      $('<td>').addClass('persent').data('id', index)
    ).append(
      $('<td>').append(
        $('<img>').attr('src', 'img/graph.png').addClass('graph').data('id', index)
      )
    )

    $('#result').append(tr)

n2p = (n)->
  # ジョーカー
  return 13 if 3 < (n//13)
  # 数字の強さ
  n%13


n2filename = (n)->
  suit = switch n//13
    when 0 then 's'
    when 1 then 'd'
    when 2 then 'h'
    when 3 then 'c'
    else 'x'
  num = n%13+1

  'img/'+suit+(Utl.zerofill num, 2)+'.png'