# Generate mix.py for a Shorts project from its render.py (scene starts -> chord changes, slam/pin/stamp times -> hits).
import re, sys, os
d = sys.argv[1]
src = open(os.path.join(d, 'render.py')).read()
DUR = float(re.findall(r'^DUR = ([\d.]+)', src, re.M)[-1])
scen = src[src.rindex('SCENES = ['):]
starts = sorted(set(float(x) for x in re.findall(r'\(([\d.]+), [\d.]+, sc_', scen)))
times = sorted(set(float(x) for x in re.findall(r"(?:slam\(im, [^,]+, t, |pin\(im, t, |stamp\(im, t, )([\d.]+)", src) if float(x) < DUR))
hits, last = [], -9
for x in times:
    if x - last >= 1.6: hits.append(x); last = x
chords = [[26, 38, 41, 45], [22, 34, 38, 41], [24, 36, 39, 43], [21, 33, 36, 40]]
prog = ', '.join(f'({s}, {chords[i % 4]})' for i, s in enumerate(starts))
tpl = open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'mix_template.py')).read()
tpl = re.sub(r'SR = 48000; DUR = [\d.]+', f'SR = 48000; DUR = {DUR}', tpl)
tpl = re.sub(r"PROG = \[.*?\(DUR \+ 1, \[\]\)\]", f"PROG = [{prog}, (DUR + 1, [])]", tpl, flags=re.S)
tpl = re.sub(r"for i, tt0 in enumerate\(.*?\):", f"for i, tt0 in enumerate([t_ for t_ in np.arange({starts[1] if len(starts) > 1 else 5}, {DUR - 12:.1f}, 1.7)]):", tpl, count=1)
tpl = re.sub(r"for s0, s1, g in \[.*?\]:", "for s0, s1, g in []:", tpl)
tpl = re.sub(r"HITS = \[.*?\]\n", "HITS = [" + ', '.join(f'({h}, {1.0 if i % 3 == 0 else .7})' for i, h in enumerate(hits)) + "]\n", tpl, flags=re.S)
big = hits[::4][:6]
tpl = re.sub(r"for at, d in \[.*?\]:", "for at, d in [" + ', '.join(f'({h}, 1.4)' for h in big if h > 2) + "]:", tpl)
tpl = re.sub(r"hum_env = .*\n", "hum_env = 0 * t\n", tpl)
open(os.path.join(d, 'mix.py'), 'w').write(tpl)
print('mix generated', DUR, len(hits), 'hits')
