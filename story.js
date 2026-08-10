/* ============================================================================
   ██  YOUR STORY  —  this is the ONLY file you edit to make a new flipbook  ██
   ----------------------------------------------------------------------------
   Put your videos + art in  pages/  and your sounds in  sfx/ , then list them
   below. You never need to touch the engine (script.js, styles.css, index.html).

   QUICK START
   ----------------------------------------------------------------------------
     1. Drop your clips into  pages/   (WebM — see README.md for the ffmpeg line)
     2. Replace  pages/coverpage.webp  with your own cover art (1280x720)
     3. List your clips in `pages` below, in reading order
     4. Open index.html (or serve the folder) — that's it. The loading bar, the
        preloader and the paper stack all follow this file automatically.

   HOW A PAGE WORKS
   ----------------------------------------------------------------------------
   • Each entry in `pages` is ONE page of the book, shown in order after the
     cover. A page is either a single image/video, or a list of `scenes` that
     cross-dissolve into each other (1.1s) on the same page.

   • A single-video page:  { type:"video", src, delay, tap }
       src   : the clip, e.g. "pages/1.webm"
       delay : ms to hold on frame 0 before the clip starts (optional)
       tap   : { time, x, y, w, h } — freeze at `time` seconds and wait for the
               reader to tap (x,y), then play on. A mid-clip interaction.
     A single-image page:   { type:"image", src, alt, bubble }

   • A scene:  { src, hold, fx, bubble }
       src    : the image ("pages/x.webp") or video (".webm").
       hold   : ms to linger before dissolving to the next scene
                (default 1600; a video with no hold advances when it ends).
       fx     : optional ambient animation over the art —
                "popcorn" | "scan" | "sparkle" | "shake"
                | { type:"pulse", x:"48%", y:"62%" }  (a glow at a point)
       bubble : optional speech bubble (below).

   • A speech bubble:  bubble: { kind:"speech", text, box, flip, typeSpeed }
       text     : the words. Use "\n" to choose where the line breaks.
       box      : { top / left / right / bottom, w } — position (CSS %) and
                  WIDTH in book-space px (the book is 1280 x 720).
       flip     : true → mirror the bubble so its tail points the other way.
       typeSpeed: ms per typed character (default 45) — lower = faster.
     NOTE: bubble ART is not shipped with this template (there is no images/
     folder), so a bubble currently renders as text with no balloon behind it.
     See the "kind:speech" note in styles.css if you want to add the artwork.

   • Video pages need NO companion poster image: the engine loads each clip's
     metadata so the browser paints the video's own first frame as the page's
     opening still, then buffers the rest lazily.

   • An INTERACTIVE page — one still, several clips the reader picks:
         { type:"interactive", src, requireAll, hotspots:[ … ] }
       src        : the still that IS the page (stays the top layer; every clip
                    sits in a layer BEHIND it and is revealed on tap).
       hotspots   : the tappable places. Each one is
                      { src, label, x, y, w, h }
                        src   : the clip that plays when this spot is tapped
                        label : screen-reader name ("the disco ball")
                        x, y  : CENTRE of the spot, in CSS % of the page
                        w, h  : size of the tap target, in CSS % of the page
                    A small hand nudge appears at every spot. Tapping one
                    hides all the nudges, cross-dissolves to that clip, plays it
                    with sound, then dissolves back to the still and brings the
                    REMAINING nudges back. A tapped spot's nudge is spent.
       requireAll : true (default) → the forward turn stays locked until every
                    hotspot has been watched. false → forward is free at once.
                    (☰ Skip always overrides, exactly as on a video page.)
     Leaving the page and coming back RESETS it — all nudges return.

   • Last entry must be  { type: "end" }  — the closing "The End" page.
   ============================================================================ */
window.STORY = {

  /* ── THE COVER ────────────────────────────────────────────────────────────
     The art on the closed book — 16:9, painted into the book's 1280x720 stage.
     This is a 1920x1080 PNG (2.4 MB); re-saving it as WebP at 1280x720 would
     cut ~2 MB off the wait before Play appears. */
  cover: "pages/cover page.png",

  /* ── THE PAGES ────────────────────────────────────────────────────────────
     THIS ARRAY decides the reading order — the filenames do not. Add, remove
     or reorder freely; the engine reads the length for the paper stack and
     preloads whatever it finds here.

     Each video page waits for its clip to FINISH before the Next arrow appears
     (☰ Skip is always there as an escape hatch). Revisiting a page replays it. */
  pages: [
    /* 1 — THE SETUP (0:58)
       The golden palace, Kabir and Tara playing, the storm, the guards taking
       her, the ring left behind: "I promise! I will find you, Tara." */
    { type: "video", src: "pages/1.mp4" },

    /* 2 — THE NINE GEMS (0:33)
       "Great work! You found all nine gems" → they go into the holes on the
       door, the door opens: "Come now Kabir… your next challenge." */
    { type: "video", src: "pages/2.mp4" },

    /* 3 — THE FINAL CHALLENGE (0:45)
       "Now, let us go to our final challenge" — the matching game on the
       plates: "That key will open the final door for you." */
    { type: "video", src: "pages/3.mp4" },

    /* 4 — THE REUNION (0:24)
       "You did a wonderful job matching everything!" → the key opens the last
       door → "Oh Tara! I missed you" → "You were brave and kind, Kabir." */
    { type: "video", src: "pages/4.mp4" },

    /* NOTE: pages/5.mp4 is left out on purpose — it is the same footage as
       3.mp4 (identical frames and runtime, re-exported). Delete it to save
       6.9 MB of download, or list it here if it really is a separate beat. */

    /* ── EXAMPLE: an interactive "explore the scene" page ───────────────────
       Uncomment and point it at your own still + clips. x/y are the CENTRE of
       each tap target as a % of the page, w/h its size.

    {
      type: "interactive",
      src: "pages/interaction screen.webp",
      requireAll: true,          // Next unlocks once all of them are watched
      hotspots: [
        { src: "pages/clip a.webm", label: "the first thing",
          x: "50%", y: "16%", w: "15%", h: "26%" },
        { src: "pages/clip b.webm", label: "the second thing",
          x: "50%", y: "65%", w: "24%", h: "20%" }
      ]
    },
    */

    /* ── EXAMPLE: a page that pauses mid-clip for a tap ────────────────────
    { type: "video", src: "pages/4.webm",
      tap: { time: 6.5, x: "62%", y: "48%", w: "22%", h: "50%" } },
    */

    { type: "end" }    // ← keep this last: the closing "The End" page
  ],

  /* ── AMBIENT SOUND BEDS (optional) ────────────────────────────────────────
     An extra track that rides UNDER one specific clip's own audio. Key is the
     clip's src exactly as written above; `vol` (0..1) keeps it below the
     voice-over — 0.5-0.6 is a good starting point. Delete this whole block if
     your clips carry all the sound they need.

  videoSfx: {
    "pages/2.webm": { url: "sfx/crowd.ogg", vol: 0.55 },
    "pages/3.webm": { url: "sfx/drums.ogg", vol: 0.50 }
  },
  */

  /* ── LOADING-BAR WEIGHTS (optional) ───────────────────────────────────────
     The preloader finds your files by itself; this only makes the progress bar
     smoother by telling it each file's size UP FRONT instead of waiting for the
     server's Content-Length. Generate the block with:

         node tools/asset-sizes.mjs

     and paste its output here. Safe to leave out entirely. */

  /* Generated by tools/asset-sizes.mjs — re-run it after re-encoding anything. */
  assetSizes: {
    "pages/handNudge.webp":          6546,
    "sfx/page flip.ogg":            12704,
    "sfx/play button sound.ogg":    13840,
    "pages/play button.webp":      148188,
    "pages/cover page.png":       2441570,
    "pages/4.mp4":                4549743,
    "pages/2.mp4":                5772094,
    "pages/3.mp4":                6893179,
    "pages/1.mp4":               19841224
  },
  // 9 files, 37.5 MB — what a first-time reader downloads before Play appears.
};
