// auto-update values
let roll: number = 0
let turn: number = 0
let overRoll: number = 0
let isModeSet: boolean = false
let isReciever: boolean = false // mode (false = control; true = reciever)


// preset values
let deadZone: number = 15



//wheelspinny
basic.forever(function() {
    if (!isModeSet) {
        
        
        input.onButtonPressed(Button.A, function() {       
            basic.showArrow(ArrowNames.West)
            isReciever = false
            isModeSet = true
        })
        input.onButtonPressed(Button.B, function () {
            basic.showArrow(ArrowNames.East)
            isReciever = true
            isModeSet = true
        })
    }


    // controller code
    if (!isReciever && isModeSet) { // if not selected as reciever will act as the controller
        roll = input.rotation(Rotation.Roll)

        //roll limit value
        if (roll > deadZone * 5) {
            roll = deadZone * 5
        }
        if (roll < -deadZone * 5) {
            roll = -deadZone * 5
        }

        //turn value calculation
        if (roll >= 0) {
            overRoll = roll % deadZone
            turn = (roll - overRoll) / deadZone
        }
        else {
            overRoll = (roll * -1) % deadZone
            turn = (roll + overRoll) / deadZone
        }

        //turn value indication
        basic.clearScreen()
        if (turn > 0) {
            for (let i: number = 0; i < turn; i++) {
                led.plot(4, 4-i)
            }
        }
        else if (turn < 0) {
            for (let i: number = 0; i < (turn*-1); i++) {
                led.plot(0, 4-i)
            }
        }
    }
    
    






    basic.pause(100)
})



//log
basic.forever(function() {
    //console.log(roll)
    console.log(turn)
    basic.pause(100)
})
