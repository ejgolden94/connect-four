$(()=>{
  //global variables
  const turns = [
    {team: 'red', color:'#C91818'},
    {team: 'blue', color:'#1874C9'}
  ]
  let currentTurn = turns[1]
  // store the game results here
  let game = []
  /// controls whether or not moves can be made
  let playing = true
  let currentMoves = 0
  let maxMoves

  /////////////////////////////////
  ////Functions to create the board
  /////////////////////////////////
  const makeNewSlot = (row,col) =>{
    const $newSlot = $('<div>').addClass(`slot ${row} ${col}`)
    const $newHole = $('<div>').addClass(`hole ${row} ${col}`).on('click',checkValidMove)
    $('.game-container').append($newSlot.append($newHole))
    return $newSlot
  }

  const generateBoard = (row,col) => {
    maxMoves = row*col
    console.log(playing)
    for(i=0;i<row;i++){
      game.push([])
      for(j=0;j<col;j++){
        game[i].push(j) 
        makeNewSlot(i,j).css('width',`${900/col}px`).css('height',`${900/col}px`)
      }
    }
  }

  /////////////////////////////////////
  ////Functions to determine the winner
  /////////////////////////////////////
  const win = () => {
    $('.message').append($('<h2>').text(`${currentTurn.team} wins the game!`).css('color',currentTurn.color))
    playing = false
  }

  const checkTie = () => {
    if (currentMoves === maxMoves){
      $('.message').append($('<h2>').text(`It's A Tie!`))
    playing = false
    }
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

  const checkDiagonals = () => {
    for(col=-2;col<game[0].length+2;col++){
      const fourInARowForward = []
      const fourInARowBackward = []
      let offset=0
      for(row=0;row<game.length;row++){
        fourInARowForward.push(game[row][col+offset])
        fourInARowBackward.push(game[row][col-offset])
        offset++
        if(checkFourInARow(fourInARowForward)){
          break
          }
        if(checkFourInARow(fourInARowBackward)){
          break
          }
        } 
      }
    }
  
  ////////////////////////////
  ////Functions to make a move
  ////////////////////////////
  const placeChip = (hole,holeRow,holeCol) => {
      currentMoves++
      game[holeRow][holeCol]= currentTurn.team
      hole.css('background-color',currentTurn.color)
      hole.off('click',checkValidMove)
      checkRow(holeRow)
      checkColumn(holeCol)
      checkDiagonals()
      checkTie()
      currentTurn = turns[(turns.indexOf(currentTurn)+1)%turns.length]
  } 

  const checkValidMove = (event) => {
    if (playing){
      const hole = $(event.target)
      const classList = hole.attr('class').split(' ')
      let holeRow = parseInt(classList[1])
      let holeCol = parseInt(typeof classList[2] === 'undefined'? classList[1]: classList[2])

      if((holeRow === game.length-1) || (["blue","red"].includes(game[holeRow+1][holeCol]))) {
        placeChip(hole,holeRow,holeCol)
      }
    }
  }

  ////////////////////////////
  ////Staring the Game
  ////////////////////////////
  const startGame = () => {
    playing = true
    $('.game-container').empty()
    $('.message').empty()
    game = []
    generateBoard(6,7)
  }


  /// Event Listeners 
  const $startbtn = $('#start').on('click',startGame)


  /// Initial Start 
  generateBoard(6,7)
})