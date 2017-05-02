Install
=======

```sh
npm install spellfucker --save
```

Include
=======

**NodeJS** 

```js
const spellfucker = require('spellfucker');
```

**Browser**

```html
<script src='node_modules/spellfucker/build/spellfucker.js' type='text/javascript'></script>
```
...or use ES6 *import*

Use
===

```js
const result = spellfucker('your string of text'); 
// returns something like "jor stryngue hoph thexd"
```

Contribute
==========

Fork the project. The most challenging part is the replacement library. It is suggested to polish the original English version first. The perfect shape of the replacement matrix should look like this:

```
---------------
|"ck","k","kh"|
|"k","ck","kh"|
|"kh","ck","k"|
---------------
```

The size of the sample matrix above is N=3. The bigger N is, the better. You get the point.

Source files are in **src** folder. Please leave the **build** folder untouched to avoid merge conflicts.

```sh
# run a quick test
npm run quicktest
# or run a custom test
node -e 'console.log(require("./src/spellfucker.js")("to test some text"))'
```

- [@dawsbot](https://github.com/dawsbot) - Improved Readme
- [@DennyDai](https://github.com/DennyDai) - The very first contributor, fixed a nasty bug in the library

Learn more
===========

https://spellfucker.com/
