/* pica-ui — switcher.js
   Vanilla, dependency-free theme switcher for non-bundled apps (Hono/Express/
   plain HTML). Include AFTER themes.bundle.css. It:
     • applies the saved theme+mode to <html> immediately (before paint if placed in <head>)
     • renders a switcher control into #pica-switcher if that element exists,
       otherwise a floating control bottom-right.
   Keys match the SvelteKit apps: pica:theme (name), pica:mode (light|dark). */
(function () {
  var THEMES = [
    ['graphite', 'Graphite', '43 96% 56%'],
    ['hearth', 'Hearth', '17 78% 62%'],
    ['signal', 'Signal', '182 72% 48%'],
    ['forge', 'Forge', '22 96% 58%'],
    ['petal', 'Petal', '340 62% 66%'],
    ['void', 'Void', '265 100% 68%'],
    ['prose', 'Prose', '6 88% 45%'],
  ]
  var TKEY = 'pica:theme', MKEY = 'pica:mode'
  function getTheme() {
    var t = localStorage.getItem(TKEY)
    return THEMES.some(function (x) { return x[0] === t }) ? t : 'graphite'
  }
  function getMode() {
    var m = localStorage.getItem(MKEY)
    return m === 'light' || m === 'dark' ? m : 'dark'
  }
  function apply(theme, mode) {
    var el = document.documentElement
    el.setAttribute('data-theme', theme)
    el.classList.toggle('dark', mode === 'dark')
    localStorage.setItem(TKEY, theme)
    localStorage.setItem(MKEY, mode)
  }
  // Apply ASAP
  try { apply(getTheme(), getMode()) } catch (e) {}

  function build() {
    var host = document.getElementById('pica-switcher')
    var floating = false
    if (!host) {
      host = document.createElement('div')
      host.id = 'pica-switcher'
      floating = true
      document.body.appendChild(host)
    }
    var theme = getTheme(), mode = getMode()

    host.innerHTML = ''
    host.style.cssText =
      (floating ? 'position:fixed;bottom:16px;right:16px;z-index:9999;' : '') +
      'display:inline-flex;align-items:center;gap:6px;font-family:inherit;'

    // theme dropdown
    var wrap = document.createElement('div')
    wrap.style.cssText = 'position:relative;'
    var btn = document.createElement('button')
    btn.type = 'button'
    btn.style.cssText =
      'display:inline-flex;align-items:center;gap:6px;cursor:pointer;' +
      'padding:6px 10px;border-radius:6px;font-size:13px;' +
      'background:hsl(var(--secondary));color:hsl(var(--foreground));' +
      'border:1px solid hsl(var(--border));'
    function label() {
      var t = THEMES.filter(function (x) { return x[0] === theme })[0]
      // Compact icon style (swatch + chevron), matching the SvelteKit switcher.
      return '<span style="width:12px;height:12px;border-radius:50%;display:inline-block;background:hsl(' +
        t[2] + ')"></span> ▾'
    }
    btn.innerHTML = label()
    var menu = document.createElement('div')
    menu.style.cssText =
      'position:absolute;top:calc(100% + 6px);right:0;min-width:150px;display:none;' +
      'background:hsl(var(--popover));border:1px solid hsl(var(--border));' +
      'border-radius:8px;padding:4px;box-shadow:0 8px 24px rgba(0,0,0,.4);'
    THEMES.forEach(function (t) {
      var item = document.createElement('button')
      item.type = 'button'
      item.style.cssText =
        'width:100%;display:flex;align-items:center;gap:8px;cursor:pointer;text-align:left;' +
        'padding:7px 9px;border:0;border-radius:4px;font-size:13px;background:' +
        (t[0] === theme ? 'hsl(var(--secondary))' : 'transparent') +
        ';color:hsl(var(--foreground));'
      item.innerHTML = '<span style="width:11px;height:11px;border-radius:50%;background:hsl(' +
        t[2] + ')"></span>' + t[1]
      item.onclick = function () { theme = t[0]; apply(theme, mode); build() }
      menu.appendChild(item)
    })
    btn.onclick = function (e) {
      e.stopPropagation()
      menu.style.display = menu.style.display === 'none' ? 'block' : 'none'
    }
    document.addEventListener('click', function () { menu.style.display = 'none' })
    wrap.appendChild(btn); wrap.appendChild(menu)

    // mode toggle
    var modeBtn = document.createElement('button')
    modeBtn.type = 'button'
    modeBtn.title = 'Toggle light/dark'
    modeBtn.style.cssText =
      'cursor:pointer;padding:6px 9px;border-radius:6px;font-size:13px;' +
      'background:hsl(var(--secondary));color:hsl(var(--foreground));' +
      'border:1px solid hsl(var(--border));'
    modeBtn.textContent = mode === 'dark' ? '☀' : '☾'
    modeBtn.onclick = function () { mode = mode === 'dark' ? 'light' : 'dark'; apply(theme, mode); build() }

    host.appendChild(wrap); host.appendChild(modeBtn)
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', build)
  else build()
})()
