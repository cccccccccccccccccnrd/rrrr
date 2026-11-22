<?php

// Single sign-on into the Nuxt PDF editor. The Panel session cookie only exists on the Kirby domain,
// so the Panel links here: we know the logged-in user, hand Nuxt a random one-time token (60 s) and
// Nuxt redeems it through the API with its service account.
Kirby::plugin('rrrr/pdf-editor', [
  'options' => [
    'cache' => true
  ],
  'routes' => [
    [
      'pattern' => 'pdf-editor/(:any)',
      'action' => function (string $slug) {
        $kirby = kirby();
        if (!$user = $kirby->user()) {
          go($kirby->url('panel') . '/login');
        }
        $token = bin2hex(random_bytes(16));
        $kirby->cache('rrrr.pdf-editor')->set($token, $user->email(), 1);
        go(option('frontUrl', 'https://rrrreflect.org') . '/api/admin/auth/sso?' . http_build_query([
          'token' => $token,
          'to' => '/pdf/' . $slug
        ]));
      }
    ]
  ],
  'api' => [
    'routes' => [
      [
        'pattern' => 'pdf-editor/sso/(:alphanum)',
        'action' => function (string $token) {
          $cache = kirby()->cache('rrrr.pdf-editor');
          $email = $cache->get($token);
          $cache->remove($token);
          return $email ? ['status' => 'ok', 'email' => $email] : ['status' => 'error'];
        }
      ]
    ]
  ]
]);
