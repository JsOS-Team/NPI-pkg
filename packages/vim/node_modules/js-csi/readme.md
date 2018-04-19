#CSI

A little boilerplate is helpful to really get going with a UI in the terminal. These are the most basic functions you may want:

##Usage

```
npm install js-csi
```

```javascript
	var CSI = require('js-csi');
```

##API

###Plumbing

####CSI.write(text)

Writes to process.stdout

####CSI.apply(arg)

Performs the command, e.g.

```javascript
CSI.apply('10A'); //Moves cursor up ten lines
```

###Porcelain

####CSI.move(line, col)

Moves cursor to line, col[umn]. Column is optional (default: 1)

```javascript
CSI.move(7,11); //Moves cursor to line 7, column 11
```

####CSI.hide()

Hides the cursor

####CSI.show()

Shows the cursor

####CSI.clear(line)

Clears the given line. If no line is supplied, clears the entire screen

```javascript
CSI.clear(4); //Clears line 4
```

```javascript
CSI.clear(); //Clears terminal screen
```


