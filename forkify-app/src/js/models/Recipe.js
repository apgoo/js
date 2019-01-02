import axios from 'axios';
import { url, key } from '../config';

export default class Recipe {
    constructor(id) {
        this.id = id;
    }

    async putRecipeSearch() {
        try{
            const res = await axios(`${url}get?key=${key}&rId=${this.id}`);
            this.title = res.data.recipe.title;
            this.author = res.data.recipe.publisher;
            this.img = res.data.recipe.image_url;
            this.url = res.data.recipe.source_url;
            this.ingredients = res.data.recipe.ingredients;

            //console.log(res);
        } catch(error) {
            console.log(error);
            alert(error);
        }
    };

    calcTime() {
        const numIng = this.ingredients.length;
        const period = Math.ceil(numIng / 3);
        this.time = period * 15; 
    };

    calcServings() {
        this.serving = 4;
    };


    parseIngrediant() {
        const unitLong = ['tablespoons', 'tablespoon', 'ounces', 'ounce', 'teaspoons', 'teaspoon', 'cups', 'pounds'];
        const unitShort = ['tbsp', 'tbsp', 'oz', 'oz', 'tsp', 'tsp', 'cup', 'pound'];
        const units = [...unitShort, 'kg', 'g'];

        const newIngred = this.ingredients.map(el => {
           let ingree =  el.toLowerCase();

           //1. uniform incrediant unit
            unitLong.forEach((unit, i) => {
                ingree = ingree.replace(unit, unitShort[i]);
            });

            // 2.remove parenthees
            ingree = ingree.replace(/ *\([^)]*\) */g, ' ');

            //3.parse  into count 
            const arrIngr = ingree.split(' ');
            const unitIndex = arrIngr.findIndex(ele => units.includes(ele));

            let objAry;
            if(unitIndex > -1) {
                //there is unit

                const arrCount = arrIngr.slice(0, unitIndex);

                let count;
                if(arrCount.length === 1) {
                    count = eval(arrIngr[0].replace('-', '+'));
                } else {
                    count = eval(arrIngr.slice(0, unitIndex).join('+'));
                }

                objAry = {
                    count,
                    unit: arrIngr[unitIndex],
                    ingree: arrIngr.slice(unitIndex + 1).join(' ')
                };

            }
            else if(parseInt(arrIngr[0], 10)) {
                //no unit but 1 st is an number
                objAry = {
                    count : parseInt(arrIngr[0], 10),
                    unit: '',
                    ingree: arrIngr.slice(1).join(' ')
                }
            }
             else if(unitIndex === -1) {
                //no unit no number in first position
                objAry = {
                    count : 1,
                    unit: '',
                    ingree
                }
             }

            return objAry;

        });
        this.ingredients = newIngred;
    };

    updateServing(type) {
        //serving
        const newServing = type === 'dec' ? this.serving - 1 : this.serving + 1;

        // ingrdiant
        this.ingredients.forEach(ing => {
            ing.count *= (newServing / this.serving);
        });

        this.serving = newServing;
    }

}