pages/  —  YOUR STORY'S ART AND VIDEO
=====================================

Everything the reader sees goes in this folder. List it in ../story.js and the
engine preloads it automatically — there is no file list to maintain anywhere
else.


ALREADY HERE (engine chrome — keep these two)
---------------------------------------------
    handNudge.webp      the gold pointing hand used by every "tap here" cue
    play button.webp    the Play orb on the cover

    Both are part of the book's UI, not your story. You can restyle them by
    replacing the files (keep the names), but don't delete them.


ALREADY HERE (placeholder — REPLACE this one)
---------------------------------------------
    coverpage.webp      a stand-in cover so the template boots out of the box.
                        Swap in your own art at 1280x720. If you rename it,
                        update `cover:` in ../story.js.


WHAT YOU ADD
------------
    1.webm, 2.webm, …   your story clips, one per page
    <a still>.webp      the background for an interactive page, if you use one

    The names are yours — the ORDER comes from the `pages` array in story.js,
    not from the filenames.


VIDEO FORMAT
------------
WebM (VP9 video + Opus audio). Chrome, Edge, Firefox and Safari 14.1+ play it;
there is no MP4 fallback in this template, so an older Safari will show a blank
page. To convert a clip:

    ffmpeg -i "your clip.mp4" -c:v libvpx-vp9 -crf 34 -b:v 0 -row-mt 1 \
           -pix_fmt yuv420p -c:a libopus -b:a 96k "1.webm"

    -crf   quality: lower = better + bigger. 30-36 is a good window for
           full-screen storybook video; 34 is a solid default.
    720p   is plenty — the book paints into a 1280x720 stage, so a 1080p
           source only costs download time and decode work.

Aim to keep each clip a couple of MB. Every reader downloads EVERY clip before
the Play button appears, so total size is the whole wait.


STILLS
------
WebP, 1280x720:

    ffmpeg -i "your image.png" -q:v 82 "interaction screen.webp"


ONE THING TO KNOW ABOUT FILENAMES
---------------------------------
Spaces are fine ("disco ball.webm") — write them with real spaces in story.js
and the engine percent-encodes them for you. Just be consistent about case:
on a web server "Disco Ball.webm" and "disco ball.webm" are different files,
even though Windows treats them as the same.
