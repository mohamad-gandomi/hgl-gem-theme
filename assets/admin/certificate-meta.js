(function ($) {
  var frame = null
  var dataCodewordsByVersion = [0, 19, 34, 55, 80]
  var errorCodewordsByVersion = [0, 7, 10, 15, 20]
  var formatBits = '111011111000100'

  function openPdfPicker() {
    if (frame) {
      frame.open()
      return
    }

    frame = wp.media({
      title: 'Choose certificate PDF',
      button: { text: 'Use this PDF' },
      library: { type: 'application/pdf' },
      multiple: false
    })

    frame.on('select', function () {
      var attachment = frame.state().get('selection').first().toJSON()
      $('#hgl-certificate-pdf-id').val(attachment.id || '')
      $('#hgl-certificate-pdf-path').val(uploadPathFromUrl(attachment.url || ''))
    })

    frame.open()
  }

  function uploadPathFromUrl(url) {
    try {
      return new URL(url, window.location.origin).pathname
    } catch (error) {
      return ''
    }
  }

  $(document).on('click', '[data-hgl-select-certificate-pdf]', openPdfPicker)
  $(document).on('click', '[data-hgl-remove-certificate-pdf]', function () {
    $('#hgl-certificate-pdf-id').val('')
    $('#hgl-certificate-pdf-path').val('')
  })

  function bitsToCodewords(bits) {
    var codewords = []

    for (var i = 0; i < bits.length; i += 8) {
      codewords.push(parseInt(bits.slice(i, i + 8), 2))
    }

    return codewords
  }

  function toBits(value, length) {
    var bits = value.toString(2)
    return '0'.repeat(length - bits.length) + bits
  }

  function chooseVersion(text) {
    var length = new TextEncoder().encode(text).length

    for (var version = 1; version <= 4; version += 1) {
      if (length + 2 <= dataCodewordsByVersion[version]) return version
    }

    return 0
  }

  function makeDataCodewords(text, version) {
    var bytes = Array.from(new TextEncoder().encode(text))
    var capacityBits = dataCodewordsByVersion[version] * 8
    var bits = '0100' + toBits(bytes.length, 8)

    bytes.forEach(function (byte) {
      bits += toBits(byte, 8)
    })

    bits += '0'.repeat(Math.min(4, capacityBits - bits.length))
    bits += '0'.repeat((8 - (bits.length % 8)) % 8)

    var codewords = bitsToCodewords(bits)
    var pad = 0

    while (codewords.length < dataCodewordsByVersion[version]) {
      codewords.push(pad % 2 === 0 ? 0xec : 0x11)
      pad += 1
    }

    return codewords
  }

  function gfTables() {
    var exp = new Array(512)
    var log = new Array(256)
    var value = 1

    for (var i = 0; i < 255; i += 1) {
      exp[i] = value
      log[value] = i
      value <<= 1
      if (value & 0x100) value ^= 0x11d
    }

    for (var j = 255; j < 512; j += 1) exp[j] = exp[j - 255]

    return { exp: exp, log: log }
  }

  var gf = gfTables()

  function gfMul(a, b) {
    if (a === 0 || b === 0) return 0
    return gf.exp[gf.log[a] + gf.log[b]]
  }

  function generatorPoly(degree) {
    var poly = [1]

    for (var i = 0; i < degree; i += 1) {
      var next = new Array(poly.length + 1).fill(0)

      for (var j = 0; j < poly.length; j += 1) {
        next[j] ^= gfMul(poly[j], 1)
        next[j + 1] ^= gfMul(poly[j], gf.exp[i])
      }

      poly = next
    }

    return poly
  }

  function errorCodewords(data, count) {
    var gen = generatorPoly(count)
    var ecc = new Array(count).fill(0)

    data.forEach(function (byte) {
      var factor = byte ^ ecc.shift()
      ecc.push(0)

      for (var i = 0; i < count; i += 1) {
        ecc[i] ^= gfMul(gen[i + 1], factor)
      }
    })

    return ecc
  }

  function createMatrix(version) {
    var size = 21 + (version - 1) * 4
    var matrix = Array.from({ length: size }, function () {
      return new Array(size).fill(false)
    })
    var reserved = Array.from({ length: size }, function () {
      return new Array(size).fill(false)
    })

    return { size: size, matrix: matrix, reserved: reserved }
  }

  function setModule(qr, row, col, dark, reserve) {
    if (row < 0 || col < 0 || row >= qr.size || col >= qr.size) return
    qr.matrix[row][col] = !!dark
    if (reserve) qr.reserved[row][col] = true
  }

  function drawFinder(qr, row, col) {
    for (var r = -1; r <= 7; r += 1) {
      for (var c = -1; c <= 7; c += 1) {
        var rr = row + r
        var cc = col + c
        var dark = r >= 0 && r <= 6 && c >= 0 && c <= 6 && (r === 0 || r === 6 || c === 0 || c === 6 || (r >= 2 && r <= 4 && c >= 2 && c <= 4))
        setModule(qr, rr, cc, dark, true)
      }
    }
  }

  function drawPatterns(qr, version) {
    drawFinder(qr, 0, 0)
    drawFinder(qr, 0, qr.size - 7)
    drawFinder(qr, qr.size - 7, 0)

    for (var i = 8; i < qr.size - 8; i += 1) {
      setModule(qr, 6, i, i % 2 === 0, true)
      setModule(qr, i, 6, i % 2 === 0, true)
    }

    setModule(qr, qr.size - 8, 8, true, true)

    for (var index = 0; index < 15; index += 1) {
      var bit = formatBits[index] === '1'
      var a = formatPositionA(index)
      var b = formatPositionB(qr.size, index)
      setModule(qr, a[0], a[1], bit, true)
      setModule(qr, b[0], b[1], bit, true)
    }

    if (version > 1) drawAlignment(qr, qr.size - 7, qr.size - 7)
  }

  function drawAlignment(qr, row, col) {
    for (var r = -2; r <= 2; r += 1) {
      for (var c = -2; c <= 2; c += 1) {
        var dark = Math.max(Math.abs(r), Math.abs(c)) !== 1
        setModule(qr, row + r, col + c, dark, true)
      }
    }
  }

  function formatPositionA(index) {
    var positions = [[8, 0], [8, 1], [8, 2], [8, 3], [8, 4], [8, 5], [8, 7], [8, 8], [7, 8], [5, 8], [4, 8], [3, 8], [2, 8], [1, 8], [0, 8]]
    return positions[index]
  }

  function formatPositionB(size, index) {
    var positions = [[size - 1, 8], [size - 2, 8], [size - 3, 8], [size - 4, 8], [size - 5, 8], [size - 6, 8], [size - 7, 8], [8, size - 8], [8, size - 7], [8, size - 6], [8, size - 5], [8, size - 4], [8, size - 3], [8, size - 2], [8, size - 1]]
    return positions[index]
  }

  function placeData(qr, codewords) {
    var bits = codewords.map(function (codeword) {
      return toBits(codeword, 8)
    }).join('')
    var bitIndex = 0
    var upward = true

    for (var col = qr.size - 1; col > 0; col -= 2) {
      if (col === 6) col -= 1

      for (var rowIndex = 0; rowIndex < qr.size; rowIndex += 1) {
        var row = upward ? qr.size - 1 - rowIndex : rowIndex

        for (var offset = 0; offset < 2; offset += 1) {
          var currentCol = col - offset
          if (qr.reserved[row][currentCol]) continue

          var dark = bitIndex < bits.length && bits[bitIndex] === '1'
          if ((row + currentCol) % 2 === 0) dark = !dark
          setModule(qr, row, currentCol, dark, false)
          bitIndex += 1
        }
      }

      upward = !upward
    }
  }

  function makeQr(text) {
    var version = chooseVersion(text)
    if (!version) return null

    var data = makeDataCodewords(text, version)
    var ecc = errorCodewords(data, errorCodewordsByVersion[version])
    var qr = createMatrix(version)
    drawPatterns(qr, version)
    placeData(qr, data.concat(ecc))

    return qr
  }

  function renderQr(container, text) {
    var qr = makeQr(text)
    if (!qr) {
      container.textContent = 'QR URL is too long for the built-in generator.'
      return null
    }

    var scale = 8
    var quiet = 4
    var canvas = document.createElement('canvas')
    canvas.width = (qr.size + quiet * 2) * scale
    canvas.height = canvas.width
    var context = canvas.getContext('2d')
    context.fillStyle = '#fff'
    context.fillRect(0, 0, canvas.width, canvas.height)
    context.fillStyle = '#000'

    for (var row = 0; row < qr.size; row += 1) {
      for (var col = 0; col < qr.size; col += 1) {
        if (qr.matrix[row][col]) {
          context.fillRect((col + quiet) * scale, (row + quiet) * scale, scale, scale)
        }
      }
    }

    canvas.className = 'hgl-certificate-qr__canvas'
    canvas.style.width = '112px'
    canvas.style.height = '112px'
    canvas.style.imageRendering = 'pixelated'

    container.innerHTML = ''
    container.appendChild(canvas)

    return canvas
  }

  $('[data-hgl-certificate-qr]').each(function () {
    var wrapper = this
    var text = wrapper.getAttribute('data-hgl-certificate-qr')
    var preview = wrapper.querySelector('[data-hgl-certificate-qr-preview]')

    if (!text || !preview) return

    var canvas = renderQr(preview, text)
    var button = wrapper.querySelector('[data-hgl-download-certificate-qr]')

    if (!canvas || !button) return

    button.addEventListener('click', function () {
      var link = document.createElement('a')
      var title = wrapper.getAttribute('data-hgl-certificate-title') || 'certificate-qr'
      link.download = title + '-qr.png'
      link.href = canvas.toDataURL('image/png')
      link.click()
    })
  })
})(jQuery)
