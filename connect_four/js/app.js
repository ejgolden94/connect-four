$(()=>{
  const makeNewSlot = (row,col) =>{
    const $newSlot = $('<div>').addClass(`slot ${row} ${col}`)
    const $newHole = $('<div>').addClass('hole').on('click',placeChip)
    $('.game-container').append($newSlot.append($newHole))
    return $newSlot
  }

const generateBoard = (row,col) => {
  for(i=0;i<row;i++){
    // const $newRow = $('<div>').addClass(`row ${i}`)
    for(j=0;j<col;j++){
      makeNewSlot(i,j).css('width',`${900/col}px`).css('height',`${900/col}px`)
    }
  }
}

const placeChip = () => {
  
}

generateBoard(6,7)


})