'use strict'

let $searchform = $('#search-form');
let $clipList = $('#clip-list');
let $currentClip = $('#current-clip');
let $clipDescription = $('.clip-description');
let $inner = $('.carousel-inner');
let arrClips = [];

$searchform.on("submit", function(event){
    event.preventDefault();
    let query = $(this).find('[name="scrh-term"]').val().replace(/\s/g, "+");

    getClips(query);
});

function getClips (query) {
    let server = "https://itunes.apple.com/search";

    $.ajax({
        url: server,
        method: "GET",
        data: `term=${query}&entity=musicVideo&limit=10`
    }).done(function(response) {
        let k = JSON.parse(response);
        arrClips = k.results;
        console.log(arrClips);
        $clipList.empty();
        console.log($clipList);

        arrClips.forEach(function (clip) {
            $('<a href="">').addClass('list-group-item')
                .text(clip.artistName + ' - ' + clip.trackCensoredName)
                .attr('data-id', clip.trackId)
                .appendTo($clipList);
        })

    }).fail(function (error) {
        console.log(error);
    })
}

$clipList.on('click', '[data-id]', function(event) {
    event.preventDefault();
    
    let clipId = $(this).data('id');
    let clip = arrClips.find(function(item) {
        return item.trackId === clipId;
    });

    $currentClip.fadeIn();

    $currentClip.find('.clip-title').text(`${clip.artistName} - ${clip.trackCensoredName}`);
        
    $inner.empty();

    // Add new info

    for(let i = 0; i < arrClips.length; i++) {
        let carouselItem = $('<div>').attr('data-interval', 30000).attr('data-trackid', arrClips[i].trackId).addClass('carousel-item').appendTo($inner);

        $('<video>').attr({
            src : `${arrClips[i].previewUrl}`,
            height : "300",
            width : "470",
            controls : ''
        }).appendTo(carouselItem);
    }

    let carouselItemSearch = document.getElementsByClassName('carousel-item');
    
    for (let k = 0; k < carouselItemSearch.length; k++) {
        if(+carouselItemSearch[k].attributes[1].value == clip.trackId) {
            carouselItemSearch[k].className = 'carousel-item active';
        };
    }
});

const $carouselNext = $('.carousel-control-next');
const $carouselPrev = $('.carousel-control-prev');

function presentVideo(side) {
    $('video').trigger('pause');

    let $active = $('.active');

    for(let j = 0; j < arrClips.length; j++) {
        let track = side ? arrClips[j+1] : arrClips[j-1];
            if(+$active[0].attributes[1].value == arrClips[j].trackId) {
                $currentClip.find('.clip-title').text(`${track.artistName} -  ${track.trackCensoredName}`);
            }
        }

}

$carouselNext.on('click', function(e){
    return presentVideo(true);
}); 

$carouselPrev.on('click', function(e){
    return presentVideo(false);
}); 