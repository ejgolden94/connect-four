$(()=>{
  //global variables
  const turns = [
    {team: 'red', color:'#C91818'},
    {team: 'blue', color:'#1874C9'}
  ]
  let currentTurn = turns[1]


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

  const placeChip = (event) => {
    $(event.target).css('background-color',currentTurn.color)
    $(event.target).off('click',placeChip)
    currentTurn = turns[(turns.indexOf(currentTurn)+1)%turns.length]

  } 

generateBoard(6,7)


})