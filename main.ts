// auto-update values
let roll: number = 0
let turn: number = 0
let overRoll: number = 0
let isModeSet: boolean = false
let isReciever: boolean = false // mode (false = control; true = reciever)
let aWasPressed: boolean = false
let bWasPressed: boolean = false


// preset values
let deadZone: number = 15



//wheelspinny
basic.forever(function() {
    basic.clearScreen()
    music.stopAllSounds()
    
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
//buttons
        if (input.buttonIsPressed(Button.B)) {
            radio.sendValue("turn", turn)
        }
        if (input.buttonIsPressed(Button.A)) {
            radio.sendValue("reverse", turn)
        }
        if ((!input.buttonIsPressed(Button.B) && bWasPressed) || (!input.buttonIsPressed(Button.A) && aWasPressed)) {
            radio.sendString("stop")
        }

    }
    

    aWasPressed = input.buttonIsPressed(Button.A)
    bWasPressed = input.buttonIsPressed(Button.B)
    
    basic.pause(100)
})


//mode select
input.onButtonPressed(Button.B, function () {
    if (!isModeSet) {
        basic.showArrow(ArrowNames.East)
        isReciever = true
        isModeSet = true
    }
})
input.onButtonPressed(Button.A, function () {
    if (!isModeSet) {
        basic.showArrow(ArrowNames.West)
        isReciever = false
        isModeSet = true
    }
})


// drive yippee
radio.onReceivedValue(function(name: string, value: number) { 
    if (isReciever) {
        
        if (name == "turn") {
            if (value < 0) {
                PCAmotor.MotorRun(PCAmotor.Motors.M1, -200 / 5 * value)
                PCAmotor.MotorRun(PCAmotor.Motors.M4, -200 / 5 * value)

                for (let i: number = 0; i < 2; i++) {
                    led.plot(i,3)
                }
            }
            if (value == 0) {
                PCAmotor.MotorRun(PCAmotor.Motors.M1, -200) //left
                PCAmotor.MotorRun(PCAmotor.Motors.M4, 200) //right
            }
            if (value > 0) {
                PCAmotor.MotorRun(PCAmotor.Motors.M1, -200 / 5 * value)
                PCAmotor.MotorRun(PCAmotor.Motors.M4, -200 / 5 * value)

                for (let i: number = 3; i < 5; i++) {
                    led.plot(i,3)
                }
            }
        } 
        if (name == "reverse") {
            PCAmotor.MotorRun(PCAmotor.Motors.M1, 200) //left
            PCAmotor.MotorRun(PCAmotor.Motors.M4, -200) //right

            for (let i: number = 0; i < 5; i++) {
                led.plot(i, 0)
            music.ringTone(Note.C)
            }
            
        }
        
    }
})
radio.onReceivedString(function(receivedString: string) {
    if (isReciever) {
        if (receivedString == "stop") {
            PCAmotor.MotorStopAll()
        }
    }
})

//log
basic.forever(function() {
    //console.log(roll)
    console.log(turn)
    basic.pause(100)
})
