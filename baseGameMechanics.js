const BaseGameSlot = require("./baseGameSlot");
const  {loadJson} = require("./helpers");


class BaseGameMechanism{
    bet = 1;

    constructor(){
        this.winlines = [];
        this.scatterLines = [];
        this.paymentsym = [];
        this.payment = [];
        this.roundPayment = 0;
        this.slot = [[]];
        

        this.isThreeScatter = false ;
        this.isFourScatter = false ;
        this.isFiveScatter = false ;


        this.threeScatter = 0; //shows total num of "hitting 3 scatter" symbol. 
        this.fourScatter = 0; //shows total num of "hitting 4 scatter" symbol. 
        this.fiveScatter = 0; //shows total num of "hitting 5 scatter" symbol. 

        this.getSlot(); 

    }

    getSlot(){
        this.slot = new BaseGameSlot()
        this.slot.setReels()
    }
    
    updateSpin(){
        this.slot.spin();
    }

    setPaytable(){
        let symJson = loadJson("baseReelSymbols");
        this.paymentsym = symJson.BaseSym;
    }

    paylines(){
        let curIterSym = "" ;
        let paylines = generateCombinations(5, [0, 1, 2]);
        // console.log("paylines 243 way", paylines, "\\ num of paylines", paylines.length);

        this.winlines = []

        for(let payline of paylines) {

            let count = 0;
            let lastEvSym = "";
            let sym = "";
            for(let [col,row] of payline.entries()){
                let curSymObj = this.slot.getReel(col).getSymbol(row)
                // let curSymObj = this.slot[col][row]//test
                curIterSym = curSymObj.symbolName
            
                if(curSymObj.isWild||curSymObj.isLowSym || curSymObj.isMidSym|| curSymObj.isHighSym){
                    if(lastEvSym == ""||(curSymObj.isWild && count == 0)||(sym != "W" && !curSymObj.isWild && curIterSym == lastEvSym)||(sym == "W" && !curSymObj.isWild)){
                    lastEvSym = sym = curIterSym;
                    count++
                    }
                    else if((sym != "W" && curSymObj.isWild)||(sym != "W" && !curSymObj.isWild && (curIterSym != lastEvSym && lastEvSym == "W") && sym == curIterSym)||(sym==curIterSym==lastEvSym=="W")){
                        lastEvSym = "W";
                        count++;
                    }
                    // else if (sym == "W" && curSymObj.isWild && curIterSym == lastEvSym && count > 0) {
                    // //wild symbol pays
                    //     count++;
                    // }
                    else {
                        break;
                    }
                }    
            }
            if (count > 2) {           
                this.winlines.push([sym,count,payline]);
            }
        };

        function generateCombinations(length, values) { 
            //Generate all combinations to get paylines due to num of reel's row and num of reels.
            const combinations = [];
        
            function backtrack(index, currentCombination) {
                if (index === length) {
                    combinations.push([...currentCombination]);
                    return;
                }
        
                for (const value of values) {
                    currentCombination.push(value);
                    backtrack(index + 1, currentCombination);
                    currentCombination.pop();
                }
            }
        
            backtrack(0, []);
            return combinations;
        }
    }

    paytable(){
        this.payment = [];
        let payout = 0;
 
        let paytable=[
            [0,0,0.2,0.5,1.0], //l0
            [0,0,0.3,0.8,1.5], //l1
            [0,0,0.3,1.0,2.0], //l2
            [0,0,0.4,1.0,3.0], //l3
            [0,0,0.5,1.2,5.0], //m0
            [0,0,0.6,1.5,7.5], //m1
            [0,0,0.8,2.0,10.0], //m2
            [0,0,1.0,3.0,12.0], //h0
            [0,0,2.0,3.0,15.0], //h1
            [0,0,3.0,6.0,20.0], //h2
            [0,0,5.0,15.0,50.0], //s
            
        ];
        
        for(let payline of this.winlines){
            let s = payline[0];
            let cs = payline[1];
            let ind = this.paymentsym.indexOf(s);
            payout = paytable[ind][cs-1];            
            this.payment.push([s,cs,payout]);
        }
        for(let payline of this.scatterLines){
            let s = payline[0];
            let cs = payline[1];
            let ind = this.paymentsym.indexOf(s);
            payout = paytable[ind][cs-1];            
            this.payment.push([s,cs,payout]);
        }
    }
    roundPayout(){
        // ROUND PAYOUT SHOWS THE TOTAL PAYOUT OF X NUMBER OF WINLINES FOR A ROUND. 
        this.roundPayment = 0;
        for(let pay of this.payment){
            this.roundPayment = (pay[2] >= this.roundPayment) ? pay[2] : this.roundPayment;
        }
    }
 
    countScatter(){
        this.isThreeScatter = false ;
        this.isFourScatter = false ;
        this.isFiveScatter = false ;

        this.scatterLines = [];
        let sCount = 0;
        for( let i = 0; i<5; i++){
            for(let j = 0; j<3; j++){
                // let sym = this.slot[i][j] //test
                let sym = this.slot.getReel(i).getSymbol(j)
                if(sym.isScatter){
                    sCount++
                }
            }
        }
        if(sCount===3){
            this.threeScatter++  
            this.isThreeScatter = true;
            this.scatterLines.push(["S",sCount])
        }
        if(sCount===4){
            this.fourScatter++  
            this.isFourScatter = true;
            this.scatterLines.push(["S",sCount])
        }
        if(sCount===5){
            this.fiveScatter++  
            this.isFiveScatter = true ;

            this.scatterLines.push(["S",sCount])

        }
    }
}


module.exports = BaseGameMechanism

