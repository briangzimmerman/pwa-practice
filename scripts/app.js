(function() {
    'use strict';

    var app = {
        isLoading: true,
        selectedTags: [],
        spinner: document.querySelector('.loader'),
        noPics: document.querySelector('.no-pictures'),
        container: document.querySelector('.content'),
        db: new Dexie('tags'),
        gallerySelector: '#flickrGallery',
        about: document.querySelector('.aboutTemplate'),
        contact: document.querySelector('.contactTemplate'),
        addButtonTemplate: document.querySelector('.addTemplate'),
        addButton: document.querySelector('.addButton'),
        tagDialog: document.querySelector('.dialog-container'),
        tagText: document.querySelector('#tagToAdd')
    }

    app.showNoPictures = () => {
        let card = app.noPics.cloneNode(true);
        let addButton = app.addButtonTemplate.cloneNode(true);
        card.classList.remove('no-pictures');
        addButton.classList.remove('addTemplate');
        addButton.addEventListener('click', app.toggleTagDialog);
        card.removeAttribute('hidden');
        card.appendChild(addButton);
        app.container.innerHTML = '';
        app.container.appendChild(card);
        if(app.isLoading)
            app.setLoading(false);
    };

    app.toggleTagDialog = function() {
        if(app.tagDialog.hasAttribute('hidden')) {
            app.tagDialog.removeAttribute('hidden');
            app.tagText.focus();
        } else
            app.tagDialog.setAttribute('hidden', true);
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

    app.loadAbout = function(){
        let about = app.about.cloneNode(true);
        about.classList.remove('aboutTemplate');
        about.removeAttribute('hidden');
        app.container.innerHTML = '';
        app.container.appendChild(about);
        if(app.isLoading)
            app.setLoading(false);
    };

    app.loadContact = function() {
        let contact = app.contact.cloneNode(true);
        contact.classList.remove('contactTemplate');
        contact.removeAttribute('hidden');
        app.container.innerHTML = '';
        app.container.appendChild(contact);
        if(app.isLoading)
            app.setLoading(false);
    };

    app.updatePage = () => {
        let hash = window.location.hash;
        if(hash === '')
            app.loadFlickr();
        else {
            hash = hash.substr(1);
            if(hash == 'flickr')
                app.loadFlickr();
            else if(hash == 'about')
                app.loadAbout();
            else if(hash == 'contact')
                app.loadContact();
        }
    };

    app.db.version(1).stores({tags: 'tag'});
    app.db.open();
    app.db.tags.each(function(city) {
        app.selectedLocations.push(city.name);
    });

    window.addEventListener('hashchange', app.updatePage);
    app.tagDialog.addEventListener('click', function(e) {
        if(!document.querySelector('.dialog').contains(e.target))
            app.toggleTagDialog();
    });
    
    app.updatePage();
    
})();