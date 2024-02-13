import 'phaser';

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
    sprites: Phaser.GameObjects.Image[] = [];
    constructor() {
        super("PlayGame");
    }
    preload(): void {
        this.loadImages(images);
    }
    create(): void {
        this.cameras.main.setBackgroundColor('#000');
        const centerX = this.cameras.main.centerX;
        const centerY = this.cameras.main.centerY;
        const radius = 200;
        const playerCount = 15;

        this.setPlayerCircle(playerCount, centerX, centerY, radius);

    }
    update(): void {
        for (const sprite of this.sprites) {
            sprite.angle += 1;
            sprite.x += Math.random() * 2 - 1;
            sprite.y += Math.random() * 2 - 1;
        }
    }

    // PROCEDURAL METHODS
    setPlayerCircle(playerCount: number, centerX: number, centerY: number, radius: number): void {
        for (let i = 0; i < playerCount; i++) {
            const angle = (i / playerCount) * 2 * Math.PI;
            const x = centerX + radius * Math.cos(angle);
            const y = centerY + radius * Math.sin(angle);
            const sprite = this.add.image(x, y, 'playerSprite').setScale(2);
            sprite.setTint(getColor(i));
            this.sprites.push(sprite);
        }

        this.add.image(centerX, centerY, 'podium').setScale(1);
    }

    // HELPER METHODS
    loadImages(images: ImageAsset[]): void { 
        for (let image of images) {
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
        width: 800,
        height: 800
    },
    scene: PlayGame
};

const game = new Phaser.Game(config);