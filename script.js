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
    }
}


class CookbookService {
    static url = 'https://634eed79df22c2af7b46c545.mockapi.io/cookbook'

    static getAllCookbooks(){
        return $.get(this.url);
    }

    static getCookbook(id) {
        return $.get(this.url + `/${id}`);
    }

    static createCookbook(cookbook) {
        return $.post(this.url, cookbook);
    }

    static updateCookbook(cookbook){
        return $.ajax({
            url: this.url + `/${cookbook.id}`,
            dataType: 'json',
            data: JSON.stringify(cookbook),
            contentType: 'application/json',
            type: 'PUT'
        });
    }

    static deleteCookbook(id) {
        return $.ajax({
            url: this.url + `/${id}`,
            type: 'DELETE'
        });
    }
}


class DOMManager {
    static cookbooks;

    static getAllCookbooks() {
        CookbookService.getAllCookbooks().then(cookbooks => this.renderCookbooks(cookbooks));
    }

    static deleteCookbook(id) {
       CookbookService.deleteCookbook(id)
        .then(() =>{
            return CookbookService.getAllCookbooks();
        })
        .then((cookbooks) => this.renderCookbooks(cookbooks));
    }

    static addRecipe(id) {
        for(let cookbook of this.cookbooks) {
            if (cookbook.id == id) {
                cookbook.recipes.push(new Recipe($(`#${cookbook.id}-recipe-name`).val()));
                CookbookService.updateCookbook(cookbook) 
                   .then(() => {
                        return CookbookService.getAllCookbooks();
                   })
                .then((cookbooks) => this.renderCookbooks(cookbooks));            
            }
        }
    }

    static createCookbook(name) {
        CookbookService.createCookbook(new Cookbook(name))
        .then(() => {
            return CookbookService.getAllCookbooks();
        })
        .then((cookbooks) => this.renderCookbooks(cookbooks));
    }

    static deleteRecipe(cookbookId, recipeName){
        for (let cookbook of this.cookbooks){
            if (cookbook.id == cookbookId){
                for(let recipe of cookbook.recipes){
                    if(recipe.name == recipeName){
                        cookbook.recipes.splice(cookbook.recipes.indexOf(recipe), 1);
                        CookbookService.updateCookbook(cookbook)
                            .then(() => {
                                return CookbookService.getAllCookbooks();
                                
                            })
                            .then((cookbooks) => this.renderCookbooks(cookbooks))
                    }
                }
            }
        }
    }

  
    static renderCookbooks(cookbooks) {
        this.cookbooks = cookbooks;
        $('#app').empty();
    
        for (let cookbook of cookbooks) {
            $('#app').append(`
                <div id="${cookbook.id}" class="card text-center mb-5">
                    <div class="card-header">
                        <h2>${cookbook.name}</h2>
                        <!-- <button class="btn btn-success" onclick="DOMManager.renderRecipes('${cookbook.id}')">Open Your ${cookbook.name} Cookbook</button> -->
                        <button class="btn btn-danger" onclick="DOMManager.deleteCookbook('${cookbook.id}')">Delete</button>
                    </div>
                    <div class="card-body">
                        <div class="card">
                            <div class="row">
                                <div class="col-sm">
                                    <input type="text" id="${cookbook.id}-recipe-name" class="form-control" placeholder="Recipe Name">
                                </div>
                                <!--<div class="col-sm">
                                    <input type="text" id="${cookbook.id}-recipe-name" class="form-control" placeholder="Recipe Name">
                                </div> -->
                            </div>
                            <button id="${cookbook.id}-new-recipe" onclick="DOMManager.addRecipe('${cookbook.id}')" class="btn btn-success formcontrol mb-4">Add</button>
                        </div>
                    </div>
                </div><br>
            `);
            for(let recipe of cookbook.recipes) {
                $(`#${cookbook.id}`).find('.card-body').append(`
                <p>
                    <span id="name-${recipe.name}"><strong>Recipe: </strong>${recipe.name}</span>
                    <button class="btn btn-success" onclick="#">Open</button>
                    <button class="btn btn-danger" onclick="DOMManager.deleteRecipe('${cookbook.id}', '${recipe.name}')">Delete Recipe</button>
                    
                </p>
                
                `)
            }
        }
    }
}

$('#new-cookbook-btn').click(() => {
    DOMManager.createCookbook($('#new-cookbook-name').val());
    $('#new-cookbook-name').val('');
});


DOMManager.getAllCookbooks();















