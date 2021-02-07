$(()=>{
  //global variables
  const turns = [
    {
      team: 'red',
      color: '#C91818',
      streak: 0
    },
    {
      team: 'blue',
      color: '#1874C9',
      streak: 0
    }
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
    const $newHole = $('<div>').addClass(`hole ${row} ${col}`).attr('id',`${row}-${col}`).on('click',checkValidMove)
    $('.game-container').append($newSlot.append($newHole))
    return $newSlot
  }

  const generateBoard = (row,col) => {
    maxMoves = row*col
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
  const updateStreak = () => {
    currentTurn.streak++
    let teamNo = turns.indexOf(currentTurn) + 1
    $(`#team-${teamNo}-streak`).text(currentTurn.streak)
  }

  const win = () => {
    $('.message').append($('<h2>').text(`${currentTurn.team} wins the game!`).css('color',currentTurn.color))
    updateStreak()
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
  
  ///////////////////////
  /////Falling into place
  ///////////////////////
  /* Pseudo code 
  when a hole is clicked it should set off a function that 
  1. turns the top hole the color of that team through adding a class
  2. removes the class from te previous hole and adds it to the next hole 
  3. 1 and 2 continue until the next hole in the column is filled with a red or blue chip
  4. humans should be able to see this occurring, so a set time interval should be specified between class changes
  */
  const fallIntoPlace = (holeCol) => {
    let startRow = 0
    const fall = setInterval(()=>{
      if((startRow === game.length-1) || (["blue","red"].includes(game[startRow][holeCol]))){
        clearInterval(fall)
      }
        $(`#${startRow-1}-${holeCol}`).removeClass(currentTurn.team)
        $(`#${startRow}-${holeCol}`).addClass(currentTurn.team)
        startRow++
    },50)
    // console.log(startRow)
    // console.log(game);
  }

  ////////////////////////////
  ////Functions to make a move
  ////////////////////////////
  const placeChip = (hole,holeRow,holeCol) => {
      currentMoves++
      currentTurn = turns[(turns.indexOf(currentTurn)+1)%turns.length]
      game[holeRow][holeCol]= currentTurn.team
      // hole.css('background-color',currentTurn.color)
      hole.off('click',checkValidMove)
      fallIntoPlace(holeCol)
      checkRow(holeRow)
      checkColumn(holeCol)
      checkDiagonals()
      checkTie()
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
    currentMoves = 0
    generateBoard(6,7)
  }


  /// Event Listeners 
  const $startbtn = $('#start').on('click',startGame)


  /// Initial Start 
  generateBoard(6,7)
})