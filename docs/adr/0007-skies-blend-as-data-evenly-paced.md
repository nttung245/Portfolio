# Skies blend as data, and each swipe changes the colour about as much as the next

The ambient light used to cross-fade two painted Skies mid-swipe. Measured as colour difference in OKLab (ΔE, about 2 is just noticeable), the swipes were uneven: Experience to Playground changed by 6, while Profile to Objective and Skills to Education changed by 24. The cross-fade, done in RGB, also greyed the colour halfway (by about 30% from Profile to Objective). And because each Sky's glow sat somewhere else, one glow faded out while another faded in.

So every Sky now has the same shape: five colour stops and two glows, the sun and the moon (alpha 0 while it is down). `mixSky` blends two Skies stop by stop in OKLCH, so lightness, chroma and hue move evenly and a blend keeps its colour (peach to blue goes by way of lavender, not grey). Glows glide to their next place, and one with far to go dims on the way instead of crossing the middle of the screen. Painting a blend costs about 0.02 ms on the 96px canvas.

The seven Skies were retuned so each swipe changes the colour by 10 to 21, with brightness rising to Experience and falling evenly to Contact. Playground gained a gold horizon that Skills picks up, and Education an afterglow, so night does not fall all at once. Profile stays matched to its photo, which keeps its swipe the largest.

When you change a Sky, keep five stops and both glows, and re-check the step to its neighbours: a Sky that changes little from the one before it makes the day stall, and one that changes a lot makes it lurch.
