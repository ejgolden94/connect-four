$(()=>{
  const connectFour = {
      currentMoves: 0,
      maxMoves: 0,
      game: [],
      playing: true,
      turns: [],
      currentTurn: 'none',   
      addPlayer(player){
          this.turns.push(player)
          this.currentTurn = this.turns[0]   
      },
      //////////////
      ////Start Game
      ///////////////
      startGame(){
          connectFour.playing = true
          $('.game-container').empty()
          $('.message').empty()
          connectFour.game = []
          connectFour.currentMoves = 0
          connectFour.generateBoard(6,7)
      },
      /////////////////////////////////
      ////Functions to create the board
      /////////////////////////////////
      makeNewSlot(row,col){
          const $newSlot = $('<div>').addClass(`slot ${row} ${col}`)
          const $newHole = $('<div>').addClass(`available hole ${row} ${col}`).attr('id',`${row}-${col}`).on('click',this.checkValidMove)
          $('.game-container').append($newSlot.append($newHole))
          return $newSlot
      },
      generateBoard(row,col){
          this.maxMoves = row * col
          for(let i=0;i<row;i++){
              this.game.push([])
              for(let j=0;j<col;j++){
                  this.game[i].push(j) 
                  this.makeNewSlot(i,j).css('width',`${900/col}px`).css('height',`${900/col}px`)
              }
          }
      },
      ////////////////////////////
      ////Functions to make a move
      ////////////////////////////
      checkValidMove(event){
          // console.log(this.playing) /// why is this undefined .. 
          // console.log(connectFour.playing)
          if (connectFour.playing){
              const hole = $(event.target)
              const classList = hole.attr('class').split(' ')
              let holeRow = parseInt(classList[2])
              let holeCol = parseInt(typeof classList[3] === 'undefined'? classList[2]: classList[3])
          
              if((holeRow === connectFour.game.length-1) || (["blue","red"].includes(connectFour.game[holeRow+1][holeCol]))) {
                  connectFour.placeChip(hole,holeRow,holeCol)
              }
          }
      },
      placeChip(hole,holeRow,holeCol){
          this.currentMoves++
          this.currentTurn = this.turns[(this.turns.indexOf(this.currentTurn)+1)%this.turns.length]
          this.game[holeRow][holeCol]= this.currentTurn.team
          hole.off('click',this.checkValidMove)
          hole.removeClass('available')
          this.fallIntoPlace(holeCol)
          this.checkRow(holeRow)
          this.checkColumn(holeCol)
          this.checkDiagonals()
          this.checkTie()
      },
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
      fallIntoPlace(holeCol){
          let startRow = 0
          const fall = setInterval(()=>{
          if((startRow === this.game.length-1) || (["blue","red"].includes(this.game[startRow][holeCol]))){
              clearInterval(fall)
          }
              $(`#${startRow-1}-${holeCol}`).removeClass(this.currentTurn.team)
              $(`#${startRow}-${holeCol}`).addClass(this.currentTurn.team)
              startRow++
          },50)
      },
      /////////////////////////////////////
      ////Functions to determine the winner
      /////////////////////////////////////
      win(){
          $('.hole').removeClass('available')
          $('.message').append($('<h2>').text(`${this.currentTurn.team} wins the game!`).css('color',this.currentTurn.color))
          this.currentTurn.updateStreak()
          this.playing = false
      },
      checkTie(){
          if (this.currentMoves === this.maxMoves){
            $('.message').append($('<h2>').text(`It's A Tie!`))
            this.playing = false
          }
      },
      checkFourInARow(fourInARow){
          if (fourInARow.length > 4){
            fourInARow.shift()
          }
          if (fourInARow.length === 4 && fourInARow.every(hole => hole === this.currentTurn.team)){
            this.win()
            return true
          }
      },
      checkRow(holeRow){
          const fourInARow = []
          for(hole of this.game[holeRow]){
            fourInARow.push(hole)
            if (this.checkFourInARow(fourInARow)){
              break
            }
          }
      },
      checkColumn(holeCol){
          const fourInARow = []
          for(row of this.game){
            fourInARow.push(row[holeCol])
            if (this.checkFourInARow(fourInARow)){
              break
            }
          }
      },
      checkDiagonals(){
          for(col=-2;col<this.game[0].length+2;col++){
              const fourInARowForward = []
              const fourInARowBackward = []
              let offset=0
              for(row=0;row<this.game.length;row++){
              fourInARowForward.push(this.game[row][col+offset])
              fourInARowBackward.push(this.game[row][col-offset])
              offset++
              if(this.checkFourInARow(fourInARowForward)){
                  break
                  }
              if(this.checkFourInARow(fourInARowBackward)){
                  break
                  }
              } 
          }
      }
  }

  class Player {
      constructor(team,color,teamNo) {
          this.team = team 
          this.color = color
          this.teamNo = teamNo
          this.streak = 0
      }
      updateStreak(){
          this.streak++
          $(`#team-${this.teamNo}-streak`).text(this.streak)
      }
  }

  ///Create 2 players
  const player1 = new Player('red','#C91818',1)
  const player2 = new Player('blue','#1874C9',2)

  ///Add players to the game
  connectFour.addPlayer(player1)
  connectFour.addPlayer(player2)

  //Event Listeners
  const $startbtn = $('#start').on('click',connectFour.startGame)

  // create the initial board
  connectFour.generateBoard(6,7)
  console.log(connectFour)

})