let col1H = 0;
let col2H = 0;
ii = 0;
let kepernyo = (window.innerWidth / 2) - 14;
var lehet = 1;
var leen = 0;

let nsfw;

var links = [];
var height = [];
var width = [];

//leszedi az adatokat, link, height, width
function kereses() {

    if(document.getElementById('nsfw').checked){
        nsfw = 1;
    }
    else {
        nsfw = 0;
    }

    console.log(nsfw);

    document.getElementById('column1').remove();
    document.getElementById('column2').remove();
    let row = document.getElementById('row');

    let column1 = document.createElement('div');
    column1.setAttribute('id', 'column1');
    column1.setAttribute('class', 'columnx');

    let column2  = document.createElement('div');
    column2.setAttribute('id', 'column2');
    column2.setAttribute('class', 'columnx');

    row.appendChild(column1);
    row.appendChild(column2);

    leen = 0;
    ii = 0;
    links = [];
    height = [];
    width = [];

    document.getElementById('waittext').removeAttribute('hidden');


    linkekLekerese();
    setTimeout(() => {
        elsoLefutas();
    }, 2500);

}

//delaying
function sleep(ms) {
  return new Promise(
    resolve => setTimeout(resolve, ms)
  );
}

async function delay(){
  lehet = 0;
  await sleep(100);
  sok();
  await sleep(100);
  lehet = 1;
}

function sok() {
    for (let fg = 0; fg < 4; fg++) {
      generate();
    }
}

function generate() {
    if (ii == 0) {
        executeAsynchronously([duplikaltakTorlese(), kepekRandomizalasa(), kepBeszurasa()], 10);
    }
    else {
        kepBeszurasa();
    }
}

// folyamatosan adja a kepeket ahogy a felhasznalo gorget lefele
window.addEventListener("scroll", function(){
   if($(window).scrollTop() >= $(document).height() - $(window).height() - 150){
     if(lehet == 1){
      delay();
     }
   }
}, false);

function kepBeszurasa(){
    let url = links[ii];
    
    if (url != undefined) {
        var image = new Image();
        image.src = url;
        image.style = "width: 100%;";

        if (col1H >= col2H) {
            document.getElementById('column2').appendChild(image);
            col2H += height[ii] * (kepernyo / width[ii]);

        } else {
            document.getElementById('column1').appendChild(image);
            col1H += height[ii] * (kepernyo / width[ii]);
        }
    }
    ii++;
}

function kepekRandomizalasa(){
    var hx = 0,
        len = links.length,
        next, order = [];
    while (hx < len) order[hx] = ++hx; //[1,2,3...]
    order.sort(function() {
        return Math.random() - .5
    });

    for (hx = 0; hx < len; hx++) {
        next = order[hx];
        links.push(links[next]);
        height.push(height[next]);
        width.push(width[next]);
    }
    links.splice(1, len);
    height.splice(1, len);
    width.splice(1, len);
}

function duplikaltakTorlese(){
    document.getElementById('waittext').setAttribute('hidden', '');
    for (let mn = 0; mn < leen; mn++) {
        if (height[mn] == height[mn+1] && width[mn] == width[mn+1]) {
                height.splice(mn, 1);
                width.splice(mn, 1);
                links.splice(mn, 1);
        }
    }
}

function executeAsynchronously(functions, timeout) {
    for(var i = 0; i < functions.length; i++) {
      setTimeout(functions[i], timeout);
    }
}

function linkekLekerese(){
    let kereses = document.getElementById('input').value;
    for (let i = 1; i < 11; i++) {
        mainurl = "https://danbooru.donmai.us/posts.json?api_key=vqPYSST4GR1QtKwQdheqiuo8&login=Semnot&limit=200&json=1&tags=" + kereses + "&page=" + i + "";   
        fetch(mainurl)
            .then(response => response.json())
            .then(data => {
                for (let index = 0; index < data.length; index++) {
                    if(nsfw == 1){
                        if(data[index]['rating'] != "s"){
                            if (links.includes(data[index]['file_url']) == false && data[index]['up_score'] >= 15 && data[index]['file_url'] != "undefined" && data[index]['file_size'] < 2000000 && String(data[index]['file_url']).search(".jpg") >= 0 || String(data[index]['file_url']).search(".png") >= 0) {
                                links.push(data[index]['file_url']);
                                height.push(data[index]['image_height']);
                                width.push(data[index]['image_width']);
                                leen++;
                            }
                        }
                    } else{
                        if(data[index]['rating'] == "s"){
                            if (links.includes(data[index]['file_url']) == false && data[index]['up_score'] >= 15 && data[index]['file_url'] != "undefined" && data[index]['file_size'] < 2000000 && String(data[index]['file_url']).search(".jpg") >= 0 || String(data[index]['file_url']).search(".png") >= 0) {
                                links.push(data[index]['file_url']);
                                height.push(data[index]['image_height']);
                                width.push(data[index]['image_width']);
                                leen++;
                            }
                        }
                    }

                    console.log(nsfw);
                }
        })
    }
}

function elsoLefutas(){
        for (let j = 0; j < 4; j++) {
            delay(); 
        }
}

$.ajax({
    url: "tags.txt",
    dataType: "text",
    success: function(data) {
        var autoCompleteData = data.split('\n');
        $("#input").autocomplete({
            source: function(request, response) {
                var results = $.ui.autocomplete.filter(autoCompleteData, request.term);
                response(results.slice(0, 5)); // Display the first 10 results
            }
        });
    }
});