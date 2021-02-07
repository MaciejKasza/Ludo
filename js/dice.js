class Dice{
    constructor(){
        this.diceHTML = this.loadDice();        
    }

    roll(){
        let value = Math.floor(Math.random()*6)+1;
        this.diceHTML.textContent = '';
        for (let i = 0; i<value;i++){
            
            const span = document.createElement('span');
            span.className = 'dot';
            
            if(this.diceHTML.classList.contains('five'))
                this.diceHTML.classList.remove('five')

            if(value == 5) 
                this.diceHTML.classList.add('five');
            else if(value == 4){
                span.style.margin = '10%';
            }
            
            

            this.diceHTML.appendChild(span);
            }
        return value
    }

    loadDice(){
        return document.querySelector('.dice');
    }
    
}

export default new Dice();