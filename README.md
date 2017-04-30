Installation
===========

```npm install spellfucker --save```

Usage
=========

```
const result = spellfucker('your string of text'); 
// returns something like "jor stryngue hoph thexd"
```

Development
===========

```
git clone https://github.com/igorpavlov/spellfucker```
cd spellfucker
npm run build
```

Source files are in **src** folder. Build files are in **build** folder.

To test the library:

```
node -e 'console.log(require("./build/spellfucker.js")("to test some text"))'
```

Learn more
===========

https://spellfucker.com/