// helper functions

function distance(a, b) {
   return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2 + (a.z - b.z) ** 2);
}

function fingerCurl(mcp, pip, tip) {
   const v1 = { x: pip.x - mcp.x, y: pip.y - mcp.y, z: pip.z - mcp.z };
   const v2 = { x: tip.x - pip.x, y: tip.y - pip.y, z: tip.z - pip.z };
   const dot = v1.x * v2.x + v1.y * v2.y + v1.z * v2.z;
   const mag1 = Math.sqrt(v1.x ** 2 + v1.y ** 2 + v1.z ** 2);
   const mag2 = Math.sqrt(v2.x ** 2 + v2.y ** 2 + v2.z ** 2);
   if (mag1 === 0 || mag2 === 0) return 0;
   const cosAngle = Math.max(-1, Math.min(1, dot / (mag1 * mag2)));
   return Math.acos(cosAngle) / Math.PI;
}

function palmSize(hand) {
   return distance(hand[0], hand[9]);
}

function avg(...nums) {
   return nums.reduce((a, b) => a + b, 0) / nums.length;
}

function betweenX(x, a, b, pad = 0) {
   const left = Math.min(a, b) - pad;
   const right = Math.max(a, b) + pad;
   return x >= left && x <= right;
}

function fistMetrics(hand) {
   const indexCurl = fingerCurl(hand[5], hand[6], hand[8]);
   const middleCurl = fingerCurl(hand[9], hand[10], hand[12]);
   const ringCurl = fingerCurl(hand[13], hand[14], hand[16]);
   const pinkyCurl = fingerCurl(hand[17], hand[18], hand[20]);

   return {
      indexCurl,
      middleCurl,
      ringCurl,
      pinkyCurl,
      avgCurl: avg(indexCurl, middleCurl, ringCurl, pinkyCurl),
   };
}

function isClosedFist(hand) {
   const { indexCurl, middleCurl, ringCurl, pinkyCurl } = fistMetrics(hand);
   return (
      indexCurl > 0.52 &&
      middleCurl > 0.52 &&
      ringCurl > 0.52 &&
      pinkyCurl > 0.52
   );
}

function normX(hand, idx) {
   // Make index side always act like the "left" side
   const normal = hand[5].x < hand[17].x;
   return normal ? hand[idx].x : -hand[idx].x;
}

function betweenNormX(hand, idx, aIdx, bIdx, pad = 0) {
   const x = normX(hand, idx);
   const a = normX(hand, aIdx);
   const b = normX(hand, bIdx);

   const left = Math.min(a, b) - pad;
   const right = Math.max(a, b) + pad;

   return x >= left && x <= right;
}
function getMovementStats(points) {
   if (!points || points.length < 6) {
      return null;
   }

   const first = points[0];
   const last = points[points.length - 1];

   let minX = first.x;
   let maxX = first.x;
   let minY = first.y;
   let maxY = first.y;

   for (const p of points) {
      if (p.x < minX) minX = p.x;
      if (p.x > maxX) maxX = p.x;
      if (p.y < minY) minY = p.y;
      if (p.y > maxY) maxY = p.y;
   }

   return {
      dx: last.x - first.x,
      dy: last.y - first.y,
      width: maxX - minX,
      height: maxY - minY,
      first,
      last,
   };
}

function splitIntoThree(points) {
   const n = points.length;
   if (n < 9) return null;

   const third = Math.floor(n / 3);

   return [
      points.slice(0, third),
      points.slice(third, third * 2),
      points.slice(third * 2),
   ];
}

function segmentDelta(points) {
   if (!points || points.length < 2) return { dx: 0, dy: 0 };

   const first = points[0];
   const last = points[points.length - 1];

   return {
      dx: last.x - first.x,
      dy: last.y - first.y,
   };
}
// helper functions for letters in motion (J, Z)
function isIHandshape(hand, palm) {
   const indexCurl = fingerCurl(hand[5], hand[6], hand[8]);
   const middleCurl = fingerCurl(hand[9], hand[10], hand[12]);
   const ringCurl = fingerCurl(hand[13], hand[14], hand[16]);
   const pinkyCurl = fingerCurl(hand[17], hand[18], hand[20]);

   const onlyPinky =
      indexCurl > 0.5 && middleCurl > 0.5 && ringCurl > 0.5 && pinkyCurl < 0.3;

   const thumbTucked = distance(hand[4], hand[5]) < palm * 0.5;

   return onlyPinky && thumbTucked;
}

function isZHandshape(hand, palm) {
   const indexCurl = fingerCurl(hand[5], hand[6], hand[8]);
   const middleCurl = fingerCurl(hand[9], hand[10], hand[12]);
   const ringCurl = fingerCurl(hand[13], hand[14], hand[16]);
   const pinkyCurl = fingerCurl(hand[17], hand[18], hand[20]);

   const indexExtended = indexCurl < 0.3;
   const restCurled = middleCurl > 0.5 && ringCurl > 0.5 && pinkyCurl > 0.5;

   const pointingForwardEnough = hand[8].y < hand[6].y + palm * 0.2;

   return indexExtended && restCurled && pointingForwardEnough;
}

// A, E, M, N , S, T detectors (similar letters)
function detectA(hand, palm) {
   if (!isClosedFist(hand)) return false;

   // Thumb clearly out to the side
   const thumbSide = Math.abs(hand[4].x - hand[5].x) > palm * 0.22;

   // Thumb tip NOT crossing over the front knuckles (that's S)
   const thumbNotAcross =
      distance(hand[4], hand[7]) > palm * 0.48 &&
      distance(hand[4], hand[11]) > palm * 0.48;

   // Thumb tip roughly level with the knuckles — not hiding below like E
   const thumbLevel = hand[4].y < hand[6].y + palm * 0.08;

   return thumbSide && thumbNotAcross && thumbLevel;
}

function detectE(hand, palm) {
   if (!isClosedFist(hand)) return false;

   // Fingertips curled down toward the palm
   const allTipsDown =
      hand[8].y > hand[6].y &&
      hand[12].y > hand[10].y &&
      hand[16].y > hand[14].y &&
      hand[20].y > hand[18].y;

   // Thumb tucked in near the front of the fist
   const thumbNearIndexTip = distance(hand[4], hand[8]) < palm * 0.75;
   const thumbNearMiddleTip = distance(hand[4], hand[12]) < palm * 0.75;

   // Thumb not sticking far out like A
   const thumbNotSide = Math.abs(hand[4].x - hand[5].x) < palm * 0.3;

   return (
      allTipsDown && (thumbNearIndexTip || thumbNearMiddleTip) && thumbNotSide
   );
}

function detectS(hand, palm) {
   if (!isClosedFist(hand)) return false;

   // Thumb wraps across the front knuckles
   const thumbAcross =
      distance(hand[4], hand[7]) < palm * 0.48 ||
      distance(hand[4], hand[11]) < palm * 0.48;

   // Thumb NOT out to the side like A — same threshold as A so they're mutually exclusive
   const thumbNotSide = Math.abs(hand[4].x - hand[5].x) < palm * 0.22;

   // Thumb not poking up above the knuckle like T
   const thumbNotUp = hand[4].y > hand[6].y - palm * 0.02;

   return thumbAcross && thumbNotSide && thumbNotUp;
}
function detectT(hand, palm) {
   if (!isClosedFist(hand)) return false;

   // Thumb between index and middle
   const thumbBetweenIndexMiddle = betweenNormX(hand, 4, 5, 9, palm * 0.08);

   // Thumb visible enough to not be S
   const thumbVisible = hand[4].y < hand[8].y + palm * 0.12;

   // Not far out to the side like A
   const thumbNotSide = Math.abs(hand[4].x - hand[5].x) < palm * 0.35;

   return thumbBetweenIndexMiddle && thumbVisible && thumbNotSide;
}

function detectN(hand, palm) {
   if (!isClosedFist(hand)) return false;

   // Thumb between middle and ring
   const thumbBetweenMiddleRing = betweenNormX(hand, 4, 9, 13, palm * 0.08);

   // Visible enough to separate from S
   const thumbVisible = hand[4].y < hand[12].y + palm * 0.1;

   // Not so far over that it becomes M
   const notMZone = !betweenNormX(hand, 4, 13, 17, palm * 0.05);

   return thumbBetweenMiddleRing && thumbVisible && notMZone;
}

function detectM(hand, palm) {
   if (!isClosedFist(hand)) return false;

   // Thumb between ring and pinky
   const thumbBetweenRingPinky = betweenNormX(hand, 4, 13, 17, palm * 0.1);

   // Thumb can be a little lower than N
   const thumbVisibleEnough = hand[4].y < hand[16].y + palm * 0.18;

   return thumbBetweenRingPinky && thumbVisibleEnough;
}

// ─── Other letters ────────────────────────────────────────────────────────────

function detectB(hand, palm) {
   const indexCurl = fingerCurl(hand[5], hand[6], hand[8]);
   const middleCurl = fingerCurl(hand[9], hand[10], hand[12]);
   const ringCurl = fingerCurl(hand[13], hand[14], hand[16]);
   const pinkyCurl = fingerCurl(hand[17], hand[18], hand[20]);

   const fingersExtended =
      indexCurl < 0.25 &&
      middleCurl < 0.25 &&
      ringCurl < 0.25 &&
      pinkyCurl < 0.25;
   const thumbTucked = distance(hand[4], hand[9]) < palm * 0.6;

   return fingersExtended && thumbTucked;
}

function detectC(hand, palm) {
   const indexCurl = fingerCurl(hand[5], hand[6], hand[8]);
   const middleCurl = fingerCurl(hand[9], hand[10], hand[12]);
   const ringCurl = fingerCurl(hand[13], hand[14], hand[16]);
   const pinkyCurl = fingerCurl(hand[17], hand[18], hand[20]);

   const fingersBent =
      indexCurl > 0.2 &&
      indexCurl < 0.65 &&
      middleCurl > 0.2 &&
      middleCurl < 0.65 &&
      ringCurl > 0.2 &&
      ringCurl < 0.65 &&
      pinkyCurl > 0.2 &&
      pinkyCurl < 0.65;

   const gap = distance(hand[4], hand[8]);
   const openGap = gap > palm * 0.4 && gap < palm * 1.1;
   const verticalSpread = Math.abs(hand[4].y - hand[20].y) < palm * 0.9;

   return fingersBent && openGap && verticalSpread;
}

function detectD(hand, palm) {
   const indexCurl = fingerCurl(hand[5], hand[6], hand[8]);
   const middleCurl = fingerCurl(hand[9], hand[10], hand[12]);
   const ringCurl = fingerCurl(hand[13], hand[14], hand[16]);
   const pinkyCurl = fingerCurl(hand[17], hand[18], hand[20]);

   const indexUp = indexCurl < 0.3;
   const restCurled = middleCurl > 0.5 && ringCurl > 0.5 && pinkyCurl > 0.5;
   const thumbNearMiddle = distance(hand[4], hand[12]) < palm * 0.5;

   return indexUp && restCurled && thumbNearMiddle;
}

function detectF(hand, palm) {
   const thumbIndexTouch = distance(hand[4], hand[8]) < palm * 0.3;
   const middleCurl = fingerCurl(hand[9], hand[10], hand[12]);
   const ringCurl = fingerCurl(hand[13], hand[14], hand[16]);
   const pinkyCurl = fingerCurl(hand[17], hand[18], hand[20]);

   const restExtended = middleCurl < 0.3 && ringCurl < 0.3 && pinkyCurl < 0.3;

   return thumbIndexTouch && restExtended;
}

function detectG(hand, palm) {
   const indexCurl = fingerCurl(hand[5], hand[6], hand[8]);
   const middleCurl = fingerCurl(hand[9], hand[10], hand[12]);
   const ringCurl = fingerCurl(hand[13], hand[14], hand[16]);
   const pinkyCurl = fingerCurl(hand[17], hand[18], hand[20]);

   const indexExtended = indexCurl < 0.3;
   const restCurled = middleCurl > 0.5 && ringCurl > 0.5 && pinkyCurl > 0.5;
   const indexSideways = Math.abs(hand[8].y - hand[5].y) < palm * 0.5;
   const thumbOut = distance(hand[4], hand[5]) > palm * 0.4;

   return indexExtended && restCurled && indexSideways && thumbOut;
}

function detectH(hand, palm) {
   const indexCurl = fingerCurl(hand[5], hand[6], hand[8]);
   const middleCurl = fingerCurl(hand[9], hand[10], hand[12]);
   const ringCurl = fingerCurl(hand[13], hand[14], hand[16]);
   const pinkyCurl = fingerCurl(hand[17], hand[18], hand[20]);

   const twoExtended = indexCurl < 0.3 && middleCurl < 0.3;
   const restCurled = ringCurl > 0.5 && pinkyCurl > 0.5;
   const sideways =
      Math.abs(hand[8].y - hand[5].y) < palm * 0.5 &&
      Math.abs(hand[12].y - hand[9].y) < palm * 0.5;

   return twoExtended && restCurled && sideways;
}
function detectI(hand, palm) {
   const indexCurl = fingerCurl(hand[5], hand[6], hand[8]);
   const middleCurl = fingerCurl(hand[9], hand[10], hand[12]);
   const ringCurl = fingerCurl(hand[13], hand[14], hand[16]);
   const pinkyCurl = fingerCurl(hand[17], hand[18], hand[20]);

   const onlyPinky =
      indexCurl > 0.5 && middleCurl > 0.5 && ringCurl > 0.5 && pinkyCurl < 0.3;

   // Thumb must be clearly tucked in — NOT extended away like Y
   const thumbTucked = distance(hand[4], hand[5]) < palm * 0.5;

   return onlyPinky && thumbTucked;
}

function detectY(hand, palm) {
   const indexCurl = fingerCurl(hand[5], hand[6], hand[8]);
   const middleCurl = fingerCurl(hand[9], hand[10], hand[12]);
   const ringCurl = fingerCurl(hand[13], hand[14], hand[16]);
   const pinkyCurl = fingerCurl(hand[17], hand[18], hand[20]);

   // Index, middle, ring firmly curled
   const middleFingersCurled =
      indexCurl > 0.55 && middleCurl > 0.55 && ringCurl > 0.55;

   // Pinky clearly extended
   const pinkyOut = pinkyCurl < 0.3;

   // Thumb explicitly extended far from the fist
   const thumbOut = distance(hand[4], hand[5]) > palm * 0.65;

   // Thumb and pinky tips spread wide apart (the shaka shape)
   const shakaSpread = distance(hand[4], hand[20]) > palm * 0.9;

   return middleFingersCurled && pinkyOut && thumbOut && shakaSpread;
}

function detectK(hand, palm) {
   const indexCurl = fingerCurl(hand[5], hand[6], hand[8]);
   const middleCurl = fingerCurl(hand[9], hand[10], hand[12]);
   const ringCurl = fingerCurl(hand[13], hand[14], hand[16]);
   const pinkyCurl = fingerCurl(hand[17], hand[18], hand[20]);

   const twoExtended = indexCurl < 0.35 && middleCurl < 0.35;
   const restCurled = ringCurl > 0.5 && pinkyCurl > 0.5;

   // index and middle separated like K/V
   const spread = distance(hand[8], hand[12]) > palm * 0.38;

   // thumb should sit horizontally between index and middle bases
   const thumbBetween = betweenNormX(hand, 4, 5, 9, palm * 0.1);

   // thumb should be HIGHER than in V
   const thumbUp =
      hand[4].y < hand[10].y && hand[4].y < hand[6].y + palm * 0.18;

   // thumb should be near the split between the two fingers
   const thumbNearSplit =
      distance(hand[4], hand[6]) < palm * 0.75 ||
      distance(hand[4], hand[10]) < palm * 0.75;

   return (
      twoExtended &&
      restCurled &&
      spread &&
      thumbBetween &&
      thumbUp &&
      thumbNearSplit
   );
}

function detectL(hand, palm) {
   const indexCurl = fingerCurl(hand[5], hand[6], hand[8]);
   const middleCurl = fingerCurl(hand[9], hand[10], hand[12]);
   const ringCurl = fingerCurl(hand[13], hand[14], hand[16]);
   const pinkyCurl = fingerCurl(hand[17], hand[18], hand[20]);

   const indexUp = indexCurl < 0.3;
   const restCurled = middleCurl > 0.5 && ringCurl > 0.5 && pinkyCurl > 0.5;
   const thumbOut = distance(hand[4], hand[5]) > palm * 0.55;
   const thumbSideways =
      Math.abs(hand[4].x - hand[2].x) > Math.abs(hand[4].y - hand[2].y);

   return indexUp && restCurled && thumbOut && thumbSideways;
}

function detectO(hand, palm) {
   const gap = distance(hand[4], hand[8]);
   const fingersCurved =
      fingerCurl(hand[5], hand[6], hand[8]) > 0.3 &&
      fingerCurl(hand[9], hand[10], hand[12]) > 0.3 &&
      fingerCurl(hand[13], hand[14], hand[16]) > 0.3 &&
      fingerCurl(hand[17], hand[18], hand[20]) > 0.3;

   const oShape = gap < palm * 0.35;

   return oShape && fingersCurved;
}

function detectP(hand, palm) {
   const indexCurl = fingerCurl(hand[5], hand[6], hand[8]);
   const middleCurl = fingerCurl(hand[9], hand[10], hand[12]);
   const ringCurl = fingerCurl(hand[13], hand[14], hand[16]);
   const pinkyCurl = fingerCurl(hand[17], hand[18], hand[20]);

   const twoExtended = indexCurl < 0.3 && middleCurl < 0.3;
   const restCurled = ringCurl > 0.5 && pinkyCurl > 0.5;
   const indexDown = hand[8].y > hand[5].y + palm * 0.2;

   return twoExtended && restCurled && indexDown;
}

function detectQ(hand, palm) {
   const indexCurl = fingerCurl(hand[5], hand[6], hand[8]);
   const middleCurl = fingerCurl(hand[9], hand[10], hand[12]);
   const ringCurl = fingerCurl(hand[13], hand[14], hand[16]);
   const pinkyCurl = fingerCurl(hand[17], hand[18], hand[20]);

   const indexExtended = indexCurl < 0.3;
   const restCurled = middleCurl > 0.5 && ringCurl > 0.5 && pinkyCurl > 0.5;
   const indexDown = hand[8].y > hand[5].y + palm * 0.2;
   const thumbNearIndex = distance(hand[4], hand[8]) < palm * 0.5;

   return indexExtended && restCurled && indexDown && thumbNearIndex;
}

function detectR(hand, palm) {
   const indexCurl = fingerCurl(hand[5], hand[6], hand[8]);
   const middleCurl = fingerCurl(hand[9], hand[10], hand[12]);
   const ringCurl = fingerCurl(hand[13], hand[14], hand[16]);
   const pinkyCurl = fingerCurl(hand[17], hand[18], hand[20]);

   const twoExtended = indexCurl < 0.35 && middleCurl < 0.35;
   const restCurled = ringCurl > 0.5 && pinkyCurl > 0.5;

   // Tips are close
   const tipsClose = distance(hand[8], hand[12]) < palm * 0.32;

   // Middle/index cross over each other:
   // one finger tip should be horizontally past the other finger's base line
   const crossed =
      (hand[8].x > hand[12].x && hand[5].x < hand[9].x) ||
      (hand[8].x < hand[12].x && hand[5].x > hand[9].x);

   // Also keep them upright so random sideways shapes don't count
   const pointingUp =
      hand[8].y < hand[5].y - palm * 0.18 &&
      hand[12].y < hand[9].y - palm * 0.18;

   return twoExtended && restCurled && tipsClose && crossed && pointingUp;
}

function detectU(hand, palm) {
   const indexCurl = fingerCurl(hand[5], hand[6], hand[8]);
   const middleCurl = fingerCurl(hand[9], hand[10], hand[12]);
   const ringCurl = fingerCurl(hand[13], hand[14], hand[16]);
   const pinkyCurl = fingerCurl(hand[17], hand[18], hand[20]);

   const twoExtended = indexCurl < 0.3 && middleCurl < 0.3;
   const restCurled = ringCurl > 0.5 && pinkyCurl > 0.5;

   // Fingers close together
   const tipsClose = distance(hand[8], hand[12]) < palm * 0.4;

   // But NOT crossed
   const notCrossed =
      Math.abs(hand[8].x - hand[12].x) > palm * 0.015 ||
      Math.abs(hand[5].x - hand[9].x) < palm * 0.2;

   const pointingUp =
      hand[8].y < hand[5].y - palm * 0.18 &&
      hand[12].y < hand[9].y - palm * 0.18;

   const thumbIn = distance(hand[4], hand[9]) < palm * 0.8;

   return (
      twoExtended &&
      restCurled &&
      tipsClose &&
      notCrossed &&
      pointingUp &&
      thumbIn
   );
}

function detectV(hand, palm) {
   const indexCurl = fingerCurl(hand[5], hand[6], hand[8]);
   const middleCurl = fingerCurl(hand[9], hand[10], hand[12]);
   const ringCurl = fingerCurl(hand[13], hand[14], hand[16]);
   const pinkyCurl = fingerCurl(hand[17], hand[18], hand[20]);

   const twoExtended = indexCurl < 0.3 && middleCurl < 0.3;
   const restCurled = ringCurl > 0.5 && pinkyCurl > 0.5;
   const tipsSpread = distance(hand[8], hand[12]) > palm * 0.45;
   const pointingUp = hand[8].y < hand[5].y && hand[12].y < hand[9].y;

   // Block K:
   // thumb should NOT be high between index and middle
   const thumbBetween = betweenNormX(hand, 4, 5, 9, palm * 0.1);
   const thumbHigh =
      hand[4].y < hand[10].y && hand[4].y < hand[6].y + palm * 0.18;
   const notKThumb = !(thumbBetween && thumbHigh);

   return twoExtended && restCurled && tipsSpread && pointingUp && notKThumb;
}

function detectW(hand, palm) {
   const indexCurl = fingerCurl(hand[5], hand[6], hand[8]);
   const middleCurl = fingerCurl(hand[9], hand[10], hand[12]);
   const ringCurl = fingerCurl(hand[13], hand[14], hand[16]);
   const pinkyCurl = fingerCurl(hand[17], hand[18], hand[20]);

   const threeExtended = indexCurl < 0.3 && middleCurl < 0.3 && ringCurl < 0.3;
   const pinkyDown = pinkyCurl > 0.4;
   const spread = distance(hand[8], hand[16]) > palm * 0.7;

   return threeExtended && pinkyDown && spread;
}

function detectX(hand, palm) {
   const indexCurl = fingerCurl(hand[5], hand[6], hand[8]);
   const middleCurl = fingerCurl(hand[9], hand[10], hand[12]);
   const ringCurl = fingerCurl(hand[13], hand[14], hand[16]);
   const pinkyCurl = fingerCurl(hand[17], hand[18], hand[20]);

   const indexHooked = indexCurl > 0.3 && indexCurl < 0.65;
   const restCurled = middleCurl > 0.5 && ringCurl > 0.5 && pinkyCurl > 0.5;

   return indexHooked && restCurled;
}
// j and z
function detectJ(hand, palm, motionHistory) {
   if (!motionHistory || !motionHistory.pinky) return false;
   if (!isIHandshape(hand, palm)) return false;

   const points = motionHistory.pinky;
   const stats = getMovementStats(points);

   if (!stats) return false;

   // J should have enough motion to matter
   const enoughMotion = stats.height > palm * 0.25 && stats.width > palm * 0.12;
   if (!enoughMotion) return false;

   // J usually moves downward and then hooks sideways
   const wentDown = stats.dy > palm * 0.1;

   // Check last part hooks sideways
   const lastHalf = points.slice(Math.floor(points.length / 2));
   const hook = segmentDelta(lastHalf);

   const hookedSideways = Math.abs(hook.dx) > palm * 0.08;

   return wentDown && hookedSideways;
}

function detectZ(hand, palm, motionHistory) {
   if (!motionHistory || !motionHistory.index) return false;
   if (!isZHandshape(hand, palm)) return false;

   const points = motionHistory.index;
   const parts = splitIntoThree(points);

   if (!parts) return false;

   const [part1, part2, part3] = parts;

   const d1 = segmentDelta(part1);
   const d2 = segmentDelta(part2);
   const d3 = segmentDelta(part3);

   // Overall motion needs enough size
   const stats = getMovementStats(points);
   if (!stats) return false;

   const enoughWidth = stats.width > palm * 0.25;
   const enoughHeight = stats.height > palm * 0.12;

   if (!enoughWidth || !enoughHeight) return false;

   // Z shape:
   // 1st stroke: horizontal
   const firstHorizontal = Math.abs(d1.dx) > palm * 0.08;

   // 2nd stroke: diagonal downward
   const secondDiagonalDown =
      Math.abs(d2.dx) > palm * 0.05 && Math.abs(d2.dy) > palm * 0.05;

   // 3rd stroke: horizontal opposite-ish / continuing zigzag
   const thirdHorizontal = Math.abs(d3.dx) > palm * 0.08;

   return firstHorizontal && secondDiagonalDown && thirdHorizontal;
}
// main export

export function detectLetter(hand, motionHistory) {
   const palm = palmSize(hand);

   // Motion letters first
   if (detectJ(hand, palm, motionHistory)) return "J";
   if (detectZ(hand, palm, motionHistory)) return "Z";

   // Similar closed-fist letters first
   if (detectT(hand, palm)) return "T";
   if (detectS(hand, palm)) return "S";
   if (detectN(hand, palm)) return "N";
   if (detectM(hand, palm)) return "M";
   if (detectE(hand, palm)) return "E";
   if (detectA(hand, palm)) return "A";

   // Everything else
   if (detectB(hand, palm)) return "B";
   if (detectC(hand, palm)) return "C";
   if (detectD(hand, palm)) return "D";
   if (detectF(hand, palm)) return "F";
   if (detectG(hand, palm)) return "G";
   if (detectH(hand, palm)) return "H";
   if (detectI(hand, palm)) return "I";
   if (detectK(hand, palm)) return "K";
   if (detectL(hand, palm)) return "L";
   if (detectO(hand, palm)) return "O";
   if (detectP(hand, palm)) return "P";
   if (detectQ(hand, palm)) return "Q";
   if (detectR(hand, palm)) return "R";
   if (detectU(hand, palm)) return "U";
   if (detectV(hand, palm)) return "V";
   if (detectW(hand, palm)) return "W";
   if (detectX(hand, palm)) return "X";
   if (detectY(hand, palm)) return "Y";

   return "";
}
