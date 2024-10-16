const Word = require("./Word.js")


class List{

    constructor(name="", words=[], groups=[]){
        this.name = name;
        this.words = words;
        this.groups = groups;
    }

    fromString(string){
        this.words = []
        string = string.split("\n")
        for(let i = 0; i<string.length; i++){
            if(string[i] != ""){
                var word = new Word();
                word.fromString(string[i])
                this.words.push(word);
            }
        }
    }

    fromJson(string){
        let jsonData = JSON.parse(string)
        this.name = jsonData.name
        for(let wordData of jsonData.words){
            let newWord = new Word()
            newWord.fromJson(wordData)
            this.words.push(newWord)
        }
    }

    length(){
        return this.words.length;
    }

    getWordByIndex(index){
        if(index >= 0 && index < this.length()){
            return this.words[index];
        }else{
            return new Word();
        }
    }

    toJson(){
        return JSON.stringify(this, null, 4);
    }

    

}

module.exports = List;