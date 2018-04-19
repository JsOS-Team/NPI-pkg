Need to take a fundamentally different approach

Break view into panels, those panels should have dimensions, should be able to update themselves

- Panels should derive from other panels, such that you need to request real estate from other panels


panel.cols
panel.lines

var doc = new Doc()
var window

docView = new DocView({ doc: doc })
docView.panel = new Panel('*')

doc2View = new DocView({ doc: doc2 })
doc2View.panel = docView.panel.split() //changes size of docView


window // view of a buffer
tab // :`
