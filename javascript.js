let col1H = 0;
let col2H = 0;
let i = 0;
let kepernyo = (window.innerWidth / 2) - 14;
var lehet = 1;

var links = [];
var height = [];
var width = [];
var rating = [];

if (localStorage.getItem("kereses") != null && localStorage.getItem("kereses") != "") {
    kereses();
    document.getElementById('tag').value = localStorage.getItem("kereses");
}

if(localStorage.getItem("sort") != null){
    document.getElementById('sorttext').textContent = localStorage.getItem("sort");
    if (localStorage.getItem("sort") == 'top'){
        document.getElementById('sorttext').textContent = 'Top';
    }
    else if (localStorage.getItem("sort") == 'hot'){
        document.getElementById('sorttext').textContent = 'Hot';
    }
    else{
        document.getElementById('sorttext').textContent = 'Rnd';
    }
}

//leszedi az adatokat, link, height, width
function kereses() {
    if (links.length > 0) {
        location.reload(true);
    }

    if (document.getElementById('tag').value != null && document.getElementById('tag').value != "" && document.getElementById('tag').value != undefined) {
        localStorage.setItem("kereses", $('#tag').val());
    }

    var keres = localStorage.getItem("kereses");

    for (let i = 1; i < 11; i++) {
        if(localStorage.getItem("sort") == "hot" || localStorage.getItem('sort') == null || localStorage.getItem('sort') == undefined){
            mainurl = "https://danbooru.donmai.us/posts.json?api_key=vqPYSST4GR1QtKwQdheqiuo8&login=Semnot&limit=200&json=1&tags=" + keres + "&page=" + i + "";   
        }
        else if (localStorage.getItem("sort") == "top"){
            mainurl = "https://danbooru.donmai.us/posts.json?api_key=vqPYSST4GR1QtKwQdheqiuo8&login=Semnot&limit=200&json=1&tags=" + keres + "%20order:upvotes&page=" + i + ""; 
        } else{
            mainurl = "https://danbooru.donmai.us/posts.json?api_key=vqPYSST4GR1QtKwQdheqiuo8&login=Semnot&limit=200&json=1&tags=" + keres + "&page=" + i + ""; 
        }

        fetch(mainurl)
            .then(response => response.json())
            .then(data => {
                for (let index = 0; index < data.length; index++) {
                    if(data[index]['rating'] == "s"){
                        if (links.includes(data[index]['file_url']) == false && data[index]['up_score'] >= 15 && data[index]['file_url'] != "undefined" && data[index]['file_size'] < 2000000 && String(data[index]['file_url']).search(".jpg") >= 0 || String(data[index]['file_url']).search(".png") >= 0) {
                            links.push(data[index]['file_url'])
                            height.push(data[index]['image_height'])
                            width.push(data[index]['image_width'])
                        }
                    }
                }
        })
    }

    setTimeout(() => {
        for (let j = 0; j < 4; j++) {
            delay(); 
        }
    }, 3000);
    document.getElementById('waittext').removeAttribute('hidden');
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
    if (i == 0) {
        var leen = links.length;

        //kitorli az egymas utani ugyanolyan nagysagu kepeket
        for (let mn = 0; mn < leen; mn++) {
            if (height[mn] == height[mn+1] && width[mn] == width[mn+1]) {
                    height.splice(mn, 1);
                    width.splice(mn, 1);
                    links.splice(mn, 1);
                }
        }
        
        //randomizalja a kepeket
        if(localStorage.getItem("sort") != "top"){
            setTimeout(() =>{
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
              }, 500);
        }

        setTimeout(() => {
          let url = links[i];
          if (url != undefined) {
              var image = new Image();
              image.src = url;
              image.style = "width: 100%;";

              if (col1H >= col2H) {
                  document.getElementById('column2').appendChild(image);
                  col2H += height[i] * (kepernyo / width[i]);

              } else {
                  document.getElementById('column1').appendChild(image);
                  col1H += height[i] * (kepernyo / width[i]);
              }
          }
          i++;
          document.getElementById('resulttext').removeAttribute('hidden');
          document.getElementById('resulttext').textContent = 'Results: ' + links.length;
          document.getElementById('waittext').setAttribute('hidden', '');
        }, 2000);
    }
    else {
      let url = links[i];
    
      if (url != undefined) {
          var image = new Image();
          image.src = url;
          image.style = "width: 100%;";

          if (col1H >= col2H) {
              document.getElementById('column2').appendChild(image);
              col2H += height[i] * (kepernyo / width[i]);

          } else {
              document.getElementById('column1').appendChild(image);
              col1H += height[i] * (kepernyo / width[i]);
          }
      }
      i++;
    }
}

//folyamatosan adja a kepeket ahogy a felhasznalo gorget lefele
window.addEventListener("scroll", function(){ // or window.addEventListener("scroll"....
   if($(window).scrollTop() >= $(document).height() - $(window).height() - 150){
     if(lehet == 1){
      delay();
     }
   }
}, false);

document.getElementById('dropdown').addEventListener("click", dropsort);

function dropsort(){
    let drop = document.getElementById('dropdown');
    if(drop.classList.contains('is-active')){
        drop.classList.remove('is-active');
    } else {
        drop.classList.add('is-active');
    }
}

document.getElementById('top').addEventListener("click", dropsortTop);
document.getElementById('hot').addEventListener("click", dropsortHot);
document.getElementById('random').addEventListener("click", dropsortRandom);

function dropsortTop(){
    //let topx = document.getElementById('top');
    document.getElementById('sorttext').textContent = 'Top';
    localStorage.setItem("sort", 'top');
}

function dropsortHot(){
    //let hotx = document.getElementById('hot');
    document.getElementById('sorttext').textContent = 'Hot';
    localStorage.setItem("sort", 'hot');
}

function dropsortRandom(){
    //let randomx = document.getElementById('random');
    document.getElementById('sorttext').textContent = 'Rnd';
    localStorage.setItem("sort", 'random');
}