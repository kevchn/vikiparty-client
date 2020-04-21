function play() {
    $('.vjs-control.vjs-paused').click()
}

function pause() {
    $('.vjs-control.vjs-playing').click()
}

function rewind() {
    $('.vjs-control.vkp-rewind-button').click()
}

function forward() {
    $('.vjs-control.vkp-forward-button').click()
}

function getTime() {
    return $('.vkp-current-time').innerText
}

function setTime(timeInSeconds) {
    $('video').currentTime = 120
    $('.vjs-control.vjs-paused').click()
}

// getEventListeners($('video'))
// $('video').dispatchEvent(new Event('play'))