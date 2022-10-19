class Cookbook {
    constructor(name) {
        this.name = name;
        this.recipes = [];
    }

    addRecipe(name) {
        this.recipes.push(new Recipe(name));
    }
}

class Recipe {
    constructor(name){
        this.name = name;
        this.ingredients = [];
    }
}

class Ingredients {
    constructor(name, amount, measurement){
        this.name = name;
        this.amount = amount;
        this.measurement = measurement;
    }
}

class CookbookService {
    static url = 'https://634eed79df22c2af7b46c545.mockapi.io/cookbook'

    static getAllCookbooks(){
        return $.get(this.url);
    }

    static getCookbook(id) {
        return $.get(this.url + `/${id}`)
    }

    static createCookbook(cookbook) {
        return $.post(this.url, cookbook);
    }

    static updateCookbook(cookbook){
        return $.ajax({
            url: this.url + `/${cookbook._id}`,
            dataType: 'json',
            data: JSON.stringify(cookbook),
            contentType: 'application/json',
            type: 'PUT'
        });
    }

    static deleteCookbook(id) {
        return $.ajax({
            url: this.url+`/${id}`,
            type: 'DELETE'
        });
    }
}

class DOMManager {
    static cookbooks;

    static getAllCookbooks() {
        CookbookService.getAllCookbooks().then(cookbooks =>this.render(cookbooks));
    }

    static deleteCookbook(id) {
       CookbookService.deleteCookbook(id)
        .then(() =>{
            return CookbookService.getAllCookbooks();
        })
        .then((cookbooks) => this.render(cookbooks));
    }

    static createCookbook(name) {
        CookbookService.createCookbook(new Cookbook(name))
        .then(() => {
            return CookbookService.getAllCookbooks();
        })
        .then((cookbooks) => this.render(cookbooks));
    }

    static render(cookbooks) {
        this.cookbooks = cookbooks;
        $('#app').empty();
        for (let cookbook of cookbooks) {
            $('#app').prepend(`
                           <div id="${cookbook._id}" class="card text-center mb-5">
                                <div class="card-header">
                                    <h2>${cookbook.name}</h2>
                                    <button class="btn btn-success" onclick="DOMManager.updateCookbook('${cookbook._id}')">Open Your ${cookbook.name} Cookbook</button>
                                    <button class="btn btn-danger" onclick="DOMManager.deleteCookbook('${cookbook._id}')">Delete</button>
                                </div>
                            </div>`
            );
            for (let recipe of cookbook.recipes) {

            }
        }
    }
}

$('#new-cookbook-btn').click(() => {
    DOMManager.createCookbook($('#new-cookbook-name').val());
    $('new-cookbook-name').val('');
})


DOMManager.getAllCookbooks();















