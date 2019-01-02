import axios from 'axios';
import { url, key } from '../config';


export default class Search {
    constructor(query) {
        this.query = query;
    }

    async getSearchResult() {
        
        try {
            const res = await axios(`${url}search?key=${key}&q=${this.query}`);
            this.result = res.data.recipes;
            //console.log(this.result);
        }
        catch (error) {
            alert('search obj error :(');
            console.log(error);
        }
    };
}
