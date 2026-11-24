<?php

// Panel sidebar link to the articles, and a dashboard with one article section per category
// (newest first, drafts included), so a new volume shows up without editing a blueprint.

$path = fn () => kirby()->request()->path()->toString();
$inArticles = fn () => str_starts_with($path(), 'panel/pages/articles');

Kirby::plugin('rrrr/panel', [
	'areas' => [
		'articles' => fn () => [
			'label'   => 'Articles',
			'icon'    => 'book',
			'menu'    => true,
			'link'    => 'pages/articles',
			'current' => $inArticles,
		],
		// only one menu entry highlighted: the article pages belong to the site area too
		'site' => fn () => [
			'current' => fn () => preg_match('#^panel/(site|pages)#', $path()) && !$inArticles(),
		],
	],
	'blueprints' => [
		'site' => function () {
			$volumes = [];
			foreach (page('categories')?->childrenAndDrafts()->flip() ?? [] as $category) {
				$volumes['category-' . $category->slug()] = [
					'extends' => 'sections/articles',
					'label'   => $category->title()->value() . ($category->isDraft() ? ' (draft)' : ''),
					'query'   => 'site.find("articles").childrenAndDrafts.filterBy("category", "' . $category->id() . '")',
					'sortBy'  => 'published desc',
				];
			}

			return [
				'columns' => [
					['width' => '2/2', 'sections' => ['import' => ['type' => 'docximport']] + $volumes],
					['width' => '1/2', 'sections' => ['categories' => 'sections/categories']],
					['width' => '1/2', 'sections' => ['pages' => [
						'type'      => 'pages',
						'create'    => 'default',
						'templates' => ['about', 'home', 'default'],
					]]],
				],
			];
		},
	],
]);
