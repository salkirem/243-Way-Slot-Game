const BaseGameMechanism = require("./baseGameMechanics")
const GenerateFreeSpinGame = require("./SlotGameFS/generateFreeSpinGame.js")

class GenerateGame extends BaseGameMechanism{
    freeSpin;
    constructor(){
        super();
        
        this.netPayment= 0;
        this.netFSPayment = 0;
        this.netBasePayment = 0;

        this.maxFsPayment = 0;
        this.maxBasePayment = 0;

        this.roundPaymentBase = [];

        this.isFreeSpinRun = false;
        this.GenerateRound()
        this.getFreeSpinGame();
        this.netPayments();

    }

    GenerateRound(){
        this.updateSpin();
        this.setPaytable();
        this.countScatter();
        this.paylines();
        this.paytable();
        this.roundPayout();
        this.runFreeSpin();
        this.netPayments();
        this.netFreeSpinPayments();
        this.netBasePayments();
        this.collectRoundPayout();
        this.maxPayments();
        
    }

    getFreeSpinGame(){
        this.freeSpin = new GenerateFreeSpinGame()
    }

    getNudges(){
        return this.slot.getNudges();
    }

    runFreeSpin() {
        this.isFreeSpinRun = false;
        let freeSpinCount = 0;
        
        if (this.isThreeScatter) {
            freeSpinCount = 5;
        } else if (this.isFourScatter) {
            freeSpinCount = 7;
        } else if (this.isFiveScatter) {
            freeSpinCount = 10;
        }
        
        if (freeSpinCount > 0) {
            this.freeSpin.rounds = freeSpinCount;
            this.isFreeSpinRun = true;
            this.freeSpin.generateRounds();
            // console.log("if, ", this.freeSpin.totalPayment)
            this.isThreeScatter = this.isFourScatter = this.isFiveScatter = false;
            freeSpinCount = 0;
        }
    }

    netPayments(){
        //TOTAL PAYOUT FOR N ROUNDS.
        this.netRoundPay = this.isFreeSpinRun ? this.netRoundPay = this.roundPayment + this.freeSpin.totalPayment : this.netRoundPay = this.roundPayment ;
        this.netPayment += this.netRoundPay;  
    }

    netFreeSpinPayments(){        
        if(this.isFreeSpinRun)
            {this.netFSPayment += this.freeSpin.totalPayment
            // console.log("cumulative",this.netFSPayment)
        }
    }
    netBasePayments(){
        this.netBasePayment += this.roundPayment;
    }
    collectRoundPayout() {

        this.roundPaymentBase.push(this.roundPayment);
    }
    maxPayments(){
        this.maxBasePayment = (this.roundPayment >= this.maxBasePayment) ? this.roundPayment : this.maxBasePayment;
        if(this.isFreeSpinRun){
            this.maxFsPayment = (this.freeSpin.totalPayment >= this.maxFsPayment) ? this.freeSpin.totalPayment : this.maxFsPayment;
        }
    }
    
}

module.exports = GenerateGame;

// m = new GenerateGame()
// m.GenerateRound()

// console.log(m.slot,"++","\n", m.winlines,"++","\n",m.payment,"++","\n",m.roundPayment)





