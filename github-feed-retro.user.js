// ==UserScript==
// @name        Github Feed Retro - github.com
// @namespace   Violentmonkey Scripts
// @match       https://github.com/
// @grant       none
// @version     1.0
// @author      -
// @description 10/3/2022, 12:50:27 PM
// ==/UserScript==
{
  // github复古css样式
  let style = document.createElement('style')
  style.textContent = `
    #dashboard .release { display: none }
    .d-flex > div:first-child .Link--primary { color: var(--color-accent-fg) !important }
    .Link--primary { font-weight: normal !important }
    .no-underline:hover { text-decoration: underline !important }
    .gutter-md-spacious > aside { display: none }
    .gutter-md-spacious > div:first-child { width: 100% !important }
  `
  document.body.appendChild(style)

  let patch = (key, els, mapper) => {
    key = '__' + key
    els.forEach(el => {
      if (el[key]) return
      el[key] = true
      mapper(el)
    })
  }
  setInterval(() => {
    // auto load more
    let loadmore = document.querySelector('.ajax-pagination-btn')
    if (loadmore) loadmore.click()

    // 防手滑误点 star / follow
    let sbtns = document.querySelectorAll('.btn[value=Star]')
    let fbtns = document.querySelectorAll('.btn[value=Follow]')
    let btns = [...sbtns, ...fbtns]
    patch('has_prompt_confirm', btns, el => {
      el.addEventListener('click', e => {
        let action = el.getAttribute('value')
        if (!confirm(`Confirm to ${action}?`)) {
          e.stopPropagation()
          e.preventDefault()
        }
      }, true)
    })

    // 优化文本展示 斜杠左右补空格
    let as = document.querySelectorAll('.Link--primary[href*="/"]')
    patch('has_spaced_slash', as, el => {
      el.textContent = el.textContent.replace(/\//, ' / ')
    })
  }, 1000)
}
