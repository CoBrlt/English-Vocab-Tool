class Example{
    constructor(english="", french=""){
        this.english = english;
        this.french = french;
    }

    fromJson(exampleData){
        this.english = exampleData.english;
        this.french = exampleData.french;
    }

    getFrench(){
        return this.french;
    }

    getEnglish(){
        return this.english;
    }


}

module.exports = Example;