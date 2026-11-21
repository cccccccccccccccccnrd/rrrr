<?php

// Line diff: returns "- old", "+ new" lines plus one "  context" line before each change.
// ponytail: O(n·m) LCS, fine after trimming the unchanged head/tail; swap for a real diff lib if pages get huge
function historyDiff(string $before, string $after): array
{
  $a = $before === '' ? [] : explode("\n", $before);
  $b = $after === '' ? [] : explode("\n", $after);

  $head = 0;
  while ($head < count($a) && $head < count($b) && $a[$head] === $b[$head]) $head++;
  $tail = 0;
  while ($tail < count($a) - $head && $tail < count($b) - $head && $a[count($a) - 1 - $tail] === $b[count($b) - 1 - $tail]) $tail++;

  $context = $head > 0 ? $a[$head - 1] : null;
  $a = array_slice($a, $head, count($a) - $head - $tail);
  $b = array_slice($b, $head, count($b) - $head - $tail);
  $n = count($a);
  $m = count($b);

  $lcs = array_fill(0, $n + 1, array_fill(0, $m + 1, 0));
  for ($i = $n - 1; $i >= 0; $i--) {
    for ($j = $m - 1; $j >= 0; $j--) {
      $lcs[$i][$j] = $a[$i] === $b[$j] ? $lcs[$i + 1][$j + 1] + 1 : max($lcs[$i + 1][$j], $lcs[$i][$j + 1]);
    }
  }

  $out = [];
  $i = $j = 0;
  $inChange = false;
  while ($i < $n || $j < $m) {
    if ($i < $n && $j < $m && $a[$i] === $b[$j]) {
      $context = $a[$i];
      $inChange = false;
      $i++;
      $j++;
      continue;
    }
    if (!$inChange && $context !== null && trim($context) !== '') $out[] = '  ' . $context;
    $inChange = true;
    if ($i < $n && ($j === $m || $lcs[$i + 1][$j] >= $lcs[$i][$j + 1])) {
      $out[] = '- ' . $a[$i++];
    } else {
      $out[] = '+ ' . $b[$j++];
    }
  }
  return $out;
}

// Blocks fields are JSON; one readable line per block makes their diffs legible
function historyText(string $value): string
{
  $blocks = json_decode($value, true);
  if (!is_array($blocks) || !array_is_list($blocks)) return $value;
  return implode("\n", array_map(function ($block) {
    if (!is_array($block) || !isset($block['type'], $block['content'])) return json_encode($block, JSON_UNESCAPED_UNICODE);
    $text = array_filter(array_map(
      fn ($v) => is_string($v) ? trim(preg_replace('/\s+/', ' ', strip_tags(str_replace('</p>', '</p> ', $v)))) : null,
      $block['content']
    ));
    return "[{$block['type']}] " . implode(' · ', $text);
  }, $blocks));
}
