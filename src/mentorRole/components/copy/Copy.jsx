const Copy = (trigger, target, cbs = {}) => {
  // throw if no target node or no trigger node
  if (trigger.nodeType !== window.Node.ELEMENT_NODE || target.nodeType !== window.Node.ELEMENT_NODE) {
    throw new Error('没有找到触发的节点或目标内容!')
  }

  const handle = event => {
    // prevent default link behavior
    // note that tagName returns in uppercase
    if (trigger.tagName === 'A') {
      event.preventDefault()
    }

    // create range, and select target node contents
    const range = document.createRange()
    range.selectNodeContents(target)

    // remove existing selections, then add the new one
    const selection = window.getSelection()
    selection.removeAllRanges()
    selection.addRange(range)

    // execute the copy command
    const executed = document.execCommand('copy')
    // based on if the command executed
    // check if the appropriate callback exists, and if it does, call it
    if (executed) {
      cbs.success && cbs.success()
    } else {
      cbs.error && cbs.error()
    }
  }

  // bind the click handler to the trigger node
  // trigger.addEventListener('click', handle)
  handle()
}

export default Copy
