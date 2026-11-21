<?php

use Kirby\Cms\Page;
use Kirby\Filesystem\F;

require __DIR__ . '/diff.php';

// One JSON line per save: who, when, and a line diff per changed field.
// Keyed by uuid so it survives slug changes; lives outside content/ so Kirby doesn't list it as a file.
function historyFile(Page $page): string
{
  return kirby()->root('logs') . '/history/' . $page->uuid()->id() . '.jsonl';
}

Kirby::plugin('rrrr/history', [
  'hooks' => [
    'page.update:after' => function (Page $newPage, Page $oldPage) {
      $old = $oldPage->content()->toArray();
      $new = $newPage->content()->toArray();
      $changes = [];
      foreach (array_unique([...array_keys($old), ...array_keys($new)]) as $key) {
        $before = (string)($old[$key] ?? '');
        $after = (string)($new[$key] ?? '');
        if ($key === 'uuid' || $before === $after) continue;
        $changes[$key] = historyDiff(historyText($before), historyText($after));
      }
      if (!$changes) return;

      // the Nuxt PDF editor saves with its service account and names the real person in X-Editor
      $by = kirby()->request()->header('X-Editor') ?: kirby()->user()?->email() ?? 'unknown';
      F::append(historyFile($newPage), json_encode(['time' => date('c'), 'by' => $by, 'changes' => $changes], JSON_UNESCAPED_UNICODE | JSON_INVALID_UTF8_SUBSTITUTE | JSON_PARTIAL_OUTPUT_ON_ERROR) . "\n");
    }
  ],
  'sections' => [
    'history' => [
      'toArray' => function () {
        $file = historyFile($this->model());
        $lines = F::exists($file) ? array_filter(explode("\n", F::read($file))) : [];
        return ['entries' => array_map('json_decode', array_reverse(array_slice($lines, -50)))];
      }
    ]
  ]
]);
