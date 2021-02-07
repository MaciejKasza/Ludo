class Game {
    constructor() {
        this.pawns = [];
        this.track = this.createTrack(40);
        this.teams = this.createTeams();

        this.board = new Board();
        this.dice = new Dice();

        this.phases = ['rool', 'selectPawn', 'movePawn', 'checkVicoty'];
        this.curentTurn = {
            currentPlayer: 'red',
            currentPlayerID: 0,
            currentPhase: 0,
            selectedPawn: null,
            roll: null
        }

        this.board.addEventListener(this);
        this.render();

        this.startGame();
    }

    startGame() {
        document.querySelector('.board').addEventListener('click', (event) => {
            const phaseNumber = this.curentTurn.currentPhase;
            console.log(phaseNumber);
            switch (phaseNumber) {
                case 0: {
                    console.log(event.target);
                    if (event.target.classList.contains('dice') || event.target.classList.contains('dot')) {
                        this.curentTurn.roll = this.dice.roll();


                        this.curentTurn.currentPhase++;
                    }
                    break;
                }
                case 1: {
                    //console.log(event.target);
                    let playerName = this.curentTurn.currentPlayer;
                    let playerID = this.curentTurn.currentPlayerID;
                    let roll = this.curentTurn.roll;
                    console.log('player id ' + playerID);
                    let eventTarget = event.target;
                    //Jeśli nie ma pionka na planszy
                    console.log(eventTarget);
                    if (this.teams[playerID].pawns.length == 4 && roll == 6) {
                        let result = this.movePawnFromBase(this.teams[playerID].pawns[0]);
                        this.curentTurn.currentPhase = 0;
                    } else if (this.teams[playerID].pawns.length == (4 - this.teams[playerID].pawnsInFinish) && roll != 6) {
                        this.changePlayer();
                    } else {
                        //Jęsli wybierzemy pionka
                        if (eventTarget.classList.contains(`fa-circle`) && eventTarget.classList.contains(`${playerName}`)) {
                            this.movePawnOnTrack(this.track[eventTarget.parentNode.dataset.fieldid], roll)
                            this.curentTurn.currentPhase++;
                            this.changePlayer();
                        }
                        if (eventTarget.classList.contains(`base`) && roll == 6) {
                            if (this.teams[playerID].pawns.length > 0) {
                                let result = this.movePawnFromBase(this.teams[playerID].pawns[0]);
                                if (result != -1) this.curentTurn.currentPhase++;
                                this.curentTurn.currentPhase = 0;
                            }
                        }
                    }
                    break;
                }
                case 2: {
                    this.changePlayer();
                    break;
                }

                default:
                    break;
            }

            this.render();
        })
    }

    changePlayer() {


        this.curentTurn.currentPlayerID = (this.curentTurn.currentPlayerID + 1) % 4;
        if (this.curentTurn.currentPlayerID == 0) {
            this.curentTurn.currentPlayer = 'red'
        }
        if (this.curentTurn.currentPlayerID == 1) {
            this.curentTurn.currentPlayer = 'green'
        }
        if (this.curentTurn.currentPlayerID == 2) {
            this.curentTurn.currentPlayer = 'yellow'
        }
        if (this.curentTurn.currentPlayerID == 3) {
            this.curentTurn.currentPlayer = 'blue'
        }

        this.curentTurn.currentPhase = 0;
        this.selectedPawn = null;
        this.roll = null;


    }

    findPawn(team, id) {
        console.log(team, id);

        let p = null;

        this.pawns.forEach(pawn => {
            // console.log(pawn);
            if (pawn[id].team == 'red') {
                p = pawn[id];
            }
            console.log();
            if (pawn[id].team == 'green') {
                p = pawn[id];
            }
            if (pawn[id].team == 'yellow') {
                p = pawn[id];
            }
            if (pawn[id].team == 'blue') {
                p = pawn[id];
            }
        })

        return p;

    }

    createTrack(trackLength) {
        let track = [{}];

        for (let i = 0; i < trackLength; i++) {
            track[i] = null;
        }

        return track;
    }

    createTeams() {
        let teams = [];

        for (let i = 0; i < 4; i++) {
            let team = {};
            if (i == 0) {
                team.name = 'red';
                team.startFieldID = 0;
            } else if (i == 1) {
                team.name = 'green';
                team.startFieldID = 10;
            } else if (i == 2) {
                team.name = 'yellow';
                team.startFieldID = 20;
            } else {
                team.name = 'blue';
                team.startFieldID = 30;
            }

            team.pawns = [new Pawn(0, team.name), new Pawn(1, team.name), new Pawn(2, team.name), new Pawn(3, team.name)];
            team.pawnInBase = 4;
            team.pawnsInFinish = 0;
            team.finishTrack = [null, null, null, null];


            this.pawns.push([...team.pawns])
            teams.push(team);
        }

        return teams;
    }



    movePawnFromBase(pawn) {
        let teamName = pawn.team;
        let teamId = 0;
        if (pawn.team == 'red') {
            teamId = 0;
        }
        if (pawn.team == 'green') {
            teamId = 1;
        }
        if (pawn.team == 'yellow') {
            teamId = 2;
        }
        if (pawn.team == 'blue') {
            teamId = 3;
        }

        const trackField = this.track[this.teams[teamId].startFieldID];

        if (trackField === null) {
            this.track[this.teams[teamId].startFieldID] = pawn;
            this.teams[teamId].pawnInBase--;
            this.teams[teamId].pawns.splice(0, 1);
            pawn.fieldsTaken = 0;
        } else if (trackField.team != pawn.team) {
            this.movePawnToBase(trackField);
            this.track[this.teams[teamId].startFieldID] = pawn;
            this.teams[teamId].pawnInBase--;
            this.teams[teamId].pawns.splice(0, 1);
            pawn.fieldsTaken = 0;
        } else {
            console.log('Rusz jakims pionem')
            return -1;
        }

    }

    movePawnToBase(pawn) {
        let teamBase = this.teams.find(team =>
            team.name == pawn.team
        )
        //console.log(teamBase);
        if (teamBase.pawnInBase < 4) {
            teamBase.pawnInBase++;
            teamBase.pawns.push(pawn);
            this.track.forEach((item, index, array) => {
                if (item === pawn) array[index] = null;
            })
        } else {
            console.log('W bazie jest maksymapna ilośc pionów');
        }
    }

    movePawnOnTrack(pawn, shift) {
        let actualPawnPos = this.track.indexOf(pawn);
        let newPawnPos = (actualPawnPos + shift) % 40;
        let pawnTeamID = this.teams.map((item, index) => {
            if (item.name == pawn.team) return index
        })[0]

        if (pawn.fieldsTaken + shift >= 40) {
            let pos = (pawn.fieldsTaken + shift) % 40 % 4;
            if (this.movePawnOnFinishTrack(pawn, pos)) {
                this.track[actualPawnPos] = null;
            } else {
                console.log('Pole zajete');
            }
        } else {
            if (this.track[newPawnPos] === null) {
                this.track[actualPawnPos] = null;
                this.track[newPawnPos] = pawn;
                pawn.fieldsTaken += shift;
            } else if (this.track[newPawnPos].team === pawn.team) {
                console.log('Rusz innego piona, pole zablokowane');
            } else if (this.track[newPawnPos].team != pawn.team) {
                this.movePawnToBase(this.track[newPawnPos])
                this.track[newPawnPos] = pawn;
                this.track[actualPawnPos] = null;
                pawn.fieldsTaken += shift;
            } else {
                this.track[newPawnPos] = pawn;
                pawn.fieldsTaken += shift;
            }
        }
        // console.log(this.track);
    }

    movePawnOnFinishTrack(pawn, trackPos) {
        let pawnTeamId = this.teams.map((item, index) => {
            if (item.name == pawn.team) return index
        }).find(item => typeof item === 'number');
        console.log(this.teams[pawnTeamId].finishTrack[pawnTeamId]);
        if (this.teams[pawnTeamId].finishTrack[trackPos] === null) {
            this.teams[pawnTeamId].finishTrack.splice(trackPos, 1, pawn);
            this.teams[pawnTeamId].pawnsInFinish++;
            return true;
        } else {
            return false;
        }
    }

    checkVicotry() {
        let winner = null;
        this.teams.forEach((item) => {
            if (item.pawnsInFinish === 4) {
                winner = item.name;
            } else {
                winner === null;
            }

        })
        return winner;
    }

    render() {
        this.board.render(this.track, this.teams)
    }
}

class Pawn {
    constructor(id, team) {
        this.id = id;
        this.team = team;
        this.fieldsTaken = 0;
    }
}

class Board {
    constructor() {
        this.trackFields = this.loadTrackFields();
        this.bases = this.loadBases();
        this.finalTracks = this.loadFinalTracks();

        this.pawns = this.loadPawns();


    }

    addEventListener(game) {
        this.trackFields.forEach(field => {
            field.addEventListener('click', function (e) {
                const fieldID = this.dataset.fieldid;
                // console.log(game);
                // console.log(fieldID);
                // console.log(game.track[fieldID])
                if (game.track[fieldID] != null) {
                    game.curentTurn.selectedPawn = {
                        name: game.track[fieldID].team,
                        id: game.track[fieldID].id
                    }
                } else {
                    game.curentTurn.selectedPawn = null;
                }
            })
        }, false)
    }

    loadTrackFields() {
        let fields = [...document.querySelectorAll('[data-fieldID]')];

        fields.sort((a, b) => {
            if (parseInt(a.dataset.fieldid) < parseInt(b.dataset.fieldid)) return -1;
            else if (parseInt(a.dataset.fieldid) > parseInt(b.dataset.fieldid)) return 1
            else return 0;
        });
        console.log(fields);
        return fields;
    }

    loadBases() {
        const bases = [];
        let base;
        for (let i = 0; i < 4; i++) {
            base = {};
            if (i == 0) base.name = 'red';
            if (i == 1) base.name = 'green';
            if (i == 2) base.name = 'yellow';
            if (i == 3) base.name = 'blue';
            base.id = i;
            base.div = document.querySelectorAll('.base')[i];
            base.fields = base.div.children;

            bases.push(base);
        }
        // console.log(bases);
        return bases;

    }

    loadFinalTracks() {
        const finalTracks = [];

        let track = {};
        for (let i = 0; i < 4; i++) {
            track = {};
            track.id = i;
            if (i == 0) track.name = 'red';
            if (i == 1) track.name = 'green';
            if (i == 2) track.name = 'yellow';
            if (i == 3) track.name = 'blue';

            track.div = [...document.querySelectorAll('.finish> div')].filter((item) => item.classList.contains(track.name));

            track.div.sort((a, b) => {
                if (a.dataset.id < b.dataset.id) return -1;
                if (a.dataset.id > b.dataset.id) return 1;
                else 0;
            })

            finalTracks.push(track)
        }

        // console.log(finalTracks);
        return finalTracks;
    }

    loadPawns() {
        const pawns = document.querySelectorAll('i .fa-circle');

    }

    render(track, teams) {
        //Odściwrzanie toru:
        track.forEach((field, index) => {
            if (field !== null) {
                const pawn = document.createElement('i');
                pawn.className = `fas fa-circle ${field.team}`;
                pawn.dataset.id = `${field.id}`;
                // console.log(pawn);
                this.trackFields[index].appendChild(pawn);
            } else if (field === null) {
                if (this.trackFields[index].children.length != 0) {
                    this.trackFields[index].textContent = index;
                }
            }

        });
        //odświrzanie baz

        this.bases.forEach((base, index) => {
            let pawnsToRemove = 4 - teams[index].pawnInBase;
            // console.log(pawnsToRemove);
            for (let i = 0; i < 4; i++) {
                if (i < pawnsToRemove) {
                    // console.log('usuwam');
                    base.fields[i].textContent = '';
                } else {
                    // console.log('nie usuwam', base.fields[i].children.length);
                    if (base.fields[i].children.length === 0) {
                        // console.log('new pawn');
                        const pawn = document.createElement('i');
                        pawn.className = `fas fa-circle ${base.name}`;
                        pawn.dataset.id = `${base.id}`;
                        base.fields[i].appendChild(pawn)
                    }
                }
            }
        });
        //odwierzanie final tracków
        teams.forEach((team, teamIndex) => {
            // console.log(teamIndex);
            team.finishTrack.forEach((field, fieldIndex) => {
                // console.log(field);
                // console.log(this.finalTracks);
                if (field != null) {
                    const pawn = document.createElement('i');
                    pawn.className = `fas fa-circle ${team.name}`;
                    pawn.dataset.id = `${field.id}`;
                    this.finalTracks[teamIndex].div[fieldIndex].appendChild(pawn);
                }
            });
        });
    }
}

class Dice {
    constructor() {
        this.diceHTML = this.loadDice();
    }

    roll() {
        let value = Math.floor(Math.random() * 6) + 1;
        this.diceHTML.textContent = '';
        for (let i = 0; i < value; i++) {

            const span = document.createElement('span');
            span.className = 'dot';

            if (this.diceHTML.classList.contains('five'))
                this.diceHTML.classList.remove('five')

            if (value == 5)
                this.diceHTML.classList.add('five');
            else if (value == 4) {
                span.style.margin = '10%';
            }



            this.diceHTML.appendChild(span);
        }
        return value
    }

    loadDice() {
        return document.querySelector('.dice');
    }

}

let game = new Game();

let red = game.teams[0].pawns[0];
let green = game.teams[1].pawns[0];
let yellow = game.teams[2].pawns[0];
let blue = game.teams[3].pawns[0];

game.movePawnFromBase(red);
game.movePawnFromBase(green);
game.movePawnFromBase(blue);
game.movePawnFromBase(yellow);

//game.movePawnOnTrack(red, 39);
// console.log(game.track);
// console.log(game.teams);

game.render();