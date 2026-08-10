# Flipbook Template

A reusable 3D storybook: a real hardcover that swings open, full-bleed video
pages that peel over at the corner, ambient sound, an idle "turn the page" nudge
and a closing **The End** page. No build step, no frameworks, nothing to install.

**To make a new book you edit one file — `story.js` — and drop your media in
`pages/` and `sfx/`.** The engine (`script.js`, `styles.css`, `index.html`,
`gsap.min.js`) stays exactly as it is.

---

## Make your book in four steps

**1. Copy this whole folder** and rename it to your project.

**2. Add your clips** to `pages/` as WebM. From an MP4:

```
ffmpeg -i "your clip.mp4" -c:v libvpx-vp9 -crf 34 -b:v 0 -row-mt 1 \
       -pix_fmt yuv420p -c:a libopus -b:a 96k "1.webm"
```

720p is plenty — the book renders into a 1280×720 stage. Keep each clip to a
couple of MB: every reader downloads every clip before Play appears.

**3. Replace `pages/coverpage.webp`** with your own cover art (1280×720). The
one shipped here is only a placeholder so the template boots.

**4. List your pages in `story.js`:**

```js
window.STORY = {
  cover: "pages/coverpage.webp",
  pages: [
    { type: "video", src: "pages/1.webm" },
    { type: "video", src: "pages/2.webm" },
    { type: "video", src: "pages/3.webm" },
    { type: "end" }              // ← keep last
  ]
};
```

That array is the reading order — filenames don't matter. Then open the book
(see *Running it*). Nothing else needs updating: the loading bar, the preloader
and the paper stack all read from `story.js`.

---

## Running it

**Best — serve the folder over http.** Any one of these, from inside the folder:

```
python -m http.server 8000        →  http://localhost:8000
npx serve .
```

You get the real experience: every asset is fetched up front behind a progress
bar and Play only appears at 100%.

**Also works — double-click `index.html`.** On `file://` the browser forbids
`fetch()`, so the preloader stands down and media loads on demand instead. The
book works fine; you just may see a clip buffer on arrival.

---

## What you can put on a page

Full reference is in the comment block at the top of `story.js`. In short:

| Page type | Config |
|---|---|
| Video | `{ type:"video", src, delay, tap }` |
| Image | `{ type:"image", src, alt, bubble }` |
| Cross-dissolving scenes | `{ scenes:[ { src, hold, fx, bubble }, … ] }` |
| Pick-a-hotspot | `{ type:"interactive", src, requireAll, hotspots:[…] }` |
| The End | `{ type:"end" }` — must be last |

- **`delay`** holds a video page on frame 0 for N ms before it starts.
- **`tap: { time, x, y, w, h }`** freezes a clip mid-play and waits for the
  reader to tap a spot, then plays on — an interaction inside a video.
- **`fx`** adds ambient motion over a scene: `"popcorn"`, `"scan"`,
  `"sparkle"`, `"shake"`, or `{ type:"pulse", x, y }`.
- **Interactive pages** show a hand nudge at each hotspot; tapping one plays its
  clip with sound, then dissolves back with the remaining nudges. By default
  Next stays locked until all of them are watched (`requireAll: false` frees
  it). Leaving and returning resets the page.
- **Ambient beds** — `videoSfx` maps a clip to a track that plays under it. See
  `sfx/README.txt`.

### Speech bubbles: read this first

The `bubble` option is wired up, but the **balloon artwork is not included** in
this template — there is no `images/` folder — so a bubble currently renders as
text with nothing behind it. Add your own art and re-measure the crop in the
`kind:"speech"` block in `styles.css` before using bubbles. The video clips
carry their own voice-over, which is how this book normally speaks.

---

## How reading works

- **Forward is earned.** The Next arrow and the drag-forward gesture stay locked
  until the page has played out — its clip finished, its scenes done, or all its
  hotspots watched. Going **back** is always allowed.
- **☰ Skip** (top-right) is the escape hatch: it ends the current page's beat
  and turns forward. Revisiting the page still replays it.
- **Turning pages:** the corner arrows, ← → keys, or dragging the page's corner
  (with a flick shortcut).
- **Idle nudge:** if a reader stalls after a page finishes, a hand cue appears,
  the page corner peels a little as a demo, and the Next arrow blinks.
- **Read again** on The End closes the book — the pages riffle back and the
  cover swings shut — landing on the front cover ready for another read.
- **Fullscreen** is entered on the Play tap (that's the user gesture browsers
  require) and left when you return to the cover.
- **Landscape only** on touch devices; portrait shows a rotate prompt.

---

## Formats

| | Format | Notes |
|---|---|---|
| Video | WebM — VP9 + Opus, `yuv420p` | no MP4 fallback |
| Audio | Ogg Opus — 64k mono / 96k stereo | falls back to synthesised cues |
| Images | WebP | |

Supported by Chrome, Edge, Firefox and Safari 14.1+ (macOS 11+ / iOS 14.5+). On
an older Safari the clips won't play — add `<source>` siblings and ship both
formats if you need to support it.

---

## Tuning the feel

Two numbers are duplicated between JS and CSS **on purpose**, and must be
changed together:

| What | `script.js` | `styles.css` |
|---|---|---|
| Page-turn duration | `FLIP_MS` | `--flip-ms` |
| Hotspot dissolve | `HUB_DISSOLVE_MS` | `--hub-dis` |

Other knobs worth knowing, all in `script.js`:

- `HINT_AFTER_DONE_MS` — how long after a page finishes before the hand nudge
  appears (then `NUDGE_SHOW_MS` on screen, repeating every `NUDGE_GAP_MS`).
- `ML_BEATS` — the curved "wing-beat" speed streaks that sweep across on every
  turn. Each row is one stroke: `y` position, `len`, `th` thickness, `bow`
  curvature, `d` stagger. The matching travel/fade is the `mlBeat` keyframes in
  `styles.css`.
- `LEAF_WINDOW` — how many pages either side stay GPU-renderable.

---

## Optional: a smoother loading bar

The preloader finds your files by itself and learns each real size from the
server's `Content-Length`. If you want the bar perfectly weighted from the first
frame, generate the sizes and paste them into `story.js` as `assetSizes`:

```
node tools/asset-sizes.mjs
```

Purely cosmetic — skip it and everything still loads.

---

## Files

```
index.html      ⚙ engine — the page shell. Only edit <title>.
script.js       ⚙ engine — flip physics, media, sound, preloader.
styles.css      ⚙ engine — the book's look. Theme colours are at the top.
gsap.min.js     ⚙ engine — vendored GSAP 3.13, drives the corner peel.
story.js        ★ YOUR STORY — the only file you need to edit.
pages/          ★ your clips + art  (see pages/README.txt)
sfx/            ★ your sounds       (see sfx/README.txt)
tools/          optional helper script
```

**If the book won't open:** open the browser console. A real JavaScript error is
also printed as a red bar across the bottom of the page, and the engine logs
which sounds loaded, which fell back to synth, and any asset the preloader had
to skip.

**Nothing blocks the Play button.** A missing file, a 404, a stall, a clip that
won't decode — each counts as "done" for the loading bar and the book opens
anyway. A page whose video can't play unlocks itself, so a reader is never
trapped.

---

## Robustness worth knowing about

The non-obvious safeguards already built in, so you don't have to rediscover
them:

- **Three ways forward.** Any control gated on a video appears on `ended`, on
  `error`, *or* via a watchdog timer — a clip that stalls without firing either
  event can't trap the reader.
- **A clip never starts mid-turn.** A page's video is held on frame 0 until its
  sheet has landed, so the voice-over doesn't talk over the page-turn swoosh.
- **Only the current and next page buffer**, and only those are gesture-primed
  for sound — priming everything at once was the original opening lag.
- **Layer windowing.** Pages more than two away are marked dormant so the GPU
  can drop their textures; without it, a long book starts painting blank pages
  on real machines.
