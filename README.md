Install
===========

```sh
npm install spellfucker --save
```

Include
=========

**NodeJS** 

```js
const spellfucker = require('spellfucker');
```

**Browser**

```js
<script src='node_modules/spellfucker/build/spellfucker.js' type='text/javascript'></script>
```
...or use ES6 *import*


Use
=====

```js
const result = spellfucker('your string of text'); 
// returns something like "jor stryngue hoph thexd"
```

Develop
===========

```sh
git clone https://github.com/igorpavlov/spellfucker
cd spellfucker
```

Source files are in **src** folder. Build files are in **build** folder. To test the library:

```sh
npm run build
node -e 'console.log(require("./build/spellfucker.js")("to test some text"))'
```

Learn more
===========

https://spellfucker.com/
