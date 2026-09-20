// Text-editing helpers for the admin Markdown editor toolbar. Pure functions on a plain-textarea state
// { value, start, end } (start/end are the selection offsets); each returns the next state. No editor
// library: the toolbar is string manipulation only.

const clamp = (state) => {
  const value = String(state.value ?? '')
  const start = Math.max(0, Math.min(state.start ?? 0, value.length))
  const end = Math.max(start, Math.min(state.end ?? start, value.length))
  return { value, start, end }
}

// **bold**, *italic*: wraps the selection (or inserts a placeholder), and unwraps when already wrapped.
export function wrapSelection(input, before, after = before, placeholder = 'text') {
  const { value, start, end } = clamp(input)
  const selected = value.slice(start, end)
  const wrappedOutside = value.slice(start - before.length, start) === before && value.slice(end, end + after.length) === after
  if (start !== end && wrappedOutside) {
    const next = value.slice(0, start - before.length) + selected + value.slice(end + after.length)
    return { value: next, start: start - before.length, end: end - before.length }
  }
  const text = selected || placeholder
  const next = value.slice(0, start) + before + text + after + value.slice(end)
  return { value: next, start: start + before.length, end: start + before.length + text.length }
}

// "## " headings and "> " quotes: applies to every line the selection touches; removes when all have it.
export function prefixLines(input, prefix) {
  const { value, start, end } = clamp(input)
  const from = value.lastIndexOf('\n', start - 1) + 1
  const nextBreak = value.indexOf('\n', end)
  const to = nextBreak === -1 ? value.length : nextBreak
  const lines = value.slice(from, to).split('\n')
  const allHave = lines.every((line) => line.startsWith(prefix))
  const changed = lines.map((line) => (allHave ? line.slice(prefix.length) : line.startsWith(prefix) ? line : prefix + line))
  const block = changed.join('\n')
  const delta = block.length - (to - from)
  return { value: value.slice(0, from) + block + value.slice(to), start: Math.max(from, start + (allHave ? -prefix.length : prefix.length)), end: end + delta }
}

// [text](https://): the selection becomes the link text and the URL placeholder is selected.
export function insertLink(input, placeholderText = 'link text') {
  const { value, start, end } = clamp(input)
  const text = value.slice(start, end) || placeholderText
  const url = 'https://'
  const next = value.slice(0, start) + `[${text}](${url})` + value.slice(end)
  const urlStart = start + text.length + 3
  return { value: next, start: urlStart, end: urlStart + url.length }
}

// ![alt](url) on its own paragraph. Characters that would break the syntax are removed from alt/url.
export function insertImage(input, url, alt = 'image') {
  const { value, start, end } = clamp(input)
  const safeAlt = String(alt).replace(/[\[\]\r\n]/g, ' ').trim() || 'image'
  // encodeURIComponent leaves ( and ) alone, and both would end the URL early, so percent-encode them too.
  const safeUrl = String(url).replace(/[()\s]/g, (c) => `%${c.charCodeAt(0).toString(16).toUpperCase().padStart(2, '0')}`)
  const snippet = `![${safeAlt}](${safeUrl})`
  const before = value.slice(0, start).replace(/[ \t]+$/, '')
  const after = value.slice(end).replace(/^[ \t]+/, '')
  const lead = before === '' || before.endsWith('\n\n') ? '' : before.endsWith('\n') ? '\n' : '\n\n'
  const trail = after === '' || after.startsWith('\n\n') ? '' : after.startsWith('\n') ? '\n' : '\n\n'
  const next = before + lead + snippet + trail + after
  const caret = (before + lead + snippet).length
  return { value: next, start: caret, end: caret }
}
