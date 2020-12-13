var myShuffle = new Shuffle(document.querySelector('.my-shuffle'), {
    itemSelector: '.image-item',
    sizer: '.my-sizer-element',
    buffer: 1
});

var state = Shuffle.ALL_ITEMS;
var detached = false; // true if state is different from myShuffle.lastFilter

var displayedPages = [];
var pageIndices = {};

$(function() {
    buildShuffleList();
    readShuffleList();
    shuffleSized = !handleHashChange();
});

window.addEventListener('hashchange', handleHashChange);

function handleHashChange() {
    var filter = '';
    if (location.hash) {
        var hashParts = location.hash.split('#/');
        if (hashParts.length == 2) {
            var name = hashParts[1];
            if (name) {
                if (name == 'architecture' || name == 'illustrations') {
                    filter = name;
                } else {
                    showPage(name);
                    return true;
                }
            }
        }
    }
    changeFilter(filter);
    showPage('');
    return false;
}

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
                    <div class="image-overlay" onclick="updateHash('${page.name}')">
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

$('.nav-title').click(function() {
    var name = myShuffle.lastFilter == Shuffle.ALL_ITEMS ? '' : myShuffle.lastFilter;
    updateHash(name);
    return false;
});

function updateHash(name) {
    if (name) {
        location.hash = `#/${name}`;
    } else {
        location.hash = '#';
    }
}

function changeFilter(filter) {
    detached = false;
    state = filter ? filter : Shuffle.ALL_ITEMS;
    readShuffleList();
}

function showPage(name) {
    var showPageNav = true;
    if (name == 'about') {
        document.title = 'About';
        var innerPage = 'about.md';
        detached = true;
        state = 'about';
        showPageNav = false
        loadInnerPage(innerPage);
        setActiveLink();
    } else if (name == 'contact') {
        document.title = 'Contact';
        var innerPage = 'contact.md';
        detached = true;
        state = 'contact';
        showPageNav = false;
        loadInnerPage(innerPage);
        setActiveLink();
    } else if (name) {
        var idx = pageIndices[name];
        var page = displayedPages[idx];
        document.title = page.title;
        var innerPage = `pages/${name}.md`;
        loadInnerPage(innerPage);
        $('.my-link').removeClass('active');
    } else {
        if (detached) {
            detached = false;
            state = myShuffle.lastFilter;
        }
        document.title = 'Jenny Chen';
        $('.detail-container').hide();
        $('.my-shuffle').show();
        $('.md-container').html('');
        myShuffle.filter(state);
        setActiveLink();
        return;
    }

    if (!showPageNav) {
        $('.page-nav').hide();
    } else {
        $('.page-nav').show();
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
        return state == Shuffle.ALL_ITEMS || page.group == state;
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
        $('#prev-page').html(`&#8592; ${prevPage.title}`);
        $('#prev-page').attr('href', `#/${prevPage.name}`);
        $('#prev-page').css('visibility', 'visible');
    } else {
        $('#prev-page').css('visibility', 'hidden');
    }

    if (idx < n - 1) {
        var nextPage = displayedPages[idx + 1];
        $('#next-page').html(`${nextPage.title} &#8594;`);
        $('#next-page').attr('href', `#/${nextPage.name}`);
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
