const GenerateGame = require("./generateGame");
const  {loadJson} = require("./helpers")
const _ = require("lodash")


class StatisticalAnalysis{
    round = 2000000
    gameRun;
    rtpGame;
    rtpBaseGame;
    rtpFreeSpinGame;
    hit = {};
    probOfHittingSym = {};
    hitFrq;
    maxBasePayout = 0;
    variance;
    stdDev;
    volatility;

    constructor(){
      
        this.hitSym = [] ;
        this.sqrOfEach = 0;
        this.avgWinPerSpin = 0; 

        this.getSlotGame()
        this.setHits()
        this.statisticalCalculations()
    
    }

    getSlotGame(){
        this.gameRun = new GenerateGame()
    }

    statisticalCalculations(){
        for(let r = 0; r < this.round; r++){
            this.gameRun.GenerateRound();
            this.getHits();
            this.probabilityOfHitting();
            this.hitFrequency();
            this.calculateRtp();
            this.calculateVariance();
            this.calculateStdDev();
            this.calculateVolatility();
            if(r%100000 === 0){
                console.log("round",r)
            }
          
            
        }
        
    }

    setHits(){
        let r = loadJson("baseReelSymbols");
        this.hitSym = r.Hits
        for (let s of this.hitSym){
            this.hit[s] = 0
        }
    }

    getHits(){ 
    
        for(let payline of this.gameRun.winlines){
            let sym = payline[0];
            let c = payline[1];
            this.hitSym.forEach(hs => {
                    (c == parseInt(hs.substring(hs.length -1, hs.length)) && sym == hs.substring(0, 2)) ? this.hit[hs] += 1 : this.hit[hs] +=0;
                
            })
            this.hit["S x3"] = this.gameRun.threeScatter; 
            this.hit["S x4"] = this.gameRun.fourScatter;
            this.hit["S x5"] = this.gameRun.fiveScatter;
        }
    }
    probabilityOfHitting(){
        for (let [symName, symCount] of Object.entries(this.hit)) {
            this.probOfHittingSym[symName] = symCount/this.round;
          }
    }
    hitFrequency(){
        //shows the probability of hitting a payouted symbol in a spin round of base game.
        // let getHitPayoutedSym = {};
        // for(let key of Object.keys(this.hit)){
        //     // if(key.includes("L")||key.includes("M")||key.includes("H")){
        //     getHitPayoutedSym[key]=this.hit[key];
        //     // }
        // }
    
        let hitValue = Object.values(this.hit);
        let totHitVal = _.sum(hitValue);
        this.hitFrq = totHitVal/this.round; 
    }


    calculateRtp(){
        this.rtpGame = (this.gameRun.netPayment/this.round)*100
        this.rtpBaseGame = (this.gameRun.netBasePayment/this.round)*100
        this.rtpFreeSpinGame = (this.gameRun.netFSPayment/this.round)*100
    }
    calculateVariance(){
        this.avgWinPerSpin = this.gameRun.netBasePayment/this.round;
        this.sqrOfEach += Math.pow(( this.gameRun.roundPayment - this.avgWinPerSpin),2)
        this.variance = (this.sqrOfEach)/this.round;

    }

    calculateStdDev(){
        this.stdDev = Math.sqrt(this.variance)
    }

    calculateVolatility(){
        this.volatility = this.stdDev*(1.64)
    }

    // calculateVolatility() {
    //     // Calculate the logarithmic returns of your payments
    //     let logReturns = this.gameRun.roundPaymentBase.map(payment => Math.log(payment / this.avgWinPerSpin));
        
    //     // Calculate the standard deviation of the logarithmic returns
    //     let logReturnsStdDev = Math.sqrt(_.sum(logReturns.map(logReturn => Math.pow(logReturn - this.avgLogReturn, 2))) / this.round);

    //     // Annualize the volatility (adjust for time)
    //     let annualizationFactor = Math.sqrt(252); // Assuming daily data, 252 trading days in a year
    //     this.volatility = logReturnsStdDev * annualizationFactor;
    // }

    



    print(){ 
        console.log("\n ----STATISTICAL RESULTS---- \n ","Hit :",this.hit, "\n Probability of hitting a symbol that has payout : \n  ",this.probOfHittingSym, "\n Hit frequency : ", this.hitFrq)
        console.log("\n **Variance** :", this.variance, " \n **Std dev** :", this.stdDev , " \n **Volatility** : ", this.volatility, "\n RTP Game:", this.rtpGame, "\n RTP Base Game:", this.rtpBaseGame, "\n RTP Free Spin Game:", this.rtpFreeSpinGame, "\n ------------");
        console.log("\n ----PAYMENTS----  \n","\n Total payment :",this.gameRun.netPayment, this.gameRun.roundPayment,"scatters 5 and 4", this.gameRun.fiveScatter,this.gameRun.fourScatter)
        console.log("nudges ", this.gameRun.getNudges())
        console.log("max base payment" , this.gameRun.maxBasePayment , "max fs payment" , this.gameRun.maxFsPayment)
    }

}

a = new StatisticalAnalysis()
a.print()
