module.exports = function () {
  const spellfucker = require('../src/spellfucker');

  const text = [
    'If I had to live my life without you near me',
    'The days would all be empty',
    'The nights would seem so long',
    'With you I see forever, oh, so clearly',
    'I might have been in love before',
    'But it never felt this strong',
    'Our dreams are young and we both know',
    "They'll take us where we want to go",
    'Hold me now, touch me now',
    "I don't want to live without you",
    "Nothing's gonna change my love for you",
    'You oughta know by now how much I love you',
    'One thing you can be sure of',
    "I'll never ask for more than your love"
  ].join('\n');

  try {
    return spellfucker(text);
  } catch (error) {
    return error;
  }
};
