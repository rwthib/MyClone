function getElementByXpath(path) {
  return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
}

var i = 1;
while(getElementByXpath(`//*[@id=\"rso\"]/div/div/div[${i}]/div/h3/a`)) {
  // console.log(getElementByXpath(`//*[@id=\"rso\"]/div/div/div[${i}]/div/h3/a`));
  getElementByXpath(`//*[@id=\"rso\"]/div/div/div[${i}]/div/h3/a`).style.backgroundColor = "yellow";
  getElementByXpath(`//*[@id=\"rso\"]/div/div/div[${i}]/div/h3`).setAttribute("data-index", i);;
  i++;
}


var css = ".r {overflow:visible !important; z-index: 0;position: relative;}.r:before {z-index: 1;display: inline-block;position: absolute;left: -2rem;bottom: 1.2rem;margin: 0 0.5rem 0 0;width: 1.5rem;height: 1.5rem;font-size: 1.2rem;opacity: 0.5;line-height: 1.5rem;text-align: center;background-color: #ff0;border: solid 2px #000;content: attr(data-index);}",
    head = document.head || document.getElementsByTagName('head')[0],
    style = document.createElement('style');

style.type = 'text/css';
if (style.styleSheet){
  style.styleSheet.cssText = css;
} else {
  style.appendChild(document.createTextNode(css));
}

head.appendChild(style);