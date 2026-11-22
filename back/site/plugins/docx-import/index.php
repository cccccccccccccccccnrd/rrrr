<?php

Kirby::plugin('rrrr/docx-import', [
  'sections' => [
    'docximport' => [
      'toArray' => fn () => [
        // vendored mammoth 1.11.0, served from ./assets (url is content-hashed by Kirby)
        'mammoth' => kirby()->plugin('rrrr/docx-import')->asset('mammoth.browser.min.js')->url(),
        'template' => kirby()->plugin('rrrr/docx-import')->asset('rrrreflect-article-template.docx')->url()
      ]
    ]
  ]
]);
