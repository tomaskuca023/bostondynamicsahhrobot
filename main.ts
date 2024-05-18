// auto-update values
let roll: number = 0
let turn: number = 0 // controller
let steer: number = 0 // reciever
let overRoll: number = 0
let isModeSet: boolean = false
let isReciever: boolean = false // mode (false = control; true = reciever)
let aWasPressed: boolean = false
let bWasPressed: boolean = false


// preset values
let deadZone: number = 10
let balanceF: number = 0.720
let balanceB: number = 0.7

radio.setTransmitPower(7)


basic.forever(function() {
    basic.clearScreen()
    music.stopAllSounds()
    
//controller code
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
    
    basic.pause(50)
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
        
        if (((0 < value) && (value < 4)) || ((0 > value) && (value > -4))) {
            steer = Math.abs(value) / value * 200 - value * 33
        }
        else if ((value == 4) || (value == -4)) {
            steer = 0
        }
        else {
            steer = value * -40
        }

        if (name == "turn") {
            if (value != 0) {
                
                if (value < 0) {
                    PCAmotor.MotorRun(PCAmotor.Motors.M1, steer * balanceF)
                    PCAmotor.MotorRun(PCAmotor.Motors.M4, 200)
                    for (let i: number = 0; i < 2; i++) {
                        led.plot(i,3)
                    }
                }
                else {
                    PCAmotor.MotorRun(PCAmotor.Motors.M1, -200 * balanceF)
                    PCAmotor.MotorRun(PCAmotor.Motors.M4, steer)
                    for (let i: number = 3; i < 5; i++) {
                        led.plot(i, 3)
                    }
                }
            }
            if (value == 0) {
                PCAmotor.MotorRun(PCAmotor.Motors.M1, -200 * balanceF) //left
                PCAmotor.MotorRun(PCAmotor.Motors.M4, 200) //right
            }
        } 
        if (name == "reverse") {
            if (value != 0) {

                if (value < 0) {
                    PCAmotor.MotorRun(PCAmotor.Motors.M1, -steer * balanceB)
                    PCAmotor.MotorRun(PCAmotor.Motors.M4, -200)
                    for (let i: number = 0; i < 2; i++) {
                        led.plot(i, 3)
                    }
                }
                else {
                    PCAmotor.MotorRun(PCAmotor.Motors.M1, 200 * balanceB)
                    PCAmotor.MotorRun(PCAmotor.Motors.M4, -steer)
                    for (let i: number = 3; i < 5; i++) {
                        led.plot(i, 3)
                    }
                }
            }
            if (value == 0) {
                PCAmotor.MotorRun(PCAmotor.Motors.M1, 200 * balanceB) //left
                PCAmotor.MotorRun(PCAmotor.Motors.M4, -200) //right
            }
            for (let i: number = 0; i < 5; i++) {
                led.plot(i, 0)
            music.ringTone(Note.C)
            }
            isReciever = true
            isModeSet = true
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
    
    if (!isReciever) {
        console.log("turn: " + turn)
        console.log("roll: " + roll)
    }   
    else {
        console.log("steer: " + steer)
    }
    basic.pause(100)
})


