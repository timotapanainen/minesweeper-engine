
class Difficulty {

    constructor(name, width, height, mines) {
        this.name = name;
        this.width = width;
        this.height = height;
        this.mines = mines;
    }

    static valueOf(difficultyName) {
        switch (difficultyName) {
            case 'beginner': return Difficulty.Beginner;
            case 'intermediate': return Difficulty.Intermediate;
            case 'expert': return Difficulty.Expert;
            default:
                throw new Error(`unknown difficulty name ${difficultyName}`);
        }
    }

    toString() {
        return `${this.name} (${this.width}x${this.height} ${this.mines}m)`
    }
}

Difficulty.Beginner = new Difficulty('Beginner', 10, 10, 10);
Difficulty.Intermediate = new Difficulty('Intermediate', 16, 16, 40);
Difficulty.Expert = new Difficulty('Expert', 30, 16, 99);

module.exports = Difficulty;