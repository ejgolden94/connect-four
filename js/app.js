$(()=>{
  const connectFour = {
      currentMoves: 0,
      maxMoves: 0,
      game: [],
      playing: true,
      turns: [],
      currentTurn: 'none',  
      boardSize: 4,
      columns: 7,
      rows: 6,
      colors:[
        {name: "red" , color:'#D1495B'},
        {name: "blue" , color:'#4EA8DE'},
        {name: "pink" , color:'#F15BB5'},
        {name: "teal" , color:'#2EC4B6'},
        {name: "midnight" , color:'#003049'},
        {name: "green" , color:'#90BE6D'},
        {name: "orange" , color:'#FF9F1C'},
        {name: "purple" , color:'#7678ED'}
      ],
      //////////////////
      ///////Game Setup
      /////////////////
      // once a player has chsen a team, remove that color from the options
      removeColor(name){
        const colorIndex = this.colors.map(element=>element.name).indexOf(name)
        this.colors.splice(colorIndex,1)
      },
      // add a player to the game object
      addPlayer(player){
          this.turns.push(player)
          player.updateScoreBoard()  
          this.changeTurn() 
      },
      // update board size between 4, 5, and 6
      updateBoardSize(num){
        if(num > 6) {
          num = 6
        }else if(num < 4 ){
          num = 4
        }
        this.boardSize = num
        if (num === 4){
          this.rows = 6
          this.columns = 7
          $('#size').text('Four')
        } else if (num === 5){
          this.rows = 7
          this.columns = 8
          $('#size').text('Five')
        } else if (num === 6){
          this.rows = 8
          this.columns = 9
          $('#size').text('Six')
        }
        this.startGame()
      },
      // updates the color buttons once the first player has chosen their team 
      updateButtons(button){
        const $colorButtons = $('.color-button')
        $colorButtons.removeClass('color-button').addClass('unclickable')
        $colorButtons.off('click',this.makePlayer)
        //remove the color option from the game 
        this.removeColor(button.text())
        // make the next or close button work and highlight
        if(button.parent().attr('id') === 'p1-buttons-container'){
          $('#next').css('border','5px solid yellow').css('width','90').css('height','60')
          $('#next').on('click',()=>{
            $('#p1-colors-modal').css('display','none')
            $('#p2-colors-modal').css('display','block')
            this.createColorButtons()
          })
        }else if(button.parent().attr('id') === 'p2-buttons-container'){
          $('#close-colors').css('border','5px solid yellow').css('width','90').css('height','60')
          $('#close-colors').on('click',()=>{$('#p2-colors-modal').css('display','none')})
        }
      },
      // creating a player once they've chosen a team 
      makePlayer(event){
        let players = connectFour.turns.length
        const $button = $(event.target)
        $button.css('border','3px solid black')
        const newPlayer = new Player($button.text(),$button.css('background-color'),players+1);
        connectFour.addPlayer(newPlayer)
        connectFour.updateButtons($button)
      },
      // color buttons for picking your team 
      createColorButtons(){  
        $('.color-buttons').empty()
        for(color of this.colors){
          const $newBtn = $('<button>').text(color.name).addClass(color.name).addClass('color-button')
          $newBtn.on('click',this.makePlayer)
          $('.color-buttons').append($newBtn)
        }
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
          connectFour.generateBoard(connectFour.rows,connectFour.columns)
      },
      /////////////////////////////////
      ////Functions to create the board
      /////////////////////////////////
      makeNewSlot(row,col){
          const $newSlot = $('<div>').addClass(`slot ${row} ${col}`)
          const $newHole = $('<div>').addClass(`hole ${row} ${col} available`).attr('id',`${row}-${col}`).on('click',this.checkValidMove)
          $('.game-container').append($newSlot.append($newHole))
          return $newSlot
      },
      generateBoard(){
          this.maxMoves = this.rows * this.columns
          console.log(parseInt(($('.game-container').css('width')).replace('px','')));
          const colWidth = parseInt(($('.game-container').css('width')).replace('px',''))
          for(let i=0;i<this.rows;i++){
              this.game.push([])
              for(let j=0;j<this.columns;j++){
                  this.game[i].push(j) 
                  this.makeNewSlot(i,j).css('width',`${colWidth/this.columns}px`).css('height',`${colWidth/this.columns}px`)
              }
          }
      },
      ////////////////////////////
      ////Functions to make a move
      ////////////////////////////
      /// change turns from one player to another and update the score board
      changeTurn(){
        if(this.currentTurn === 'none'){
          this.currentTurn = this.turns[0]
        }else{
          this.currentTurn = this.turns[(this.turns.indexOf(this.currentTurn)+1)%this.turns.length]
          let nextUp = this.turns.filter(player => player!==this.currentTurn)
          $('#player-up > div').remove()
          $('#player-up').append($('<div>').addClass(`player ${nextUp[0].team}`))
        }
      },
      // based on where you clicked, this function decides where the hole will go 
      checkValidMove(event){
          if (connectFour.playing){
              const hole = $(event.target)
              const idList = hole.attr('id').split('-')
              let holeCol = parseInt(typeof idList[1] === 'undefined'? idList[0]: idList[1])
              let finalRow=0
              for(row in connectFour.game){
                if(parseInt(row) === connectFour.game.length-1
                  ||[connectFour.turns[0].team,connectFour.turns[1].team].includes(connectFour.game[parseInt(row)+1][holeCol])){
                  finalRow = row
                  break
                } 
              }
              connectFour.placeChip(finalRow,holeCol)
          }
      },
      // store the move in the game array and check all win conditions, also kick off falling
      placeChip(holeRow,holeCol){
          this.currentMoves++
          this.changeTurn()
          this.game[holeRow][holeCol]= this.currentTurn.team
          $(`#${holeRow}-${holeCol}`).removeClass('available')
          this.fallIntoPlace(holeCol)
          this.checkRow(holeRow)
          this.checkColumn(holeCol)
          this.checkDiagonals()
          this.checkTie()
      },
      ///////////////////////
      /////Falling into place
      ///////////////////////
      /// 100 % just the visual of the chip falling into place
      fallIntoPlace(holeCol){
          let startRow = 0
          const fall = setInterval(()=>{
            $('.hole').off('click',this.checkValidMove)
            if((startRow === this.game.length-1)|| ([this.turns[0].team,this.turns[1].team].includes(this.game[startRow][holeCol]))){
                clearInterval(fall)
                $('.hole').on('click',this.checkValidMove)
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
          this.currentTurn.updateScore()
          this.playing = false
      },
      checkTie(){
          if (this.currentMoves === this.maxMoves){
            $('.message').append($('<h2>').text(`It's A Tie!`))
            this.playing = false
          }
      },
      checkFourInARow(fourInARow){
          if (fourInARow.length > this.boardSize){
            fourInARow.shift()
          }
          if (fourInARow.length === this.boardSize && fourInARow.every(hole => hole === this.currentTurn.team)){
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

  ///// Class for the two players
  class Player {
      constructor(team,color,teamNo) {
          this.team = team 
          this.color = color
          this.teamNo = teamNo
          this.score = 0
      }
      updateScoreBoard(){
        $(`.team-${this.teamNo}`).css('color',this.color)
        $(`#team-${this.teamNo}-name`).text(`${this.team} team`)
      }
      updateScore(){
          this.score++
          $(`#team-${this.teamNo}-score`).text(this.score)
      }
  }

  //Event Listeners
  const $startbtn = $('#start').on('click',connectFour.startGame)
  const $incBoardbtn = $('#inc-board').on('click',()=>{connectFour.updateBoardSize(connectFour.boardSize+1)})
  const $decBoardbtn = $('#dec-board').on('click',()=>{connectFour.updateBoardSize(connectFour.boardSize-1)})
  const $openModal = $('#how-to').on('click',()=>{$('#modal').css('display','block')})
  const $closeModal = $('#close').on('click',()=>{$('#modal').css('display','none')})
  // bring up the color menu immediately
  setTimeout(()=>{
    $('#p1-colors-modal').css('display','block')
    connectFour.createColorButtons()
  },00);

  // create the initial board
  connectFour.generateBoard()
})