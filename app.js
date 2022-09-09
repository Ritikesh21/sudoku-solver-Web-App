let N = 9
let submission = Array(N).fill().map(() => Array(N).fill(0));
const puzzleBoard = $('#puzzle')


$(document).ready(function(){
    for (let i = 0; i < 81; i++){
        if (
            ((i % 9 == 0 || i % 9 == 1 || i % 9 == 2) && i < 21) ||
            ((i % 9 == 6 || i % 9 == 7 || i % 9 == 8) && i < 27) ||
            ((i % 9 == 3 || i % 9 == 4 || i % 9 == 5) && (i > 27 && i < 53)) ||
            ((i % 9 == 0 || i % 9 == 1 || i % 9 == 2) && i > 53) ||
            ((i % 9 == 6 || i % 9 == 7 || i % 9 == 8) && i > 53)
        )
        {
            puzzleBoard.append('<input class="input changeBg" type="number" min="1" max="9"></input>')
        }
        else{
            puzzleBoard.append('<input class="input" type="number" min="1" max="9"></input>')
        }
    }

    const inputs = $('.input')
    const joinValues = function(){
        let count = 0
        inputs
            .each(function() {
                if ($(this).val()){
                    submission[Math.floor(count/N)][count%N] = Number($(this).val())
                }
                else{
                    submission[Math.floor(count/N)][count%N] = 0
                }
                count++
            })
    }
    inputs
        .on({
            mouseenter: function(){
                $(this).addClass('green')
            },
            mouseleave: function(){
                $(this).removeClass('green')
            },
            focus: function(){
                $(this).addClass('yellow')
            },
            blur: function(){
                $(this).removeClass('yellow')
            }
        })

    let isSafe = function(submission, row, col, num){
        for (let x = 0; x < N; x++){
            if (submission[row][x] == num){
                return false
            }
        }

        for (let x = 0; x < N; x++){
            if (submission[x][col] == num){
                return false
            }
        }

        let startRow = row - row % Math.ceil(Math.sqrt(N))
        let startCol = col - col % Math.ceil(Math.sqrt(N))

        for (let i = 0; i < Math.ceil(Math.sqrt(N)); i++){
            for (let j = 0; j < Math.ceil(Math.sqrt(N)); j++){
                if (submission[i + startRow][j + startCol] == num){
                    return false
                }
            }
        }
        return true
    }

    let SolveSudoku = function(submission, row, col){
        if (row == N-1 && col == N){
            return true
        }

        if (col == N){
            row += 1
            col = 0
        }

        if (submission[row][col] > 0){
            return SolveSudoku(submission, row, col+1)
        }

        for (let i = 0; i < N; i++){
            num = Math.ceil(Math.random()*N)
            if (isSafe(submission, row, col, num) == true){
                submission[row][col] = num
                if (SolveSudoku(submission, row, col + 1) == true) return true
            }
            submission[row][col] = 0
        }
        return false
    }

    const solve = async function(){
        await joinValues()
        let sudoku = await SolveSudoku(submission, 0, 0)
        if (sudoku == true){
            console.log(submission)
            let count = 0
            inputs.each(function(){
                $(this).val(submission[Math.floor(count/N)][count%N])
                count++
            })
            $('.message').text('Puzzled Solved')
        }
    }

    $('#submitButton')
        .on('click', solve)
})