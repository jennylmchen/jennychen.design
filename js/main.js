var myShuffle = new Shuffle(document.querySelector('.my-shuffle'), {
    itemSelector: '.image-item',
    sizer: '.my-sizer-element',
    buffer: 1
});

var state = Shuffle.ALL_ITEMS;
var detached = false; // true if state is different from myShuffle.lastFilter

var displayedPages = [];
var pageIndices = {};

$(document).ready(function() {
    buildShuffleList();
    readShuffleList();
});

function buildShuffleList() {
    var figures = [];
    var shuffleList = $('.my-shuffle')[0];
    var sizer = $('.my-sizer-element')[0];

    PAGES.forEach(function(page, idx) {
        var figure = document.createElement('figure');
        figure.classList.add('image-item', 'col-md-4');
        figure.setAttribute('data-groups', `["${page.group}"]`);
        figure.innerHTML = `
            <div class="aspect">
                <div class="aspect__inner">
                    <img class="my-image" src="images/${page.name}/${page.image}"/>
                    <div class="image-overlay" onclick="page('${page.name}')">
                        <p>${page.description}</p>
                    </div>
                </div>
            </div>
        `;
        shuffleList.insertBefore(figure, sizer);
        figures.push(figure);
    });

    myShuffle.add(figures);
}

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
        innerPage = `pages/${name}.md`;
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
        $('.page-nav-container').hide();
    } else {
        $('.page-nav-container').show();
        setPageNav(name);
    }
}

function loadInnerPage(innerPage) {
    $('.md-container').html(
        `<zero-md src="${innerPage}"></zero-md>`
    );
    $('.detail-container').show();
    $('.my-shuffle').hide();
}

function readShuffleList() {
    displayedPages = PAGES.filter(function(page) {
        return myShuffle.lastFilter == Shuffle.ALL_ITEMS || page.group == myShuffle.lastFilter;
    });

    pageIndices = {};
    displayedPages.forEach(function(page, idx) {
        pageIndices[page.name] = idx;
    });
}

function setPageNav(name) {
    var idx = pageIndices[name];
    var n = displayedPages.length;

    if (idx > 0) {
        var prevPage = displayedPages[idx - 1];
        $('#prev-page').html(`<- ${prevPage.title}`);
        $('#prev-page').attr('onclick', `page("${prevPage.name}")`);
        $('#prev-page').css('visibility', 'visible');
    } else {
        $('#prev-page').css('visibility', 'hidden');
    }

    if (idx < n - 1) {
        var nextPage = displayedPages[idx + 1];
        $('#next-page').html(`${nextPage.title} ->`);
        $('#next-page').attr('onclick', `page("${nextPage.name}")`);
        $('#next-page').css('visibility', 'visible');
    } else {
        $('#next-page').css('visibility', 'hidden');
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
