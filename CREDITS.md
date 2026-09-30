# Credits

Petal Pusher (working title of the Shelf Drop prototype)

## Art
All prize stickers, the planter pusher, the cabinet, the shelf, the icons and the UI art
are original hand-authored SVG, written in `src/art.js` and `src/scene-art.js` for this
game and rasterized at boot. No stock art, no AI-generated images, and no third-party
art assets.

## Sound
All sound effects are generated live in the browser with the Web Audio API (`src/sfx.js`).
There are no audio files and no samples.

## Code
- Game code: original, written for this project.
- Phaser 3.90.0: MIT License, (c) Richard Davey / Phaser Studio Inc. Vendored as `lib/phaser.min.js`.
- matter-js 0.20.0: MIT License, (c) Liam Brummitt. Bundled inside Phaser; the npm copy is used only by the offline tuning sim (`tools/econ-sim.cjs`).

## Names
"Princess Angel Baby Subscriber Gift Box" is a private in-joke prize name for the
playtester. Rename it before any public release.
