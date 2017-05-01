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

```
git clone https://github.com/igorpavlov/spellfucker
cd spellfucker
```

Source files are in **src** folder. Please leave the **build** folder untouched to avoid merge conflicts.

```
// run a quick test
npm run quicktest
// or run a custom test
node -e 'console.log(require("./build/spellfucker.js")("to test some text"))'
```

Learn more
===========

https://spellfucker.com/