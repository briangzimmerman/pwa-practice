(function() {
    'use strict';

    var app = {
        isLoading: true,
        selectedTags: [],
        spinner: document.querySelector('.loader'),
        noPics: document.querySelector('.no-pictures'),
        container: document.querySelector('.content'),
        db: new Dexie('tags'),
        gallerySelector: '#flickrGallery'
    }

    app.showNoPictures = () => {
        let card = app.noPics.cloneNode(true);
        card.removeAttribute('hidden');
        app.container.innerHTML = '';
        app.container.appendChild(card);
        if(app.isLoading)
            app.setLoading(false);
    };

    app.loadFlickr = function() {
        if(app.selectedTags.length == 0)
            app.showNoPictures();
        else
            app.getPicsByTags('"' + app.selectedTags.join('", ') + '"');
    };

    app.setLoading = function(on) {
        if(on){
            app.container.innerHTML = '';
            app.spinner.setAttribute('hidden', false);
            app.isLoading = true;
        } else {
            app.spinner.setAttribute('hidden', true);
            app.isLoading = false;
        }
    };

    app.createCard = function(item){
        let card = document.querySelector('.imageTemplate');
        card.classList.remove('imageTemplate');
        card.setAttribute('href', item.link);
        card.querySelector('.image').setAttribute('alt', item.title);
        card.querySelector('.image').setAttribute('src', item.media.m);
        card.removeAttribute('hidden');
        app.container.appendChild(card);
    }

    app.getPicsByTags = function(tags) {
        app.setLoading(true);
        let url = 'https://api.flickr.com/services/feeds/photos_public.gne';
        let options = {
            data: {'tags': tags, 'format': 'json'},
            dataType: 'jsonp',
            jsonpCallback: 'jsonFlickrFeed',
            url: url,
            success: function(response){
                response.items.map(function(item, idx) {
                    app.createCard(item);
                });
                app.setLoading(false);
                $(app.gallerySelector).justifiedGallery();
            }
        };

        $.ajax(options);
    };

    app.updatePage = () => {
        let hash = window.location.hash;
        if(hash === '')
            app.loadFlickr();
        else {
            hash = hash.substr(1);
            if(hash == 'flickr')
                app.loadFlickr();
            else if(hash == 'about');
                //TODO
            else if(hash == 'contact');
                //TODO
        }
    };

    app.db.version(1).stores({tags: 'tag'});
    app.db.open();
    app.db.tags.each(function(city) {
        app.selectedLocations.push(city.name);
    });

    window.addEventListener('hashchange', app.updatePage());

    app.updatePage();

})();