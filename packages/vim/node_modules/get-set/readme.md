#getSet

For small projects that don't necessitate a framework solution, I often want to reach into the backbone.js toolkit. getSet provides that minimal kit: events (on, trigger), get, and set.

##Usage

```bash
npm install get-set
```

```javascript
var GetSet = require('get-set');

//Define your constructor
var MyModel = function() {};

MyModel.prototpe = new GetSet();

//Now define the rest of your model...
MyModel.prototype...
```

##API

```javascript
.on(name, fn)
```

```javascript
.trigger(name, arg1, arg2 /* , ... */)
```

```javascript
.get(key)
```

```javascript
.set(key,val);
//or
.set(object); //Object of key-val pairs
```

