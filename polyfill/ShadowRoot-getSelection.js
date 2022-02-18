if (typeof ShadowRoot !== 'undefined' && !ShadowRoot.prototype.getSelection) {
  ShadowRoot.prototype.getSelection = () => document.getSelection()
}
