class Cookbook {
    constructor(name){
        this.name = name;
        this.recipes =[];
    }
}

class Recipes {
    constructor (name, ingredients){
        this.name = name;
        this.ingredients = ingredients;
    }
}

class CookbookService {
    static url = "https://"

    static getAllRecipes(){
        return $.get(this.url);
    }
    static getRecipe(id) {
        return $.get(this.url + `/${id}`);
    }
}
//not sure if this is needed for my app

