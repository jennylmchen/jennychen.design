var myShuffle = new Shuffle(document.querySelector('.my-shuffle'), {
	itemSelector: '.image-item',
	sizer: '.my-sizer-element',
	buffer: 1
});

$('#filter-all').click(function() {
	myShuffle.filter(Shuffle.ALL_ITEMS);
	$('#filter-all').addClass('active');
	$('#filter-architecture').removeClass('active');
	$('#filter-illustrations').removeClass('active');
});

$('#filter-architecture').click(function() {
	myShuffle.filter('architecture');
	$('#filter-all').removeClass('active');
	$('#filter-architecture').addClass('active');
	$('#filter-illustrations').removeClass('active');
});

$('#filter-illustrations').click(function() {
	myShuffle.filter('illustrations');
	$('#filter-all').removeClass('active');
	$('#filter-architecture').removeClass('active');
	$('#filter-illustrations').addClass('active');
});

function projects(name) {
	newUrl = 'projects/' + name + '/';
	if (window.location.protocol == 'file:') {
		newUrl += 'index.html';
	}
	location.href = newUrl;
}
