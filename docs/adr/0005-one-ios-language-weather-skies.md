# One iOS language throughout: Weather-app skies, one type family, white Ink

This replaces ADR 0003. The site keeps its day, but tells it the way the iOS Weather app does. Each Time slot's Sky is a soft gradient with a glow instead of a flat, saturated colour. Every Sky carries the same white Ink and a single sunlight Accent. San Francisco (Inter off Apple devices) is the only type family. Content sits in translucent modules.

We chose this because the mix read as cheap. Inside the iOS Frame, the Posters spoke a different language: brutalist poster type in Archivo and JetBrains Mono, stepped PUMA motion, glitch and static. Side by side in the Switcher, seven unrelated flat Skies with seven Accents made a rainbow. So the gritty Motifs are gone (glitch, static, paper grain, long shadow, slam, ticker). The two kept are smooth: the name typing in, and the 48% count, now an Activity ring.

A Poster now has two parts. Its Hero is one designed screen, and it is both the face of its Card and the top of the open Poster. Its Detail is built below the Hero only while the Poster is open. A Card used to be a scaled-down copy of a long Poster's first screen, so its small type shrank to noise; designing the Hero for both sizes fixes that, and building the Detail on demand keeps the page light.
