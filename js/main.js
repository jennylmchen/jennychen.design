var myShuffle = new Shuffle(document.querySelector('.my-shuffle'), {
	itemSelector: '.image-item',
	sizer: '.my-sizer-element',
	buffer: 1
});

var state = Shuffle.ALL_ITEMS;
var detached = false; // true if state is different from myShuffle.lastFilter

$('#filter-all').click(function() {
	detached = false;
	state = Shuffle.ALL_ITEMS;
	page('');
	myShuffle.filter(Shuffle.ALL_ITEMS);
});

$('#filter-architecture').click(function() {
	detached = false;
	state = 'architecture';
	page('');
	myShuffle.filter('architecture');
});

$('#filter-illustrations').click(function() {
	detached = false;
	state = 'illustrations';
	page('');
	myShuffle.filter('illustrations');
});

function page(name) {
	var innerPage = ''
	if (name == 'about') {
		innerPage = 'about.md';
		detached = true;
		state = 'about';
		loadInnerPage(innerPage);
		setActiveLink();
	} else if (name == 'contact') {
		innerPage = 'contact.md';
		detached = true;
		state = 'contact';
		loadInnerPage(innerPage);
		setActiveLink();
	} else if (name) {
		innerPage = 'pages/' + name + '.md';
		loadInnerPage(innerPage);
		$('.my-link').removeClass('active');
	} else {
		if (detached) {
			detached = false;
			state = myShuffle.lastFilter;
		}
		$('.detail-container').hide();
		$('.my-shuffle').show();
		$('.detail-container').html('');
		setActiveLink();
	}
}

function loadInnerPage(innerPage) {
	$('.detail-container').show();
	$('.my-shuffle').hide();
	$('.detail-container').html(
		'<zero-md src="' + innerPage + '"></zero-md>'
	);
}

function setActiveLink() {
	$('.my-link').removeClass('active');
	switch(state) {
		case Shuffle.ALL_ITEMS:
			$('#filter-all').addClass('active');
			break;
		case 'architecture':
			$('#filter-architecture').addClass('active');
			break;
		case 'illustrations':
			$('#filter-illustrations').addClass('active');
			break;
		case 'about':
			$('#about-page').addClass('active');
			break;
		case 'contact':
			$('#contact-page').addClass('active');
			break;
	}
}
