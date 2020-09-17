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
                "x-rapidapi-key": "8e2328f425msh2d328d9ba7a05b9p1b4dbcjsn643478137e8c",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Credentials": "true",
                "Access-Control-Max-Age": "1800",
                "Access-Control-Allow-Headers": "content-type",
                "Access-Control-Allow-Methods": "PUT, POST, GET, DELETE, PATCH, OPTIONS" 
            }
        }

        $.ajax(linguaApi).done(function (response) {
    
            if (response.entries.length != 0){
                var defSection = document.getElementById('definition')
                var word = response.entries[0].entry
        
                defSection.innerHTML = `<h2>${word}</h2>
                                    <br>`
            
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
                    getOtherWords(word)
                })
            }else {
                let noData = document.getElementById('definition')
                noData.innerHTML = `<h2>Invalid word</h2>
                                    <p>Please try another word</p>`
        
                let noResult = document.getElementById('gif-section')
                noResult.innerHTML = `
                <image src="https://media.giphy.com/media/dxaySonu5EggWBqCWQ/giphy.gif"
                " width="480" height="270" </image>`
                
                let noInput = document.getElementById('similar')
                while(noInput.firstChild != null ){
                    noInput.removeChild(noInput.firstChild)
                }
            }
        });
}
   

    
    
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
   


// This function grabs the possible two words being used
function getOtherWords(word){
   $.ajax({
        url: "https://www.dictionaryapi.com/api/v3/references/collegiate/json/" + word + "?key=bbfd65bd-3a2b-4bdd-8197-092a579c9a35",
        method: "GET"
        }).done(function(response){

            let div = document.getElementById('similar')
            while(div.firstChild != null ){
                div.removeChild(div.firstChild)
            }

            div.innerHTML = `<h2>Other usage </h2>
                                <br>`

            let ul = document.createElement('ul')
            ul.className = "similar-list"
            ul.setAttribute('style', 'list-style: none;')

            for (let i = 0; i < response.length; i++){
                let wordId = response[i].meta.id
                let wordCheck = response[i].hwi.hw

                if (!(response[i].hom) && wordCheck.toLowerCase() != word){
                    let list = document.createElement('li')
                    list.style.cursor = 'pointer'
                    list.innerHTML = wordId
                    ul.append(list)
                }
                div.append(ul)
            }

            let similarList = document.querySelectorAll('.similar-list')
            for (const item of similarList){
                item.onclick = (event) => {
                    let word = event.target.innerHTML
                    pasteInModal(word)
                }
            }
    
        })
}

function pasteInModal(word){
    let joinWords = encodeURIComponent(word)

    var dictionaryApi = {
        "url": "https://www.dictionaryapi.com/api/v3/references/collegiate/json/" + joinWords + "?key=bbfd65bd-3a2b-4bdd-8197-092a579c9a35",
        "method": "GET"
    }

    $.ajax(dictionaryApi).done(function (response) {
     
        let modalHeader = document.querySelectorAll('.modal-header')
        modalHeader[0].innerHTML = `<h5>${word}</h5>`

        let shortDef = response[0].shortdef[0]
        let modalBody = document.querySelectorAll('.modal-body')
        modalBody[0].innerHTML = `<p>${shortDef}</p>`

        $.get({
            url: "https://api.giphy.com/v1/gifs/search?api_key=NvAjnwbFTbaAybXWnjzIEb4KNHrU5sqP&q=" + word + "&limit=5&rating=g&lang=en",
                success: function(result) {
                        var data = result.data
                        let div = document.getElementById('content')
                        console.log(div)

                            for (var index in data) {
                                let gifObject = data[index]
                                let gifURL = gifObject.images.fixed_width.url

                                // Reference : https://www.techiedelight.com/load-and-append-image-to-dom-javascript/
                                let gifImage = new Image()
                                gifImage.src = gifURL
                                div.append(gifImage)
                            }
                }
        })

        let modalPopup = document.querySelector('.modal')
        modalPopup.style.display = 'block'

        let closeBtnsEl = document.querySelectorAll('.btn-secondary')
        for (let i = 0; i < closeBtnsEl.length; i++){
            closeBtnsEl[i].addEventListener('click', (event)=>{ 
                modalPopup.style.display = 'none'
            })
        }
    })
}
