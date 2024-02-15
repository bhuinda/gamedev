import 'phaser';

// CONSTANT VALUES FOR TESTING
const COLORS = [
    0xFF0000, // Red
    0x0000FF, // Blue
    0x00FFFF, // Cyan
    0x800080, // Purple
    0xFFFF00, // Yellow
    0xFFA500, // Orange
    0x008000, // Green
    0xE6E6FA, // Lavender
    0xFF00FF, // Magenta
    0x808080, // Gray
    0x228B22, // Forest
    0xA52A2A, // Brown
    0x98FF98, // Mint
    0xFF000,  // Black (FIX LATER)
    0xFFC0CB, // Pink
    0xFFFFFF  // Default
];

interface ImageAsset {
    key: string;
    path: string;
}

const images: ImageAsset[] = [
    {key: 'player', path: 'assets/player.png'},
    {key: 'podium', path: 'assets/podium.png'}
];

class Player {
    scene: Phaser.Scene;
    name: string;
    color: number;
    container: Phaser.GameObjects.Container;
    constructor(scene: Phaser.Scene, name: string, color: number) {
        this.scene = scene;
        this.name = name;
        this.color = color;
        this.container = this.scene.add.container(0, 0);
    }
}

class PlayGame extends Phaser.Scene {
    // In player container
    players: Player[];

    constructor() {
        super("PlayGame");
    }

    preload(): void {
        this.loadImages(images);

        const font = 'minogram_6x10';
        this.load.bitmapFont('pixel', `assets/${font}.png`, `assets/${font}.xml`);
    }

    create(): void {
        // GAME/STATIC PARAMETERS
        this.cameras.main.setBackgroundColor('#000');

        // DATABASE PARAMETERS
        const playerCount = 15; // Currently static
        this.players = this.createPlayers(playerCount);
        
        // GRAPHICS CREATION
        this.createPlayerCircle(this.players);
        let narratorHeaderText = this.add
            .bitmapText(15, 15, 'pixel', 'DAY 1', 30)
            .setTint(0xFFFF00);
        let narratorBodyText = this.add
            .bitmapText(15, 45, 'pixel', 'The beginning of the end!', 20);

        // narratorHeaderText.setX(centerX - narratorHeaderText.width / 2);
        // narratorHeaderText.setY(narratorHeaderText.height - 30);

        // narratorBodyText.setX(centerX - narratorBodyText.width / 2);
        // narratorBodyText.setY(narratorHeaderText.y + narratorBodyText.height + 10);
        
    }

    update(): void {
    }

    // PROCEDURAL METHODS
    createPlayers(playerCount: integer): Player[] {
        const players = []
        for (let count = 0; count < playerCount; count++) {
            players.push(new Player(this, '...', COLORS[count]));
        }

        return players
    }

    createPlayerCircle(players: Player[]): void {
        for (const [index, player] of players.entries()) {
            const radius = 200;
            const centerX = this.cameras.main.centerX;
            const centerY = this.cameras.main.centerY + 50;

            const angle = (index / players.length) * 2 * Math.PI;
            const x = centerX + radius * Math.cos(angle);
            const y = centerY + radius * Math.sin(angle);

            // PLAYER SPRITE
            const playerSprite = this.add
                .image(x, y, 'player')
                .setScale(1.8)
                .setTint(player.color)
                .setOrigin(0.5);
            player.container.add(playerSprite);

            // PLAYER BUBBLE (TEXT, EMOTE, ETC.)
            const playerBubble = this.add
                .bitmapText(x, y - 40, 'pixel', player.name, 20)
                .setTint(player.color)
                .setOrigin(0.5);
            player.container.add(playerBubble);

            // PODIUM
            this.add.image(centerX, centerY, 'podium').setScale(2);
        }
    }

    // CUSTOM HELPER METHODS
    loadImages(images: ImageAsset[]): void { 
        for (const image of images) {
            this.load.image(image.key, image.path);
        }
        this.load.on('filecomplete', (key: string) => {
            if (this.textures.exists(key)) {
                this.textures.get(key).setFilter(Phaser.Textures.FilterMode.NEAREST);
            }
        });
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
        width: 480,
        height: 640
    },
    antialias: false,
    scene: PlayGame
};

const game = new Phaser.Game(config);