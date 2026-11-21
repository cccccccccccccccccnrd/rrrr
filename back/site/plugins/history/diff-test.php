<?php
// php site/plugins/history/diff-test.php
require __DIR__ . '/diff.php';

assert(historyDiff("a\nb\nc", "a\nb\nc") === []);
assert(historyDiff("a\nb\nc", "a\nX\nc") === ['  a', '- b', '+ X']);
assert(historyDiff("a\nb\nc\nd\ne", "a\nB\nc\nd\nE") === ['  a', '- b', '+ B', '  d', '- e', '+ E']);
assert(historyDiff("", "new") === ['+ new']);
assert(historyText('[{"type":"text","content":{"text":"<p>Hi</p><p>there</p>"}}]') === '[text] Hi there');
assert(historyText('plain, not json') === 'plain, not json');
echo "ok\n";
