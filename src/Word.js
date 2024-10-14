const Example = require("./Example.js")

class Word{

    constructor(english="", french=[], examples=[]){
        this.english = english;
        this.french = french;
        this.examples = examples;
    }

    fromString(string) {
        string = string.split("=")
        if(string.length > 1){
            string[1] = string[1].split("|")
        }
        if(string.length == 3){
            string[2] = string[2].split("|")
            for(let allExample of string[2]){
                allExample = allExample.split(":")
                if(allExample.length == 2){
                    let tmpExample = new Example(allExample[0], allExample[1])
                    this.examples.push(tmpExample)
                    
                }
            }
            // string[2] = string[2].replaceAll(":", "</br>")
        }
        // console.log(string[i])
        this.english = string[0]
        this.french = string[1]
    }

    fromJson(wordData){
        this.english = wordData.english
        this.french = wordData.french
        for(let example of wordData.examples){
            let newExample = new Example();
            newExample.fromJson(example)
            this.examples.push(newExample);
        }
    }

    getEnglish(){
        return this.english;
    }

    getFrench(){
        return this.french;
    }

    getExamples(){
        return this.examples;
    }

}

module.exports = Word;