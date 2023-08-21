const FreeSpinGameMechanism = require("./FreeSpinGameMechanics")

class GenerateFreeSpinGame extends FreeSpinGameMechanism{
    constructor(){
        super();
        this.rounds = 10;
        this.totalSessionFreeSpinRound = 0;
        this.totalPayment= 0;
        this.generateRounds()
        this.curMultiplierCount = 1;

    }

    generateRounds(){
        this.totalPayment = 0;
        this.totalSessionFreeSpinRound = 0;
        // this.updateSpin(); //I suppose there is no need to add one.  
        // console.log("Free spin is initialized")
        while(this.rounds > 0){
            if(this.totalSessionFreeSpinRound >= 120){
                this.rounds=0;
                console.log("fs counter :" , this.totalSessionFreeSpinRound)
                continue;
            }
            this.updateSpin();
            this.setPaytable();
            this.countScatter();
            this.paylines();
            this.paytable();
            this.roundsPayout();
            this.updatePlayedCount();
            this.totalPayout();
            this.retriggeredOccurs(); 
            
        }
        // console.log("while , " , this.totalPayment)
    }

    updatePlayedCount(){

        this.rounds--;
        this.totalSessionFreeSpinRound++;
    }

    
    retriggeredOccurs() {
        let retrigUpperLimit = 0;
        let additionalSpins = 0;
    
        switch (true) {
            case this.fiveScatter === 1:
                additionalSpins = 10;
                break;
            case this.fourScatter === 1:
                additionalSpins = 7;
                break;
            case this.threeScatter === 1:
                additionalSpins = 5;
                break;
        }
    
        if (additionalSpins > 0) {
            this.rounds += additionalSpins;
            this.threeScatter = 0;
            this.fourScatter = 0;
            this.fiveScatter = 0;
            retrigUpperLimit++;
            // console.log(`Free Spin Game is retriggered with ${additionalSpins} additional spins.`);
        }
    }
    
    totalPayout(){
        //TOTAL PAYOUT FOR N rounds.
        if (this.roundsPayment > 0) {
            this.curMultiplierCount+=2;
            // console.log(this.curMultiplierCount,"mult count")
        } 
        else {
            this.curMultiplierCount = 1;
        }

        if (this.curMultiplierCount>= 20) {
            this.curMultiplierCount = 20;
        }
        this.totalPayment += (this.roundsPayment*this.curMultiplierCount)   
        // console.log( "rounds count down",this.rounds,"rounds payment", this.roundsPayment,"tot",this.totalPayment ,"multCount",this.curMultiplierCount)
    }


    
}

module.exports = GenerateFreeSpinGame;

// m = new GenerateFreeSpinGame()
// m.generateRounds()

// console.log(m.slot,"++","\n", m.winlines,"++","\n",m.totalPayment,"++","\n",m.roundsPayment)





