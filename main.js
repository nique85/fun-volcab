console.log('LINKED')
 //$(document).ready(function() {}


 // When search button is clicked
 let searchBtn = document.getElementById('search-button')
 let inputField = document.getElementById('input-box')
 
 
 searchBtn.onclick = ()=>{
    let word = inputField.value

     if (word != "" ){   
         checkDictionary(word)
         document.getElementById("input-box").value = "" 
     }else{
         alert('Please enter a word.')
     }
 }

 //  When user press enter key on keyboard
inputField.addEventListener('keypress', (event)=>{
    

    let word = inputField.value

    if (event.keyCode == 13){
        event.preventDefault()
        if (word != "" ){   
            checkDictionary(word)
            document.getElementById("input-box").value = "" 
        }
    }
})
  


function checkDictionary(word){

    var linguaApi = {
        "async": true,
        "crossDomain": true,
        "url": "https://lingua-robot.p.rapidapi.com/language/v1/entries/en/" + word,
        "method": "GET",
        "headers": {
            "x-rapidapi-host": "lingua-robot.p.rapidapi.com",
            "x-rapidapi-key": "8e2328f425msh2d328d9ba7a05b9p1b4dbcjsn643478137e8c"
        }
    }
    
    $.ajax(linguaApi).done(function (response) {

        if (response.entries.length != 0){
            var defSection = document.getElementById('definition')
            var word = response.entries[0].entry
    
            defSection.innerHTML = `<h2>${word}</h2>
                                <hr>`
        
            response.entries.forEach(element => {
                let div = document.createElement('div')
    
                element.lexemes.forEach(item => { 
                    let h5 = document.createElement('h5')
                    h5.innerText = item.partOfSpeech
                    div.append(h5)
    
                    let ul = document.createElement('ul')
                    item.senses.forEach(thing =>{
                        let list = document.createElement('li')
                        list.innerText = thing.definition
                        ul.append(list)
                    })
                    div.append(ul)
    
                })
                defSection.append(div)
    
                getExample(word)
                getGif(word)
            })
        }else {
            let noData = document.getElementById('definition')
            noData.innerHTML = `<h2>Invalid word</h2>
                                <p>Please try another word</p>`
    
            let noResult = document.getElementById('gif-section')
            noResult.innerHTML = `
            <image src="https://media.giphy.com/media/dxaySonu5EggWBqCWQ/giphy.gif"
            " width="480" height="270" </image>`
            
        }
    });
    
    function getExample(word){
        var owlApi = {
            "url": "https://owlbot.info/api/v4/dictionary/" + word,
            "method": 'GET',
            "headers": {
                        'Authorization': 'Token ' + '6ff57ab675eb47c2ef7cd272790a54a9e15221f7'
                        }
        }
        $.ajax(owlApi).done(function (response) {

           let div = document.createElement('div')
           div.innerHTML =  (`<h5>Usage</h5>
                    <h6>Example : </h6>`)
            
            let section = document.querySelector('#definition')
        
            response.definitions.forEach(item => {
                let par = document.createElement('p')
                 par.innerHTML = `<i>${item.example}</i>`
                div.append(par)
            });
            section.append(div)
         }) 
    
    }
      
    function getGif(word){
        //  reference https://medium.com/@daniellevass/using-apis-part-2-javascript-giphy-73a8bba3
    
    $.get({
        url: "https://api.giphy.com/v1/gifs/search?api_key=NvAjnwbFTbaAybXWnjzIEb4KNHrU5sqP&q=" + word + "&limit=10&rating=g&lang=en",
         success: function(result) {

             var data = result.data
             let gifDiv = document.getElementById('gif-section')
            
            // Empty all the gif image in the Gif-Section
            while(gifDiv.firstChild != null ){
                gifDiv.removeChild(gifDiv.firstChild)
            }
  
             for (var index in data) {
                 let gifObject = data[index]
                 let gifURL = gifObject.images.fixed_width.url

                 // Reference : https://www.techiedelight.com/load-and-append-image-to-dom-javascript/
                 let gifImage = new Image()
                 gifImage.src = gifURL
                 document.getElementById('gif-section').append(gifImage)
             }
         },
         error: function(error) {
             console.log(error)
         }
    })
      
    }
   
}








//https://gist.github.com/nealrs/28dbfe2c74dfdde26a30

//  var getApi = $.get("https://api.giphy.com/v1/gifs/search?api_key=NvAjnwbFTbaAybXWnjzIEb4KNHrU5sqP&q=cheese&limit=10&rating=g&lang=en");
 


// getApi.done(function(data) { 
//     if (getApi.status >= 200 && getApi.status < 400){
//         for (var index in data) {
//             let gifObject = data[index]
//             let gifURL = gifObject.images.original.url
//             console.log(gifURL)
//         }
//     //document.getElementById("gif-section").innerHTML = '<center><img src = "'+gif+'"  title="GIF via Giphy"></center>';
//     }
// });


// import { renderGif } from '@giphy/js-components'
// import { GiphyFetch } from '@giphy/js-fetch-api'

// // create a GiphyFetch with your api key
// const gf = new GiphyFetch('NvAjnwbFTbaAybXWnjzIEb4KNHrU5sqP')

// const vanillaJSGif = async (mountNode: HTMLElement) => {
//     // render a single gif
//     const { data: gif1 } = await gf.gif('fpXxIjftmkk9y')
//     renderGif({ gif: gif1, width: 300 }, mountNode)
// }


// var settings = {
// 	"async": true,
// 	"crossDomain": true,
// 	"url": "https://joughtred-oxford-english-dictionary-v1.p.rapidapi.com/words/owl",
// 	"method": "GET",
// 	"headers": {
// 		"x-rapidapi-host": "joughtred-oxford-english-dictionary-v1.p.rapidapi.com",
// 		"x-rapidapi-key": "8e2328f425msh2d328d9ba7a05b9p1b4dbcjsn643478137e8c"
// 	}
// }

// $.ajax(settings).done(function (response) {
// 	console.log(response);
// });
