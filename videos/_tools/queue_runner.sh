#!/bin/bash
# Sequential render queue: lines "<dir> <dur> <out>" in queue.txt; processed lines move to queue.done. Exits after 3h idle.
Q=/home/user/Ilk-depom/videos/_tools/queue.txt; DONE=/home/user/Ilk-depom/videos/_tools/queue.done; T="$(cd "$(dirname "$0")" && pwd)"
[ -n "$1" ] && while kill -0 "$1" 2>/dev/null; do sleep 5; done
idle=0
while [ $idle -lt 2160 ]; do
  L=$(head -n1 "$Q" 2>/dev/null)
  if [ -z "$L" ]; then sleep 5; idle=$((idle+1)); continue; fi
  idle=0; sed -i '1d' "$Q"; set -- $L
  echo "START $3 $(date +%T)"; bash "$T/shorts_pipeline.sh" "$1" "$2" "$3" && echo "$L" >> "$DONE" && echo "DONE $3 $(date +%T)"
done
