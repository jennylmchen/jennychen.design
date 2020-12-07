var myShuffle = new Shuffle(document.querySelector('.my-shuffle'), {
	itemSelector: '.image-item',
	sizer: '.my-sizer-element',
	buffer: 1
});

var state = Shuffle.ALL_ITEMS;
var detached = false; // true if state is different from myShuffle.lastFilter

var displayedPosts = [];
var postIndices = {};

$(document).ready(function() {
	readShuffleList();
});

$('#filter-all').click(function() {
	detached = false;
	state = Shuffle.ALL_ITEMS;
	page('');
	myShuffle.filter(Shuffle.ALL_ITEMS);
	readShuffleList();
});

$('#filter-architecture').click(function() {
	detached = false;
	state = 'architecture';
	page('');
	myShuffle.filter('architecture');
	readShuffleList();
});

$('#filter-illustrations').click(function() {
	detached = false;
	state = 'illustrations';
	page('');
	myShuffle.filter('illustrations');
	readShuffleList();
});

function page(name, showPageNav=true) {
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
		$('.md-container').html('');
		setActiveLink();
		return;
	}

	if (!showPageNav) {
		$('.post-nav-container').hide();
	} else {
		$('.post-nav-container').show();
		setPostNav(name);
	}
}

function loadInnerPage(innerPage) {
	$('.md-container').html(
		'<zero-md src="' + innerPage + '"></zero-md>'
	);
	$('.detail-container').show();
	$('.my-shuffle').hide();
}

function readShuffleList() {
	var allPosts = $.map($('.my-shuffle').children('figure'), function(figure) {
		group = $(figure).attr('data-groups').split('"')[1];
		name = $(figure).find('.image-overlay').attr('onclick').split("('")[1].split("')")[0];
		return {
			name: name,
			group: group
		};
	});

	displayedPosts = allPosts.filter(function(post) {
		return myShuffle.lastFilter == Shuffle.ALL_ITEMS || post.group == myShuffle.lastFilter;
	}).map(function(post) {
		return post.name;
	});

	postIndices = {};
	displayedPosts.forEach(function(name, idx) {
		postIndices[name] = idx;
	});
}

function setPostNav(name) {
	var idx = postIndices[name];
	var n = displayedPosts.length;

	if (idx > 0) {
		var prevPost = displayedPosts[idx - 1];
		$('#prev-post').attr('onclick', 'page("' + prevPost + '")');
		$('#prev-post').css('visibility', 'visible');
	} else {
		$('#prev-post').css('visibility', 'hidden');
	}

	if (idx < n - 1) {
		var nextPost = displayedPosts[idx + 1];
		$('#next-post').attr('onclick', 'page("' + nextPost + '")');
		$('#next-post').css('visibility', 'visible');
	} else {
		$('#next-post').css('visibility', 'hidden');
	}
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
