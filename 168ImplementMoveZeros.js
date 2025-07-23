/**
 * @param {Array<any>} list
 * @returns {void}
 */
function moveZeros(list) {
  let insertPosition = 0;

  for(let i = 0; i < list.length; i++) {
    if(list[i] !== 0){
      list[insertPosition++] = list[i];
    }
  }

  while(insertPosition < list.length){
    list[insertPosition++] = 0;
  }
}