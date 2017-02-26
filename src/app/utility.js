export const sortEvents = (a, b, counts) => {
  const countDiff = counts[b] - counts[a];
  if (countDiff === 0) {
    return a > b ? 1 : -1;
  }
  else {
    return countDiff;
  }  
};

const concat = (x,y) => x.concat(y)
export const flatMap = (xs, f) => xs.map(f).reduce(concat, [])

export const getRandomString = (length, chars) => {
    var result = '';
    for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
}

export const getTextWidth = (text, fontSize, fontFace) => {
    var a = document.createElement('canvas');
    var b = a.getContext('2d');
    b.font = fontSize + 'px ' + fontFace;

    return b.measureText(text).width;
} 