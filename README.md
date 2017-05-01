Install
===========

```
npm install spellfucker --save
```

Include
=========

**NodeJS** 

```
const spellfucker = require('spellfucker');
```

**Browser**

```
<script src='node_modules/spellfucker/build/spellfucker.js' type='text/javascript'></script>
```
...or use ES6 *import*


Use
=====

```
const result = spellfucker('your string of text'); 
// returns something like "jor stryngue hoph thexd"
```

Develop
===========

```js
git clone https://github.com/igorpavlov/spellfucker
cd spellfucker
```

Source files are in **src** folder. Build files are in **build** folder. To test the library:

```
npm run build
node -e 'console.log(require("./build/spellfucker.js")("to test some text"))'
```

Learn more
===========

https://spellfucker.com/
