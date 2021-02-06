$(()=>{
  //global variables
  const turns = [
    {team: 'red', color:'#C91818'},
    {team: 'blue', color:'#1874C9'}
  ]
  let currentTurn = turns[1]
  // store the game results here
  let game = []

  const makeNewSlot = (row,col) =>{
    const $newSlot = $('<div>').addClass(`slot ${row} ${col}`)
    const $newHole = $('<div>').addClass(`hole ${row} ${col}`).on('click',checkValidMove)
    $('.game-container').append($newSlot.append($newHole))
    return $newSlot
  }

  const generateBoard = (row,col) => {
    for(i=0;i<row;i++){
      game.push([])
      // const $newRow = $('<div>').addClass(`row ${i}`)
      for(j=0;j<col;j++){
        game[i].push(j) 
        makeNewSlot(i,j).css('width',`${900/col}px`).css('height',`${900/col}px`)
      }
    }
  }

  const win = () => {
    $('body').append($('<h2>').text(`${currentTurn.team} wins the game!`).css('color',currentTurn.color))
  }

  const checkFourInARow = (fourInARow) => {
    if (fourInARow.length > 4){
      fourInARow.shift()
    }
    if (fourInARow.length === 4 && fourInARow.every(hole => hole === currentTurn.team)){
      win()
      return true
    }
  }

  const checkRow = (holeRow) => {
    const fourInARow = []
    for(hole of game[holeRow]){
      fourInARow.push(hole)
      if (checkFourInARow(fourInARow)){
        break
      }
    }
  }

  const checkColumn = (holeCol) => {
    const fourInARow = []
    for(row of game){
      fourInARow.push(row[holeCol])
      if (checkFourInARow(fourInARow)){
        break
      }
    }
  }

  const placeChip = (hole,holeRow,holeCol) => {
      game[holeRow][holeCol]= currentTurn.team
      hole.css('background-color',currentTurn.color)
      hole.off('click',checkValidMove)
      checkRow(holeRow)
      checkColumn(holeCol)
      currentTurn = turns[(turns.indexOf(currentTurn)+1)%turns.length]
  } 

  const checkValidMove = (event) => {
    const hole = $(event.target)
    const classList = hole.attr('class').split(' ')
    let holeRow = parseInt(classList[1])
    let holeCol = parseInt(typeof classList[2] === 'undefined'? classList[1]: classList[2])

    if((holeRow === game.length-1) || (["blue","red"].includes(game[holeRow+1][holeCol]))) {
      placeChip(hole,holeRow,holeCol)
    }
  }

generateBoard(6,7)


})