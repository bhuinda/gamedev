import 'phaser';

function* intToIter(n: integer) {
    for (let i = 0; i < n; i++) {
        yield i;
    }
}

// CONSTANT VALUES FOR TESTING
enum Colors {
    Red = 0xFF0000,
    Blue = 0x0000FF,
    Cyan = 0x00FFFF,
    Purple = 0x800080,
    Yellow = 0xFFFF00,
    Orange = 0xFFA500,
    Green = 0x008000,
    Lavender = 0xE6E6FA,
    Magenta = 0xFF00FF,
    Gray = 0x808080,
    Forest = 0x228B22,
    Brown = 0xA52A2A,
    Mint = 0x98FF98,
    Black = 0xFF000, // Fix later
    Pink = 0xFFC0CB,

    Default = 0xFFFFFF // For exception of 0 players; id should never return 0.
}

const names = [
    'John', 'Emma', 'James', 'Olivia', 'Michael', 'Sophia', 'David', 'Isabella', 'Daniel', 'Mia',
    'Matthew', 'Charlotte', 'Andrew', 'Amelia', 'Joseph'
];

class Player {
    name: string;
    color: number;
    constructor(name: string, color: number) {
        this.name = name;
        this.color = color;
    }
}

////////////////////////
  
function getColor(playerCount: number): number {
    switch (playerCount) {
        case 1: return Colors.Red;
        case 2: return Colors.Blue;
        case 3: return Colors.Cyan;
        case 4: return Colors.Purple;
        case 5: return Colors.Yellow;
        case 6: return Colors.Orange;
        case 7: return Colors.Green;
        case 8: return Colors.Lavender;
        case 9: return Colors.Magenta;
        case 10: return Colors.Gray;
        case 11: return Colors.Forest;
        case 12: return Colors.Brown;
        case 13: return Colors.Mint;
        case 14: return Colors.Black;
        case 15: return Colors.Pink;
        default: return Colors.Default;
    }
}

interface ImageAsset {
    key: string;
    path: string;
}

const images: ImageAsset[] = [
    {key: 'playerSprite', path: 'assets/dude.png'},
    {key: 'podium', path: 'assets/podium.png'}
];

class PlayGame extends Phaser.Scene {
    // In player container
    bubbles: Phaser.GameObjects.BitmapText[] = [];
    sprites: Phaser.GameObjects.Image[] = [];

    constructor() {
        super("PlayGame");
    }

    preload(): void {
        this.loadImages(images);

        let file = 'minogram_6x10';
        this.load.bitmapFont('pixel', 'assets/' + file + '.png', 'assets/' + file + '.xml');
    }

    create(): void {
        // GAME/STATIC PARAMETERS
        this.cameras.main.setBackgroundColor('#000');
        const centerX = this.cameras.main.centerX;
        const centerY = this.cameras.main.centerY;
        const radius = 360;

        // DATABASE PARAMETERS
        const playerCount = 15; // Currently static
        const players = this.createPlayers(playerCount);
        
        // GRAPHICS CREATION
        this.createPlayerCircle(players, centerX, centerY, radius);
    }

    update(): void {
        //
    }

    // PROCEDURAL METHODS
    createPlayers(playerCount: integer): Player[] {
        const players = []
        for (const count of intToIter(playerCount)) {
            players.push(new Player(names[count], count));
        }

        return players
    }

    createPlayerCircle(players: Player[], centerX: number, centerY: number, radius: number): void {
        for (const [index, player] of players.entries()) {
            const angle = (index / players.length) * 2 * Math.PI;
            const x = centerX + radius * Math.cos(angle);
            const y = centerY + radius * Math.sin(angle);
            
            // TEXT BUBBLE
            const textBubble = this.add
                .bitmapText(x, y - 60, 'pixel', player.name, 20)
                .setTint(getColor(player.color))
                .setOrigin(0.5);
            this.bubbles.push(textBubble);

            // PLAYER SPRITE
            const playerSprite = this.add
                .image(x, y, 'playerSprite')
                .setScale(3)
                .setTint(getColor(player.color));
            this.sprites.push(playerSprite);
        }

        this.add.image(centerX, centerY, 'podium').setScale(1);
    }

    // CUSTOM HELPER METHODS
    loadImages(images: ImageAsset[]): void { 
        for (const image of images) {
            this.load.image(image.key, image.path);
            this.load.on('filecomplete-image-' + image.key, () => {
                this.textures.get(image.key).setFilter(Phaser.Textures.FilterMode.NEAREST);
            });
        }
    }
}

const config = {
    type: Phaser.AUTO,
    fps: { 
        target: 15 
    },
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 1000,
        height: 1000
    },
    antialias: false,
    scene: PlayGame
};

const game = new Phaser.Game(config);